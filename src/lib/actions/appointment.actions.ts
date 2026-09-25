"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export type AppointmentStatus = "REQUESTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface CreateAppointmentInput {
  clientId?: string;
  applicationId?: string;
  staffId?: string;
  title: string;
  type: string;
  scheduledAt: Date;
  durationMin?: number;
  notes?: string;
}

export interface UpdateAppointmentInput {
  title?: string;
  type?: string;
  scheduledAt?: Date;
  durationMin?: number;
  staffId?: string;
  notes?: string;
}

/**
 * Create a new appointment
 */
export async function createAppointment(data: CreateAppointmentInput) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    // If client is creating, auto-assign their clientId
    let clientId = data.clientId;
    if (session.user.role === "CLIENT") {
      const client = await prisma.client.findUnique({
        where: { userId: session.user.id },
      });
      if (!client) {
        return { error: "Client record not found" };
      }
      clientId = client.id;
    }

    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        applicationId: data.applicationId,
        staffId: data.staffId,
        title: data.title,
        type: data.type,
        scheduledAt: data.scheduledAt,
        durationMin: data.durationMin || 30,
        notes: data.notes,
        status: "REQUESTED",
      },
      include: {
        client: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        application: true,
      },
    });

    revalidatePath("/client/appointments");
    revalidatePath("/admin/appointments");

    return { success: true, appointment };
  } catch (error) {
    console.error("Create appointment error:", error);
    return { error: "Failed to create appointment" };
  }
}

/**
 * Update an appointment
 */
export async function updateAppointment(id: string, data: UpdateAppointmentInput) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    // Check permission
    const existing = await prisma.appointment.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!existing) {
      return { error: "Appointment not found" };
    }

    // Clients can only update their own appointments
    if (session.user.role === "CLIENT" && existing.client?.userId !== session.user.id) {
      return { error: "Unauthorized" };
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        title: data.title,
        type: data.type,
        scheduledAt: data.scheduledAt,
        durationMin: data.durationMin,
        staffId: data.staffId,
        notes: data.notes,
      },
      include: {
        client: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        application: true,
      },
    });

    revalidatePath("/client/appointments");
    revalidatePath("/admin/appointments");

    return { success: true, appointment };
  } catch (error) {
    console.error("Update appointment error:", error);
    return { error: "Failed to update appointment" };
  }
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const existing = await prisma.appointment.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!existing) {
      return { error: "Appointment not found" };
    }

    // Clients can only cancel their own appointments
    if (session.user.role === "CLIENT" && existing.client?.userId !== session.user.id) {
      return { error: "Unauthorized" };
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    revalidatePath("/client/appointments");
    revalidatePath("/admin/appointments");

    return { success: true, appointment };
  } catch (error) {
    console.error("Cancel appointment error:", error);
    return { error: "Failed to cancel appointment" };
  }
}

/**
 * Confirm an appointment (staff only)
 */
export async function confirmAppointment(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    // Only staff can confirm appointments
    if (session.user.role === "CLIENT") {
      return { error: "Only staff can confirm appointments" };
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: "CONFIRMED" },
    });

    revalidatePath("/client/appointments");
    revalidatePath("/admin/appointments");

    return { success: true, appointment };
  } catch (error) {
    console.error("Confirm appointment error:", error);
    return { error: "Failed to confirm appointment" };
  }
}

/**
 * Mark appointment as completed (staff only)
 */
export async function completeAppointment(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    // Only staff can mark as completed
    if (session.user.role === "CLIENT") {
      return { error: "Only staff can mark appointments as completed" };
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: "COMPLETED" },
    });

    revalidatePath("/client/appointments");
    revalidatePath("/admin/appointments");

    return { success: true, appointment };
  } catch (error) {
    console.error("Complete appointment error:", error);
    return { error: "Failed to mark appointment as completed" };
  }
}

/**
 * Delete an appointment (admin only)
 */
export async function deleteAppointment(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    // Only admin/super admin can delete
    if (!["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
      return { error: "Insufficient permissions" };
    }

    await prisma.appointment.delete({
      where: { id },
    });

    revalidatePath("/client/appointments");
    revalidatePath("/admin/appointments");

    return { success: true };
  } catch (error) {
    console.error("Delete appointment error:", error);
    return { error: "Failed to delete appointment" };
  }
}
