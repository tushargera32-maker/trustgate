"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  ActionResult,
  APPLICATION_STATUSES,
  STATUS_PROGRESS,
  attempt,
  fail,
  idSchema,
  parse,
  staffGuard
} from "@/lib/actions/core";

/**
 * Application CRUD. Staff-only — a client can read their own application but
 * cannot change its status, which is the whole point of a managed service.
 */

const createSchema = z.object({
  clientId: idSchema,
  countryId: idSchema,
  visaTypeId: idSchema.optional().nullable(),
  caseOwnerId: idSchema.optional().nullable(),
  status: z.enum(APPLICATION_STATUSES).default("CONSULTATION_COMPLETED"),
  internalNotes: z.string().max(5000).optional().nullable()
});

const updateSchema = z.object({
  id: idSchema,
  status: z.enum(APPLICATION_STATUSES).optional(),
  caseOwnerId: idSchema.optional().nullable(),
  internalNotes: z.string().max(5000).optional().nullable(),
  decisionOutcome: z.string().max(200).optional().nullable()
});

function revalidateApplication(id?: string) {
  revalidatePath("/admin/applications");
  revalidatePath("/admin");
  revalidatePath("/client/application");
  revalidatePath("/client");
  if (id) revalidatePath(`/admin/applications/${id}`);
}

/**
 * References are human-facing and must be unique. Generated from the year plus
 * a zero-padded sequence so they sort and read correctly: TG-2026-0042.
 */
async function nextReference() {
  const year = new Date().getFullYear();
  const count = await prisma.application.count({
    where: { reference: { startsWith: `TG-${year}-` } }
  });
  return `TG-${year}-${String(count + 1).padStart(4, "0")}`;
}

export async function createApplication(
  input: unknown
): Promise<ActionResult<{ id: string; reference: string }>> {
  const guard = await staffGuard();
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(createSchema, input);
  if (!parsed.ok) return fail(parsed.error, parsed.fieldErrors);

  const result = await attempt(async () => {
    const application = await prisma.application.create({
      data: {
        ...parsed.data,
        reference: await nextReference(),
        progressPct: STATUS_PROGRESS[parsed.data.status]
      },
      select: { id: true, reference: true }
    });

    // Every status change is recorded, so the client portal timeline and the
    // admin audit trail are the same data rather than two versions of it.
    await prisma.applicationTimeline.create({
      data: {
        applicationId: application.id,
        status: parsed.data.status,
        note: "Application opened",
        // Internal by default; staff decide what the client sees.
        visibleToClient: true
      }
    });

    return application;
  });

  if (result.ok) revalidateApplication(result.data.id);
  return result;
}

export async function updateApplication(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const guard = await staffGuard();
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(updateSchema, input);
  if (!parsed.ok) return fail(parsed.error, parsed.fieldErrors);

  const { id, status, ...rest } = parsed.data;

  const result = await attempt(async () => {
    const application = await prisma.application.update({
      where: { id },
      data: {
        ...rest,
        ...(status
          ? {
              status,
              progressPct: STATUS_PROGRESS[status],
              // Stamp the milestone dates rather than leaving them to be set
              // by hand, where they drift out of step with the status.
              ...(status === "APPLICATION_SUBMITTED"
                ? { submittedAt: new Date() }
                : {}),
              ...(status === "DECISION_RECEIVED"
                ? { decisionAt: new Date() }
                : {})
            }
          : {})
      },
      select: { id: true }
    });

    if (status) {
      await prisma.applicationTimeline.create({
        data: {
          applicationId: id,
          status,
          note: "Status updated",
          visibleToClient: true
        }
      });
    }

    return application;
  });

  if (result.ok) revalidateApplication(id);
  return result;
}

export async function deleteApplication(
  id: string
): Promise<ActionResult<{ id: string }>> {
  // Deleting a case file destroys the client's record of what happened, so
  // this is restricted further than the rest of the module.
  const guard = await staffGuard("SUPER_ADMIN", "ADMIN");
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(idSchema, id);
  if (!parsed.ok) return fail(parsed.error);

  const result = await attempt(() =>
    prisma.application.delete({
      where: { id: parsed.data },
      select: { id: true }
    })
  );

  if (result.ok) revalidateApplication();
  return result;
}

export async function addApplicationNote(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const guard = await staffGuard();
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(
    z.object({
      applicationId: idSchema,
      note: z.string().trim().min(1).max(2000),
      visibleToClient: z.boolean().default(false)
    }),
    input
  );
  if (!parsed.ok) return fail(parsed.error, parsed.fieldErrors);

  const result = await attempt(async () => {
    const application = await prisma.application.findUnique({
      where: { id: parsed.data.applicationId },
      select: { status: true }
    });
    if (!application) throw new Error("Application not found");

    return prisma.applicationTimeline.create({
      data: {
        applicationId: parsed.data.applicationId,
        status: application.status,
        note: parsed.data.note,
        // Case notes are internal unless explicitly shared.
        visibleToClient: parsed.data.visibleToClient
      },
      select: { id: true }
    });
  });

  if (result.ok) revalidateApplication(parsed.data.applicationId);
  return result;
}
