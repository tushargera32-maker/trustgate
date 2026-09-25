# Phase 1 — Eligibility wizard

Read `src/app/(public)/eligibility/page.tsx` (409 lines) and rebuild it as
**one question per screen**.

- Large tap targets, visible progress, nothing else on screen. No nav clutter,
  no sidebar, no cross-sell.
- Keep the existing Framer transitions and the `useReducedMotion` guard already
  in the file.
- Back must preserve answers. Refreshing mid-flow should not silently lose them
  — if that is hard, say so rather than faking it.
- **The result screen must read as an *initial assessment*.** Never imply
  approval. State plainly that the decision belongs to the embassy or consulate.
- Result routes into: Book a consultation → Start an application.

Report what you verified vs assumed. Then stop.
