"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { LeadStage } from "@prisma/client";
import { getSession } from "@/lib/auth";

// Validation schemas
const updateLeadStageSchema = z.object({
  leadId: z.string().cuid(),
  stage: z.nativeEnum(LeadStage),
});

const assignLeadSchema = z.object({
  leadId: z.string().cuid(),
  staffId: z.string().cuid().nullable(),
});

const deleteLeadSchema = z.object({
  leadId: z.string().cuid(),
});

const addLeadActivitySchema = z.object({
  leadId: z.string().cuid(),
  type: z.enum(["note", "email", "call", "meeting", "status_change"]),
  body: z.string().min(1, "Activity content is required").max(5000),
});

// Staff guard helper for server actions
async function staffGuard() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized: No session found");
  }
  if (session.user.role === "CLIENT") {
    throw new Error("Unauthorized: Staff access required");
  }
  return session;
}

// Server actions
export async function updateLeadStage(data: z.infer<typeof updateLeadStageSchema>) {
  try {
    const session = await staffGuard();
    const validated = updateLeadStageSchema.parse(data);

    // Update lead stage
    const updatedLead = await prisma.lead.update({
      where: { id: validated.leadId },
      data: { stage: validated.stage },
    });

    // Log activity
    await prisma.leadActivity.create({
      data: {
        leadId: validated.leadId,
        type: "status_change",
        body: `Stage changed to ${validated.stage} by ${session.user.name || session.user.email}`,
      },
    });

    revalidatePath("/admin/leads");

    return {
      success: true,
      data: updatedLead,
      message: "Lead stage updated successfully"
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error.errors
      };
    }
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      };
    }
    return {
      success: false,
      error: "Failed to update lead stage"
    };
  }
}

export async function assignLead(data: z.infer<typeof assignLeadSchema>) {
  try {
    const session = await staffGuard();
    const validated = assignLeadSchema.parse(data);

    // Get staff name if assigning
    let staffName = "Unassigned";
    if (validated.staffId) {
      const staff = await prisma.user.findUnique({
        where: { id: validated.staffId },
        select: { name: true, email: true },
      });
      staffName = staff?.name || staff?.email || validated.staffId;
    }

    // Update lead assignment
    const updatedLead = await prisma.lead.update({
      where: { id: validated.leadId },
      data: { assignedToId: validated.staffId },
      include: { assignedTo: { select: { name: true, email: true } } },
    });

    // Log activity
    await prisma.leadActivity.create({
      data: {
        leadId: validated.leadId,
        type: "status_change",
        body: `Lead ${validated.staffId ? `assigned to ${staffName}` : "unassigned"} by ${session.user.name || session.user.email}`,
      },
    });

    revalidatePath("/admin/leads");

    return {
      success: true,
      data: updatedLead,
      message: `Lead ${validated.staffId ? "assigned" : "unassigned"} successfully`
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error.errors
      };
    }
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      };
    }
    return {
      success: false,
      error: "Failed to assign lead"
    };
  }
}

export async function deleteLead(data: z.infer<typeof deleteLeadSchema>) {
  try {
    await staffGuard();
    const validated = deleteLeadSchema.parse(data);

    // Delete lead (cascade will delete activities)
    await prisma.lead.delete({
      where: { id: validated.leadId },
    });

    revalidatePath("/admin/leads");

    return {
      success: true,
      message: "Lead deleted successfully"
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error.errors
      };
    }
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      };
    }
    return {
      success: false,
      error: "Failed to delete lead"
    };
  }
}

export async function addLeadActivity(data: z.infer<typeof addLeadActivitySchema>) {
  try {
    const session = await staffGuard();
    const validated = addLeadActivitySchema.parse(data);

    // Create activity
    const activity = await prisma.leadActivity.create({
      data: {
        leadId: validated.leadId,
        type: validated.type,
        body: validated.body,
      },
    });

    revalidatePath("/admin/leads");

    return {
      success: true,
      data: activity,
      message: "Activity added successfully"
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error.errors
      };
    }
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      };
    }
    return {
      success: false,
      error: "Failed to add activity"
    };
  }
}

export async function getStaffList() {
  try {
    await staffGuard();

    const staff = await prisma.user.findMany({
      where: {
        role: { not: "CLIENT" },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: "asc" },
    });

    return {
      success: true,
      data: staff
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      };
    }
    return {
      success: false,
      error: "Failed to fetch staff list"
    };
  }
}
