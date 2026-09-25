"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  OUTCOME_CODES,
  describeAnswers,
  destinationName,
  hubName,
  type OutcomeCode
} from "@/lib/eligibility";

/* ─────────────────────────────────────────────────────────────
   Shared result type
───────────────────────────────────────────────────────────── */

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; fields?: Record<string, string[]> };

/* ─────────────────────────────────────────────────────────────
   Contact form → Lead (WEBSITE_CONTACT source)
───────────────────────────────────────────────────────────── */

const contactSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  hub: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(5, "Message required")
});

export async function submitContactForm(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    hub: formData.get("hub") || undefined,
    service: formData.get("service") || undefined,
    message: formData.get("message")
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the form fields.",
      fields: parsed.error.flatten().fieldErrors as Record<string, string[]>
    };
  }

  const { name, email, phone, hub, service, message } = parsed.data;

  try {
    await prisma.lead.create({
      data: {
        fullName: name,
        email,
        phone: phone ?? null,
        countryOfInterest: hub ?? null,
        visaTypeInterest: service ?? null,
        source: "WEBSITE_CONTACT",
        stage: "NEW",
        notes: message
      }
    });
    return { ok: true };
  } catch (err) {
    console.error("[submitContactForm]", err);
    return { ok: false, error: "Unable to submit at the moment. Please try again shortly." };
  }
}

/* ─────────────────────────────────────────────────────────────
   Apply form → Lead (BOOKING source)
───────────────────────────────────────────────────────────── */

const applySchema = z.object({
  fullName: z.string().min(2, "Full name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  dob: z.string().optional(),
  hub: z.string().optional(),
  service: z.string().optional(),
  travelDate: z.string().optional(),
  purpose: z.string().optional(),
  notes: z.string().optional()
});

export async function submitApplyForm(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = applySchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    dob: formData.get("dob") || undefined,
    hub: formData.get("hub") || undefined,
    service: formData.get("service") || undefined,
    travelDate: formData.get("travelDate") || undefined,
    purpose: formData.get("purpose") || undefined,
    notes: formData.get("notes") || undefined
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the form fields.",
      fields: parsed.error.flatten().fieldErrors as Record<string, string[]>
    };
  }

  const { fullName, email, phone, hub, service, travelDate, purpose, notes } = parsed.data;

  const noteParts: string[] = [];
  if (travelDate) noteParts.push(`Travel date: ${travelDate}`);
  if (purpose) noteParts.push(`Purpose: ${purpose}`);
  if (notes) noteParts.push(notes);

  try {
    await prisma.lead.create({
      data: {
        fullName,
        email,
        phone: phone ?? null,
        countryOfInterest: hub ?? null,
        visaTypeInterest: service ?? null,
        source: "BOOKING",
        stage: "NEW",
        notes: noteParts.join("\n") || null
      }
    });
    return { ok: true };
  } catch (err) {
    console.error("[submitApplyForm]", err);
    return { ok: false, error: "Unable to submit at the moment. Please try again shortly." };
  }
}

/* ─────────────────────────────────────────────────────────────
   Eligibility result → EligibilityResult + Lead (ELIGIBILITY_FORM)
───────────────────────────────────────────────────────────── */

const eligibilitySchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  answers: z.record(z.string()),
  outcome: z.enum(OUTCOME_CODES),
  /** The engine's reasoning trail. Stored so a counsellor opening the lead
   *  can see which signals produced the result, rather than re-deriving it. */
  flags: z.array(z.string()).optional()
});

export async function submitEligibilityResult(input: {
  name: string;
  email: string;
  phone?: string;
  answers: Record<string, string>;
  outcome: OutcomeCode;
  flags?: string[];
}): Promise<ActionResult> {
  const parsed = eligibilitySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid submission data." };
  }

  const { name, email, phone, answers, outcome, flags } = parsed.data;

  /* The CRM previously stored raw slugs — countryOfInterest: "SCH",
     visaTypeInterest: "From uk" — which a counsellor then had to decode.
     Resolve them to the same labels the client saw. */
  const destination = destinationName(answers.destination);
  const origin = hubName(answers.hub);

  try {
    const result = await prisma.eligibilityResult.create({
      data: {
        fullName: name,
        email,
        phone: phone ?? null,
        answers,
        outcome,
        matchedRules: flags ?? []
      }
    });

    await prisma.lead.create({
      data: {
        fullName: name,
        email,
        phone: phone ?? null,
        countryOfInterest: destination,
        visaTypeInterest: `${origin} → ${destination}`,
        source: "ELIGIBILITY_FORM",
        stage: "NEW",
        eligibilityResultId: result.id,
        notes: [
          `Triage outcome: ${outcome}`,
          "",
          describeAnswers(answers),
          "",
          flags?.length ? `Signals: ${flags.join(", ")}` : null
        ]
          .filter((l) => l !== null)
          .join("\n")
      }
    });

    return { ok: true };
  } catch (err) {
    console.error("[submitEligibilityResult]", err);
    return { ok: false, error: "Unable to save your result. Please try again shortly." };
  }
}
