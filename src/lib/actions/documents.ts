"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  ActionResult,
  DOCUMENT_STATUSES,
  assertOwnership,
  attempt,
  clientGuard,
  fail,
  idSchema,
  parse,
  staffGuard
} from "@/lib/actions/core";

/**
 * Documents have two sides:
 *   staff  — request a document, then verify or reject what arrives
 *   client — upload against a request, and replace a rejected file
 *
 * A client may only touch documents on their own record. The clientId is
 * always resolved from the session, never accepted from the browser.
 */

function revalidateDocuments() {
  revalidatePath("/admin/documents");
  revalidatePath("/client/documents");
  revalidatePath("/client");
  revalidatePath("/admin");
}

/* ─────────────────────────── staff ─────────────────────────── */

export async function requestDocument(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const guard = await staffGuard();
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(
    z.object({
      clientId: idSchema,
      applicationId: idSchema.optional().nullable(),
      title: z.string().trim().min(2, "Give the document a name.").max(160)
    }),
    input
  );
  if (!parsed.ok) return fail(parsed.error, parsed.fieldErrors);

  const result = await attempt(() =>
    prisma.document.create({
      data: { ...parsed.data, status: "REQUESTED" },
      select: { id: true }
    })
  );

  if (result.ok) revalidateDocuments();
  return result;
}

export async function reviewDocument(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const guard = await staffGuard();
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(
    z.object({
      id: idSchema,
      decision: z.enum(DOCUMENT_STATUSES),
      note: z.string().trim().max(1000).optional().nullable()
    }),
    input
  );
  if (!parsed.ok) return fail(parsed.error, parsed.fieldErrors);

  const { id, decision, note } = parsed.data;

  // A rejection the client cannot act on is worse than no rejection, so a
  // reason is required whenever we send a document back.
  if (
    (decision === "REJECTED" || decision === "REPLACEMENT_REQUIRED") &&
    !note?.trim()
  ) {
    return fail("Tell the client what needs fixing.", {
      note: ["A reason is required when returning a document."]
    });
  }

  const result = await attempt(async () => {
    const document = await prisma.document.update({
      where: { id },
      data: { status: decision, reviewerNote: note, reviewedAt: new Date() },
      select: { id: true }
    });

    await prisma.documentReview.create({
      data: {
        documentId: id,
        reviewerId: guard.session.user.id,
        decision,
        note
      }
    });

    return document;
  });

  if (result.ok) revalidateDocuments();
  return result;
}

export async function deleteDocument(
  id: string
): Promise<ActionResult<{ id: string }>> {
  const guard = await staffGuard("SUPER_ADMIN", "ADMIN", "CASE_MANAGER");
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(idSchema, id);
  if (!parsed.ok) return fail(parsed.error);

  const result = await attempt(() =>
    prisma.document.delete({ where: { id: parsed.data }, select: { id: true } })
  );

  if (result.ok) revalidateDocuments();
  return result;
}

/* ─────────────────────────── client ─────────────────────────── */

export async function submitDocumentUpload(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const guard = await clientGuard();
  if ("error" in guard) return fail(guard.error);

  const parsed = parse(
    z.object({
      documentId: idSchema,
      storageKey: z.string().trim().min(1),
      fileName: z.string().trim().min(1).max(255),
      mimeType: z.string().trim().max(120),
      sizeBytes: z.number().int().positive().max(10 * 1024 * 1024, {
        message: "Files must be 10MB or smaller."
      })
    }),
    input
  );
  if (!parsed.ok) return fail(parsed.error, parsed.fieldErrors);

  const existing = await prisma.document.findUnique({
    where: { id: parsed.data.documentId },
    select: { clientId: true }
  });

  const ownershipError = await assertOwnership(guard.client.id, existing?.clientId);
  if (ownershipError) return fail(ownershipError);

  const { documentId, ...file } = parsed.data;

  const result = await attempt(() =>
    prisma.document.update({
      where: { id: documentId },
      data: {
        ...file,
        status: "UPLOADED",
        uploadedAt: new Date(),
        // Clear the previous rejection so stale feedback is not shown against
        // a file that has since been replaced.
        reviewerNote: null,
        reviewedAt: null
      },
      select: { id: true }
    })
  );

  if (result.ok) revalidateDocuments();
  return result;
}
