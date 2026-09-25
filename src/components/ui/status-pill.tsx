import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * StatusPill — the single status vocabulary for the whole product.
 *
 * Four tones, no more. The same pill renders in the public hero, the client
 * portal and the admin tables, so a client and a case manager always see the
 * same word for the same thing.
 *
 *   verified  teal    Checked and done. Nothing for the client to do.
 *   review    gold    With us. Waiting on our side, not theirs.
 *   action    ochre   Blocked on the client. Always pair with a next step.
 *   idle      grey    Not started. Neutral by design — an empty step should
 *                     not feel like a failure.
 */
const pillVariants = cva(
  // `self-start` and `w-fit` matter: inside a flex-col parent the default
  // align-items:stretch makes even an inline-flex pill span the full width.
  "inline-flex w-fit shrink-0 self-start items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase leading-none tracking-[0.1em]",
  {
    variants: {
      tone: {
        verified: "bg-success-tint text-success",
        review: "bg-warning-tint text-accent-ink",
        action: "bg-destructive-tint text-destructive",
        idle: "bg-muted text-muted-foreground"
      }
    },
    defaultVariants: { tone: "idle" }
  }
);

export type StatusTone = "verified" | "review" | "action" | "idle";

/**
 * Every status value in the schema, mapped to a tone and to the plain-English
 * label the user actually reads. Labels are written from the reader's side of
 * the screen: "Waiting on you", not "ADDITIONAL_INFO_REQUESTED".
 */
const STATUS_MAP: Record<string, { tone: StatusTone; label: string }> = {
  // --- ApplicationStatus ---
  CONSULTATION_COMPLETED: { tone: "verified", label: "Consultation done" },
  DOCUMENTS_REQUESTED: { tone: "action", label: "Documents needed" },
  DOCUMENTS_RECEIVED: { tone: "review", label: "Documents received" },
  DOCUMENTS_VERIFIED: { tone: "verified", label: "Documents verified" },
  APPLICATION_PREPARED: { tone: "review", label: "Application prepared" },
  APPLICATION_SUBMITTED: { tone: "verified", label: "Submitted" },
  BIOMETRICS: { tone: "action", label: "Biometrics booked" },
  ADDITIONAL_INFO_REQUESTED: { tone: "action", label: "Waiting on you" },
  DECISION_PENDING: { tone: "review", label: "Decision awaiting" },
  DECISION_RECEIVED: { tone: "verified", label: "Decision received" },

  // --- DocumentStatus ---
  REQUESTED: { tone: "idle", label: "Not started" },
  UPLOADED: { tone: "review", label: "Under review" },
  UNDER_REVIEW: { tone: "review", label: "Under review" },
  VERIFIED: { tone: "verified", label: "Verified" },
  REJECTED: { tone: "action", label: "Action required" },
  REPLACEMENT_REQUIRED: { tone: "action", label: "Re-upload needed" },

  // --- LeadStage ---
  NEW: { tone: "idle", label: "New" },
  CONTACTED: { tone: "review", label: "Contacted" },
  CONSULTATION_SCHEDULED: { tone: "review", label: "Consultation booked" },
  INTERESTED: { tone: "review", label: "Interested" },
  DOCUMENTS_PENDING: { tone: "action", label: "Documents pending" },
  CONVERTED: { tone: "verified", label: "Converted" },
  NOT_INTERESTED: { tone: "idle", label: "Not interested" },
  LOST: { tone: "idle", label: "Lost" },

  // --- AppointmentStatus ---
  CONFIRMED: { tone: "verified", label: "Confirmed" },
  COMPLETED: { tone: "verified", label: "Completed" },
  CANCELLED: { tone: "idle", label: "Cancelled" },

  // --- PaymentStatus ---
  PENDING: { tone: "action", label: "Payment due" },
  PAID: { tone: "verified", label: "Paid" },
  FAILED: { tone: "action", label: "Payment failed" },
  REFUNDED: { tone: "idle", label: "Refunded" },

  // --- ServiceStatus ---
  DRAFT: { tone: "idle", label: "Draft" },
  PUBLISHED: { tone: "verified", label: "Published" },
  ARCHIVED: { tone: "idle", label: "Archived" }
};

/**
 * Falls back to title-casing the raw value rather than throwing, so an enum
 * added to the schema later still renders something readable.
 */
export function resolveStatus(status: string): {
  tone: StatusTone;
  label: string;
} {
  const hit = STATUS_MAP[status];
  if (hit) return hit;
  const label = status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase());
  return { tone: "idle", label };
}

export interface StatusPillProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof pillVariants> {
  /** A raw enum value from the schema, e.g. "DOCUMENTS_VERIFIED". */
  status?: string;
  /** Override the resolved label. Accepts a node so the label can
   *  contain an animated figure (see the hero's percentage count-up). */
  label?: React.ReactNode;
  /** Hide the leading dot — useful inside dense tables. */
  hideDot?: boolean;
}

export function StatusPill({
  status,
  label,
  tone,
  hideDot = false,
  className,
  ...props
}: StatusPillProps) {
  const resolved = status ? resolveStatus(status) : null;
  const finalTone = tone ?? resolved?.tone ?? "idle";
  const finalLabel = label ?? resolved?.label ?? "Unknown";

  return (
    <span className={cn(pillVariants({ tone: finalTone }), className)} {...props}>
      {!hideDot && (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
        />
      )}
      {finalLabel}
    </span>
  );
}

export { pillVariants };
