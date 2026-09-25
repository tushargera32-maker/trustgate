"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export interface SendMessageInput {
  body: string;
  applicationId?: string;
  recipientId?: string;
  isInternal?: boolean;
}

export interface MessageWithSender {
  id: string;
  body: string;
  senderId: string;
  applicationId: string | null;
  isInternal: boolean;
  createdAt: Date;
  sender: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    image: string | null;
  };
}

/**
 * Send a new message
 */
export async function sendMessage(data: SendMessageInput) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    if (!data.body || data.body.trim().length === 0) {
      return { error: "Message body is required" };
    }

    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        body: data.body.trim(),
        applicationId: data.applicationId || null,
        isInternal: data.isInternal || false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          },
        },
      },
    });

    // Revalidate relevant paths
    revalidatePath("/client/messages");
    revalidatePath("/admin/messages");
    if (data.applicationId) {
      revalidatePath(`/client/applications/${data.applicationId}`);
      revalidatePath(`/admin/applications/${data.applicationId}`);
    }

    return { success: true, message };
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: "Failed to send message" };
  }
}

/**
 * Get messages for the current user
 */
export async function getMessages(applicationId?: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const where: any = {};

    // Clients can only see their own messages
    if (session.user.role === "CLIENT") {
      where.senderId = session.user.id;
      where.isInternal = false;
    }

    // Filter by application if provided
    if (applicationId) {
      where.applicationId = applicationId;
    }

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          },
        },
      },
    });

    return { success: true, messages };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { error: "Failed to fetch messages" };
  }
}

/**
 * Get message thread for an application
 */
export async function getApplicationMessages(applicationId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    // Verify user has access to this application
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { client: true },
    });

    if (!application) {
      return { error: "Application not found" };
    }

    // Clients can only see their own applications
    if (session.user.role === "CLIENT") {
      if (application.client.userId !== session.user.id) {
        return { error: "Unauthorized" };
      }
    }

    const messages = await prisma.message.findMany({
      where: {
        applicationId,
        isInternal: session.user.role === "CLIENT" ? false : undefined,
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          },
        },
      },
    });

    return { success: true, messages };
  } catch (error) {
    console.error("Error fetching application messages:", error);
    return { error: "Failed to fetch messages" };
  }
}

/**
 * Mark messages as read (future enhancement)
 */
export async function markMessagesAsRead(messageIds: string[]) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    // Future: implement read receipts
    return { success: true };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return { error: "Failed to mark messages as read" };
  }
}
