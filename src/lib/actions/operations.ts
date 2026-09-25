"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  ActionResult,
  APPOINTMENT_STATUSES,
  PAYMENT_STATUSES,
  LEAD_STAGES,
  assertOwnership,
  attempt,
  clientGuard,
  fail,
  idSchema,
  parse,
  staffGuard
} from "@/lib/actions/core";

/* ═══════════════════════════ appointments ═══════════════════════════ */

function revalidateAppointments() {
  revalidatePath("/admin/appointments");
  revalidatePath("/client/appointments");
  revalidatePath("/client");
}

const appointmentBase = z.object({
  title: z.string().trim().min(2, "Give the appointment a title.").max(160),
  type: z.enum(["consultation", "call", "meeting"]),
  scheduledAt: z.coerce.date().refine((d) => d.getTime() > Date.now() - 60_000, {
    message: "Pick a time in the future."
  }),
  durationMin: z.number().int().min(10).max(240).default(30),
  notes: z.string().trim().max(2000).optional().nullable()
});

export async function createAppointment(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const guard = await staffGuard();
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(
    appointmentBase.extend({
      clientId: idSchema.optional().nullable(),
      applicationId: idSchema.optional().nullable()
    }),
    input
  );
  if (!parsed.ok) return fail(parsed.error, parsed.fieldErrors);

  const result = await attempt(() =>
    prisma.appointment.create({
      data: {
        ...parsed.data,
        staffId: guard.session.user.id,
        status: "CONFIRMED"
      },
      select: { id: true }
    })
  );

  if (result.ok) revalidateAppointments();
  return result;
}

/** A client asks for a slot; staff confirm it. Requests are never auto-confirmed. */
export async function requestAppointment(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const guard = await clientGuard();
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(appointmentBase, input);
  if (!parsed.ok) return fail(parsed.error, parsed.fieldErrors);

  const result = await attempt(() =>
    prisma.appointment.create({
      data: {
        ...parsed.data,
        clientId: guard.client.id,
        status: "REQUESTED"
      },
      select: { id: true }
    })
  );

  if (result.ok) revalidateAppointments();
  return result;
}

export async function updateAppointmentStatus(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const guard = await staffGuard();
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(
    z.object({ id: idSchema, status: z.enum(APPOINTMENT_STATUSES) }),
    input
  );
  if (!parsed.ok) return fail(parsed.error, parsed.fieldErrors);

  const result = await attempt(() =>
    prisma.appointment.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status },
      select: { id: true }
    })
  );

  if (result.ok) revalidateAppointments();
  return result;
}

/** A client may cancel their own appointment, and only their own. */
export async function cancelMyAppointment(
  id: string
): Promise<ActionResult<{ id: string }>> {
  const guard = await clientGuard();
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(idSchema, id);
  if (!parsed.ok) return fail(parsed.error);

  const existing = await prisma.appointment.findUnique({
    where: { id: parsed.data },
    select: { clientId: true }
  });

  const ownershipError = await assertOwnership(guard.client.id, existing?.clientId);
  if (ownershipError) return fail(ownershipError);

  const result = await attempt(() =>
    prisma.appointment.update({
      where: { id: parsed.data },
      data: { status: "CANCELLED" },
      select: { id: true }
    })
  );

  if (result.ok) revalidateAppointments();
  return result;
}

/* ═══════════════════════════ payments ═══════════════════════════ */

function revalidatePayments() {
  revalidatePath("/admin/payments");
  revalidatePath("/client/payments");
  revalidatePath("/admin");
}

export async function createPayment(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  // Finance data is scoped tighter than the rest of the admin panel.
  const guard = await staffGuard("SUPER_ADMIN", "ADMIN", "FINANCE");
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(
    z.object({
      clientId: idSchema,
      applicationId: idSchema.optional().nullable(),
      amount: z.number().positive("Amount must be greater than zero.").max(1_000_000),
      currency: z.string().trim().length(3).toUpperCase().default("GBP"),
      description: z.string().trim().max(300).optional().nullable(),
      invoiceNo: z.string().trim().max(60).optional().nullable()
    }),
    input
  );
  if (!parsed.ok) return fail(parsed.error, parsed.fieldErrors);

  const result = await attempt(() =>
    prisma.payment.create({
      data: { ...parsed.data, status: "PENDING" },
      select: { id: true }
    })
  );

  if (result.ok) revalidatePayments();
  return result;
}

export async function updatePaymentStatus(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const guard = await staffGuard("SUPER_ADMIN", "ADMIN", "FINANCE");
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(
    z.object({
      id: idSchema,
      status: z.enum(PAYMENT_STATUSES),
      providerRef: z.string().trim().max(120).optional().nullable()
    }),
    input
  );
  if (!parsed.ok) return fail(parsed.error, parsed.fieldErrors);

  const result = await attempt(() =>
    prisma.payment.update({
      where: { id: parsed.data.id },
      data: {
        status: parsed.data.status,
        providerRef: parsed.data.providerRef,
        paidAt: parsed.data.status === "PAID" ? new Date() : null
      },
      select: { id: true }
    })
  );

  if (result.ok) revalidatePayments();
  return result;
}

/* ═══════════════════════════ messages ═══════════════════════════ */

function revalidateMessages() {
  revalidatePath("/admin/applications");
  revalidatePath("/client/messages");
  revalidatePath("/client");
}

/**
 * Both sides post here. `isInternal` is forced false for clients — a client
 * must never be able to write a staff-only note, and must never read one.
 */
export async function sendMessage(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = parse(
    z.object({
      applicationId: idSchema.optional().nullable(),
      body: z.string().trim().min(1, "Write a message first.").max(5000),
      isInternal: z.boolean().default(false)
    }),
    input
  );
  if (!parsed.ok) return fail(parsed.error, parsed.fieldErrors);

  const staff = await staffGuard();
  const isStaff = !("error" in staff);

  let senderId: string;

  if (isStaff) {
    senderId = staff.session.user.id;
  } else {
    const client = await clientGuard();
    if ("error" in client) return fail(client.error);
    senderId = client.session.user.id;

    if (parsed.data.applicationId) {
      const application = await prisma.application.findUnique({
        where: { id: parsed.data.applicationId },
        select: { clientId: true }
      });
      const ownershipError = await assertOwnership(
        client.client.id,
        application?.clientId
      );
      if (ownershipError) return fail(ownershipError);
    }
  }

  const result = await attempt(() =>
    prisma.message.create({
      data: {
        applicationId: parsed.data.applicationId,
        body: parsed.data.body,
        senderId,
        isInternal: isStaff ? parsed.data.isInternal : false
      },
      select: { id: true }
    })
  );

  if (result.ok) revalidateMessages();
  return result;
}

/* ═══════════════════════════ leads ═══════════════════════════ */

function revalidateLeads() {
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function updateLead(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const guard = await staffGuard();
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(
    z.object({
      id: idSchema,
      stage: z.enum(LEAD_STAGES).optional(),
      assignedToId: idSchema.optional().nullable(),
      notes: z.string().trim().max(4000).optional().nullable()
    }),
    input
  );
  if (!parsed.ok) return fail(parsed.error, parsed.fieldErrors);

  const { id, ...data } = parsed.data;

  const result = await attempt(() =>
    prisma.lead.update({ where: { id }, data, select: { id: true } })
  );

  if (result.ok) revalidateLeads();
  return result;
}

export async function deleteLead(
  id: string
): Promise<ActionResult<{ id: string }>> {
  const guard = await staffGuard("SUPER_ADMIN", "ADMIN");
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(idSchema, id);
  if (!parsed.ok) return fail(parsed.error);

  const result = await attempt(() =>
    prisma.lead.delete({ where: { id: parsed.data }, select: { id: true } })
  );

  if (result.ok) revalidateLeads();
  return result;
}
