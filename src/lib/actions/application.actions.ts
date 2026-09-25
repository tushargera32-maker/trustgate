"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  staffGuard,
  parse,
  attempt,
  ok,
  fail,
  idSchema,
  APPLICATION_STATUSES,
  STATUS_PROGRESS,
  type ActionResult
} from "./core";

/* ─────────────────────────── schemas ─────────────────────────── */

const updateStatusSchema = z.object({
  id: idSchema,
  status: z.enum(APPLICATION_STATUSES)
});

const addTimelineSchema = z.object({
  id: idSchema,
  status: z.enum(APPLICATION_STATUSES),
  note: z.string().min(1, "Note cannot be empty").max(2000),
  visibleToClient: z.boolean().default(true)
});

const addInternalNoteSchema = z.object({
  id: idSchema,
  note: z.string().min(1, "Note cannot be empty").max(5000)
});

const assignCaseOwnerSchema = z.object({
  id: idSchema,
  caseOwnerId: z.string().cuid("Invalid user ID").nullable()
});

/* ─────────────────────────── actions ─────────────────────────── */

/**
 * Update application status — changes status, progress percentage, and creates
 * a timeline entry automatically.
 */
export async function updateApplicationStatus(
  input: unknown
): Promise<ActionResult<void>> {
  const guard = await staffGuard();
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(updateStatusSchema, input);
  if (!parsed.ok) return parsed;

  const { id, status } = parsed.data;

  return attempt(async () => {
    // Verify application exists
    const app = await prisma.application.findUnique({
      where: { id },
      select: { id: true, status: true }
    });

    if (!app) {
      return fail("Application not found.");
    }

    // Update application and create timeline entry in a transaction
    await prisma.$transaction([
      prisma.application.update({
        where: { id },
        data: {
          status,
          progressPct: STATUS_PROGRESS[status],
          updatedAt: new Date()
        }
      }),
      prisma.applicationTimeline.create({
        data: {
          applicationId: id,
          status,
          note: `Status changed to ${status.replace(/_/g, " ").toLowerCase()}`,
          occurredAt: new Date(),
          visibleToClient: true
        }
      })
    ]);

    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${id}`);
    revalidatePath("/client/dashboard");

    return ok(undefined);
  });
}

/**
 * Add a timeline entry — staff can add notes with custom visibility.
 */
export async function addTimelineEntry(
  input: unknown
): Promise<ActionResult<void>> {
  const guard = await staffGuard();
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(addTimelineSchema, input);
  if (!parsed.ok) return parsed;

  const { id, status, note, visibleToClient } = parsed.data;

  return attempt(async () => {
    // Verify application exists
    const app = await prisma.application.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!app) {
      return fail("Application not found.");
    }

    await prisma.applicationTimeline.create({
      data: {
        applicationId: id,
        status,
        note,
        visibleToClient,
        occurredAt: new Date()
      }
    });

    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${id}`);
    revalidatePath("/client/dashboard");

    return ok(undefined);
  });
}

/**
 * Add internal notes — stored on the application record, never visible to client.
 */
export async function addInternalNote(
  input: unknown
): Promise<ActionResult<void>> {
  const guard = await staffGuard();
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(addInternalNoteSchema, input);
  if (!parsed.ok) return parsed;

  const { id, note } = parsed.data;

  return attempt(async () => {
    const app = await prisma.application.findUnique({
      where: { id },
      select: { internalNotes: true }
    });

    if (!app) {
      return fail("Application not found.");
    }

    // Append to existing notes with timestamp
    const timestamp = new Date().toISOString();
    const staffName = guard.session.user.name || "Staff";
    const entry = `[${timestamp}] ${staffName}:\n${note}\n\n`;
    const updated = (app.internalNotes || "") + entry;

    await prisma.application.update({
      where: { id },
      data: { internalNotes: updated }
    });

    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${id}`);

    return ok(undefined);
  });
}

/**
 * Assign case owner — assigns a staff member to manage the application.
 */
export async function assignCaseOwner(
  input: unknown
): Promise<ActionResult<void>> {
  const guard = await staffGuard();
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(assignCaseOwnerSchema, input);
  if (!parsed.ok) return parsed;

  const { id, caseOwnerId } = parsed.data;

  return attempt(async () => {
    // Verify application exists
    const app = await prisma.application.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!app) {
      return fail("Application not found.");
    }

    // If assigning to someone, verify they are staff
    if (caseOwnerId) {
      const user = await prisma.user.findUnique({
        where: { id: caseOwnerId },
        select: { role: true }
      });

      if (!user || user.role === "CLIENT") {
        return fail("Invalid case owner. Must be a staff member.");
      }
    }

    await prisma.application.update({
      where: { id },
      data: { caseOwnerId }
    });

    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${id}`);

    return ok(undefined);
  });
}

/**
 * Get staff members for assignment dropdown.
 */
export async function getStaffMembers(): Promise<
  ActionResult<Array<{ id: string; name: string; role: string }>>
> {
  const guard = await staffGuard();
  if ("error" in guard) return fail(guard.error);

  return attempt(async () => {
    const staff = await prisma.user.findMany({
      where: {
        role: { not: "CLIENT" },
        isActive: true
      },
      select: {
        id: true,
        name: true,
        role: true
      },
      orderBy: { name: "asc" }
    });

    return ok(staff.map(s => ({
      id: s.id,
      name: s.name || "Unknown",
      role: s.role
    })));
  });
}
