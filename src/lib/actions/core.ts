import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession, hasRole, type StaffRole } from "@/lib/auth";

/**
 * Shared foundation for every server action in the app.
 *
 * Three things this enforces that hand-rolled actions kept getting wrong:
 *
 *  1. **Actions return, they do not redirect.** `requireStaff()` calls
 *     `redirect()`, which throws — fine in a page, wrong in an action, because
 *     the caller gets an unhandled exception instead of a message it can show.
 *     Actions here return `{ ok: false, error }` so the UI can render it.
 *
 *  2. **Every input is validated.** A server action is a public HTTP endpoint.
 *     Anything reachable from the browser can be called with any payload, so
 *     trusting the shape of `data` is the same as trusting the client.
 *
 *  3. **Ownership is checked, not assumed.** A logged-in client must not be
 *     able to read or mutate another client's record by passing a different id.
 *     `requireOwnedByClient` resolves the caller's own client row and compares.
 */

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function fail(
  error: string,
  fieldErrors?: Record<string, string[]>
): ActionResult<never> {
  return { ok: false, error, fieldErrors };
}

/* ─────────────────────────── auth guards ─────────────────────────── */

/**
 * Staff guard for actions. Returns the session or an error — never redirects.
 */
export async function staffGuard(...roles: StaffRole[]) {
  const session = await getSession();

  if (!session?.user) {
    return { error: "You are signed out. Please sign in again." as const };
  }
  if (!session.user.role || session.user.role === "CLIENT") {
    return { error: "You do not have permission to do that." as const };
  }
  if (roles.length > 0 && !hasRole(session.user.role, ...roles)) {
    return { error: "Your role does not allow this action." as const };
  }

  return { session };
}

/**
 * Client guard. Resolves the Client row belonging to the signed-in user, so
 * callers never take a clientId from the browser.
 */
export async function clientGuard() {
  const session = await getSession();

  if (!session?.user?.id) {
    return { error: "You are signed out. Please sign in again." as const };
  }

  const client = await prisma.client.findUnique({
    where: { userId: session.user.id },
    select: { id: true, fullName: true, email: true }
  });

  if (!client) {
    return { error: "No client record is linked to this account." as const };
  }

  return { session, client };
}

/**
 * Confirms a record belongs to the calling client before it is read or changed.
 * Staff bypass this — they are allowed across records by design.
 */
export async function assertOwnership(
  clientId: string,
  recordClientId: string | null | undefined
) {
  if (!recordClientId || recordClientId !== clientId) {
    // Deliberately vague: confirming a record exists but belongs to someone
    // else leaks its existence.
    return "That record could not be found.";
  }
  return null;
}

/* ─────────────────────────── validation ─────────────────────────── */

/**
 * Parses input and flattens Zod errors into per-field messages the form can
 * render inline.
 */
export function parse<S extends z.ZodTypeAny>(
  schema: S,
  input: unknown
):
  | { ok: true; data: z.infer<S> }
  | { ok: false; error: string; fieldErrors: Record<string, string[]> } {
  const result = schema.safeParse(input);

  if (!result.success) {
    const flat = result.error.flatten();
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors: flat.fieldErrors as Record<string, string[]>
    };
  }

  return { ok: true, data: result.data };
}

/**
 * Wraps a Prisma call so an infrastructure failure becomes a message rather
 * than a white screen. The real error is logged server-side; the user gets
 * something actionable without internal detail.
 */
export async function attempt<T>(
  fn: () => Promise<T>,
  userMessage = "Something went wrong. Please try again."
): Promise<ActionResult<T>> {
  try {
    return ok(await fn());
  } catch (err) {
    console.error("[action]", err);

    // Unique-constraint violations are worth naming — they are usually a
    // duplicate reference or invoice number the user can fix.
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return fail("That value is already in use. Try a different one.");
    }

    return fail(userMessage);
  }
}

/* ─────────────────────────── common schemas ─────────────────────────── */

export const idSchema = z.string().cuid("Invalid record id.");

export const APPLICATION_STATUSES = [
  "CONSULTATION_COMPLETED",
  "DOCUMENTS_REQUESTED",
  "DOCUMENTS_RECEIVED",
  "DOCUMENTS_VERIFIED",
  "APPLICATION_PREPARED",
  "APPLICATION_SUBMITTED",
  "BIOMETRICS",
  "ADDITIONAL_INFO_REQUESTED",
  "DECISION_PENDING",
  "DECISION_RECEIVED"
] as const;

export const DOCUMENT_STATUSES = [
  "REQUESTED",
  "UPLOADED",
  "UNDER_REVIEW",
  "VERIFIED",
  "REJECTED",
  "REPLACEMENT_REQUIRED"
] as const;

export const APPOINTMENT_STATUSES = [
  "REQUESTED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED"
] as const;

export const PAYMENT_STATUSES = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "CANCELLED"
] as const;

export const LEAD_STAGES = [
  "NEW",
  "CONTACTED",
  "CONSULTATION_SCHEDULED",
  "INTERESTED",
  "DOCUMENTS_PENDING",
  "CONVERTED",
  "NOT_INTERESTED",
  "LOST"
] as const;

/**
 * Progress percentages the client portal shows for each stage, so the bar and
 * the status label can never disagree.
 */
export const STATUS_PROGRESS: Record<
  (typeof APPLICATION_STATUSES)[number],
  number
> = {
  CONSULTATION_COMPLETED: 10,
  DOCUMENTS_REQUESTED: 20,
  DOCUMENTS_RECEIVED: 35,
  DOCUMENTS_VERIFIED: 50,
  APPLICATION_PREPARED: 60,
  APPLICATION_SUBMITTED: 70,
  BIOMETRICS: 80,
  ADDITIONAL_INFO_REQUESTED: 75,
  DECISION_PENDING: 90,
  DECISION_RECEIVED: 100
};
