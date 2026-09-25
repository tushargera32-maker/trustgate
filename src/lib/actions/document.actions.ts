"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireStaff, getSession } from "@/lib/auth";
import { DocumentStatus } from "@prisma/client";

/**
 * Review a document (approve/reject)
 */
export async function reviewDocument(
  documentId: string,
  decision: "VERIFIED" | "REJECTED",
  note?: string
) {
  const session = await requireStaff();

  try {
    // Update document status and add reviewer note
    const document = await prisma.document.update({
      where: { id: documentId },
      data: {
        status: decision,
        reviewerNote: note || null,
        reviewedAt: new Date(),
      },
      include: {
        client: {
          include: {
            user: true,
          },
        },
      },
    });

    // Create a review record
    await prisma.documentReview.create({
      data: {
        documentId,
        reviewerId: session.user.id,
        decision,
        note: note || null,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: `document_${decision.toLowerCase()}`,
        entity: "Document",
        entityId: documentId,
        details: {
          documentTitle: document.title,
          clientName: document.client.user.name,
          note,
        },
      },
    });

    // Create notification for client
    await prisma.notification.create({
      data: {
        userId: document.client.userId,
        title:
          decision === "VERIFIED"
            ? "Document Verified"
            : "Document Rejected",
        message:
          decision === "VERIFIED"
            ? `Your document "${document.title}" has been verified.`
            : `Your document "${document.title}" requires attention. ${note || "Please check the notes."}`,
        type: decision === "VERIFIED" ? "SUCCESS" : "WARNING",
        link: `/client/documents`,
      },
    });

    revalidatePath("/admin/documents");
    revalidatePath("/client/documents");

    return { success: true, document };
  } catch (error) {
    console.error("Error reviewing document:", error);
    return { success: false, error: "Failed to review document" };
  }
}

/**
 * Update document status
 */
export async function updateDocumentStatus(
  documentId: string,
  status: DocumentStatus
) {
  await requireStaff();

  try {
    const document = await prisma.document.update({
      where: { id: documentId },
      data: {
        status,
        ...(status === "UNDER_REVIEW" && { reviewedAt: null }),
      },
    });

    revalidatePath("/admin/documents");
    revalidatePath("/client/documents");

    return { success: true, document };
  } catch (error) {
    console.error("Error updating document status:", error);
    return { success: false, error: "Failed to update document status" };
  }
}

/**
 * Request document replacement
 */
export async function requestDocumentReplacement(
  documentId: string,
  reason: string
) {
  const session = await requireStaff();

  try {
    const document = await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "REPLACEMENT_REQUIRED",
        reviewerNote: reason,
        reviewedAt: new Date(),
      },
      include: {
        client: {
          include: {
            user: true,
          },
        },
      },
    });

    // Create review record
    await prisma.documentReview.create({
      data: {
        documentId,
        reviewerId: session.user.id,
        decision: "REPLACEMENT_REQUIRED",
        note: reason,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "document_replacement_requested",
        entity: "Document",
        entityId: documentId,
        details: {
          documentTitle: document.title,
          clientName: document.client.user.name,
          reason,
        },
      },
    });

    // Notify client
    await prisma.notification.create({
      data: {
        userId: document.client.userId,
        title: "Document Replacement Required",
        message: `Please replace your document "${document.title}". Reason: ${reason}`,
        type: "WARNING",
        link: `/client/documents`,
      },
    });

    revalidatePath("/admin/documents");
    revalidatePath("/client/documents");

    return { success: true, document };
  } catch (error) {
    console.error("Error requesting document replacement:", error);
    return {
      success: false,
      error: "Failed to request document replacement",
    };
  }
}

/**
 * Add or update reviewer notes
 */
export async function updateReviewerNote(documentId: string, note: string) {
  await requireStaff();

  try {
    const document = await prisma.document.update({
      where: { id: documentId },
      data: {
        reviewerNote: note,
      },
    });

    revalidatePath("/admin/documents");

    return { success: true, document };
  } catch (error) {
    console.error("Error updating reviewer note:", error);
    return { success: false, error: "Failed to update reviewer note" };
  }
}

/**
 * Get document review history
 */
export async function getDocumentReviewHistory(documentId: string) {
  await requireStaff();

  try {
    const reviews = await prisma.documentReview.findMany({
      where: { documentId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, reviews };
  } catch (error) {
    console.error("Error fetching document review history:", error);
    return { success: false, error: "Failed to fetch review history" };
  }
}

/**
 * Bulk update document statuses
 */
export async function bulkUpdateDocumentStatus(
  documentIds: string[],
  status: DocumentStatus
) {
  await requireStaff();

  try {
    const result = await prisma.document.updateMany({
      where: {
        id: {
          in: documentIds,
        },
      },
      data: {
        status,
      },
    });

    revalidatePath("/admin/documents");
    revalidatePath("/client/documents");

    return { success: true, count: result.count };
  } catch (error) {
    console.error("Error bulk updating document statuses:", error);
    return { success: false, error: "Failed to bulk update documents" };
  }
}
