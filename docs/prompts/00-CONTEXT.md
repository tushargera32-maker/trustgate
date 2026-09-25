# Trust Gate Overseas — Standing Context

**Keep this in context for every session. Each numbered phase file is a separate,
short prompt — run them one at a time.**

Next.js 14.2 App Router · TypeScript · Tailwind · Prisma/PostgreSQL · NextAuth ·
Framer Motion 11. A visitor/tourist visa consultancy, Jalandhar + London.

## The audience
Families and professionals in Punjab and the UK. They are not shopping on price —
**they are trying to work out who is real**, in a market with a bad-agent problem.
So: proof is the layout. Every screen answers *"how do I know?"* before *"how much?"*.

## Non-negotiables
1. **Verify, don't assume.** Run `npx tsc --noEmit` after each change and
   `npm run build` before reporting done. Never call something working that you
   have not run. Say plainly what you verified vs assumed.
2. **Don't rebuild the architecture.** Refine in place. Routes and schema are settled.
3. **Never invent content** — no fabricated testimonials, stats, processing times
   or prices. Mark placeholders in code and list them when you report.
4. **Never imply visa approval.** Eligibility output is an *initial assessment*.

## Design tokens (built — extend, don't replace)
| Token | Hex | Use |
|---|---|---|
| Passport Navy | `#0F1B2D` | Ground: heroes, admin rail, footer |
| Seal Gold | `#B98B2E` | **Only CTA colour.** Navy text on it, never white |
| Gold Ink | `#8A6518` | Gold *text* (Seal Gold fails AA below 18px) |
| Vellum | `#F2EFE7` | Banding only, never a full-page background |
| Stamp Teal | `#1E6B63` | Status: verified / approved |
| Action Ochre | `#A8410F` | Status: action required / rejected |

Status colours sit **outside** the brand palette so an approval is never
mistakable for a button. Do not add a seventh colour.

## Type — three faces, one role each
- **Newsreader** (`font-display`) — headlines only, never below 24px
- **Inter** (`font-sans`) — body, forms, tables
- **IBM Plex Mono** (`font-mono`) — **every reference, date, status, eyebrow.**
  Use `.font-data` / `.label-data`. A glance should tell you whether you are
  reading *writing* or reading *record*.

## Components that already exist — reuse, don't reinvent
- `ui/status-pill.tsx` — one status vocabulary, four tones, mapped to every
  Prisma enum. Never improvise a status colour or label.
- `ui/cinematic-hero.tsx` — full-bleed image masthead, measured contrast
- `ui/section.tsx` — `PageHero`, `Section`, `Prose`
- `motion/reveal.tsx` — scroll reveals, polymorphic `as`
- `motion/hero-sequence.tsx` — the homepage load sequence
- `lib/motion.ts` — **all timing lives here**

## Three traps this codebase has already sprung
1. **Client modules must never export plain data to server components.** A
   `"use client"` file exporting an object hands the server a client-reference
   proxy; reading a property throws
   `Could not find the module ...#X#y in the React Client Manifest`.
   Constants go in a plain module.
2. **Every Framer component must call `useReducedMotion()`.** The CSS
   `prefers-reduced-motion` block cannot reach Framer — it animates via inline
   styles. Reduced motion must still *render* content, just without travel.
3. **`useFormState` on React 18 returns a TWO-element tuple.** Destructuring a
   third value as `pending` yields `undefined`. Use `useFormStatus` inside the
   form (see `ui/submit-button.tsx`).

## Motion philosophy
**Premium means less motion, not more.** One orchestrated moment, restraint
elsewhere. Effects on every element read as a template with a plugin bolted on.

## ⚠️ Photography
Every file in `/public/destinations` is mislabelled — `uk.webp` is New Zealand,
`usa.webp` is Singapore, `schengen.webp` is an office portrait, and so on.
`lib/destination-images.ts` maps each destination to the file that genuinely
shows it. **Only Canada and New Zealand have truthful photos**; the rest render
a typographic fallback.

**Do not reassign images to fill the grid.** A Schengen page showing Dubai is
exactly the carelessness this audience is screening for.

## Quality floor — check per page
360px mobile · visible keyboard focus · reduced-motion respected · contrast
4.5:1 body / 3:1 large, **measured** on image-backed surfaces · meaningful
`alt` (or `alt="" aria-hidden` if decorative) · correct `sizes` on every
`next/image` · real pending states · loading and empty states written as
invitations, not dead ends.
