# Phase 2 — Apply and Contact

Two pages. Do `apply` first, then `contact`, and typecheck between them.

**`src/app/(public)/apply/page.tsx`** — multi-step, same treatment as the
eligibility wizard. It already uses `SubmitButton` for pending state; verify
that still works after any restructure.

**`src/app/(public)/contact/page.tsx`** — asymmetric editorial layout. Both
offices as real data from `lib/site-config.ts`, phone and address in mono
(`.font-data`). Do not invent office details, opening hours or response times.

Report what you verified vs assumed. Then stop.
