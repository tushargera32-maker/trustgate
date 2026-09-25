# Phase 6 — Wire the CRUD

`src/lib/actions/` has **15 server actions** already written and schema-checked
(applications, documents, appointments, payments, messages, leads).
**Only `client/documents` is wired.** Connect the rest.

Foundation rules in `lib/actions/core.ts` — follow them:
- **Actions return, they don't redirect.** `requireStaff()` calls `redirect()`,
  which throws — fine in a page, wrong in an action. Use `staffGuard()` /
  `clientGuard()`, which return `{ ok: false, error }`.
- **Every input is Zod-validated.** A server action is a public HTTP endpoint.
- **Ownership is checked, never assumed.** Client ids come from the session,
  never the browser.

Reuse these — do not write new ones:
- `admin/record-controls.tsx` → `StatusSelect` (optimistic, **rolls back on
  failure** so the UI never lies about what saved) and `MessageComposer`
  (preserves the draft if the send fails).

Wire in this order: admin applications (status + notes) → admin leads (stage,
assign, delete) → appointments → payments → messages.

After each one, actually exercise it against the database and say whether it
worked. Then stop.
