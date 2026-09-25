# Trust Gate Overseas — Design & Build Brief

Paste this into Claude Code from the repo root.

---

You are continuing an in-progress redesign of **Trust Gate Overseas**, a visitor
and tourist visa consultancy operating from Jalandhar (India) and London (UK).
Next.js 14.2 App Router, TypeScript, Tailwind, Prisma + PostgreSQL, NextAuth,
Framer Motion 11.

**Read this whole brief before writing code. Then read the files it names.**

---

## 0. Non-negotiables

1. **Verify, don't assume.** Run `npm run build` and `npx tsc --noEmit` after
   every meaningful change. Do not report something as working that you have
   not run. If you cannot verify a claim, say so explicitly.
2. **Do not rebuild the architecture.** Refine page-by-page,
   component-by-component. The route map (37 pages) and the Prisma schema are
   correct and settled.
3. **Never invent content.** No fabricated testimonials, statistics, processing
   times, prices, or office details. If a value is unknown, mark it clearly as
   a placeholder in the code and list it in your final report. This is a
   regulated advice sector — invented facts are a legal exposure, not a
   cosmetic issue.
4. **Never claim or imply visa approval.** Eligibility output must read as an
   *initial assessment*. Every decision belongs to the embassy or consulate.
5. Read `docs/DESIGN_DIRECTION.html` first. It is the design rationale.

---

## 1. The audience, and why the design looks the way it does

Families and professionals in Punjab and the UK applying for Schengen, UK,
Canada, Australia and US visitor visas. **They are not shopping on price. They
are trying to work out who is real**, in a market with a serious bad-agent
problem.

So the governing idea is: **the product that shows its work wins.** Proof is
the layout, not a testimonial slider bolted to the bottom. Every screen should
answer *"how do I know?"* before it answers *"how much?"*.

---

## 2. Design system (already built — extend, don't replace)

### Colour — `src/app/globals.css`

| Token | Hex | Use |
|---|---|---|
| Passport Navy | `#0F1B2D` | Ground: heroes, admin rail, footer |
| Seal Gold | `#B98B2E` | **The only CTA colour.** Always with navy text, never white |
| Gold Ink | `#8A6518` | Gold *text* — Seal Gold fails AA below 18px |
| Vellum | `#F2EFE7` | Section banding only, never a full-page background |
| Stamp Teal | `#1E6B63` | Status: verified / approved / submitted |
| Action Ochre | `#A8410F` | Status: action required / rejected |

Status colours are deliberately **outside** the brand palette so an approval is
never mistakable for a button. Do not introduce a seventh colour.

### Typography — three faces, one role each

- **Newsreader** (`font-display`) — headlines only, never below 24px, weights
  300/400. Has `adjustFontFallback: false` set because Next 14's metrics table
  lacks it; leave that alone.
- **Inter** (`font-sans`) — body, forms, navigation, tables.
- **IBM Plex Mono** (`font-mono`) — **every reference, date, status and
  eyebrow.** This is the signature of the type system: a glance tells you
  whether you're reading *writing* or reading *record*. Use `.font-data` and
  `.label-data`.

### Status — `src/components/ui/status-pill.tsx`

One vocabulary, four tones (`verified` / `review` / `action` / `idle`), mapped
to every Prisma enum. The same pill renders in the public hero, the client
portal and the admin tables. **Never improvise a status colour or label.**

### Motion — `src/lib/motion.ts`, `src/components/motion/`

All timing lives in `src/lib/motion.ts`. Re-time the site from that one file.

The philosophy: **premium sites have less motion, not more.** One orchestrated
moment plus restraint everywhere else. Effects on every element read as a
template with a plugin bolted on.

- `hero-sequence.tsx` — the homepage load sequence (headline → copy → actions →
  proof, then the case file assembles, progress fills 0→70% with the figure
  counting up, steps stamp in, MRZ scans once).
- `reveal.tsx` — scroll reveals, 70ms stagger, polymorphic `as` prop.
- `cinematic-hero.tsx` — full-bleed image masthead with parallax settle.

**Two rules you must not break:**

- **Every Framer component must call `useReducedMotion()`.** The CSS
  `prefers-reduced-motion` block cannot reach Framer — it animates via inline
  styles and its own rAF loop. Reduced motion must still *render* content; it
  just arrives without travel. Never return the hidden state.
- **Client modules must never export plain data to server components.** A
  `"use client"` file exporting an object gives the server a client-reference
  proxy, and reading a property throws
  `Could not find the module ...#X#y in the React Client Manifest`. Constants
  go in a plain module. This has already bitten this codebase twice.

### Signature

**Navy + Vellum + Gold + editorial serif + mono case data + the case tracker.**
The MRZ strip stays confined to genuine case contexts — it is not a decorative
border.

---

## 3. ⚠️ The photography problem — read before any visual work

**Every file in `/public/destinations` is mislabelled.** Audited against actual
image content:

| File | Actually shows |
|---|---|
| `australia.webp` | Toronto skyline — **Canada** |
| `canada.webp` | Passport + blank form on a desk — no country |
| `new-zealand.webp` | Dubai, Burj Khalifa — **UAE**, a route we don't cover |
| `schengen.webp` | A man holding a UK visa in the Trust Gate office |
| `uk.webp` | Lake Tekapo — **New Zealand** |
| `usa.webp` | Singapore, the Merlion |

`src/lib/destination-images.ts` has been corrected to map each destination to
the file that genuinely shows it. **Only Canada and New Zealand have truthful
photography.** The other six destinations render a typographic fallback tile.

**Do not "fix" this by reassigning images to make the grid look full.** A
Schengen page showing Dubai is precisely the carelessness this audience is
screening for. If new licensed images are added to `/public/destinations`,
register them in that file and run `python3 scripts/optimise-images.py`
(resizes to actual usage and converts to WebP; originals are preserved in
`public/_originals/`).

---

## 4. Cinematic treatment — the rules that make it work

Applied in `src/components/ui/cinematic-hero.tsx`. Reuse it; don't reinvent.

**Contrast is guaranteed in two layers, and the values are measured, not
eyeballed.** A gradient alone cannot hold white text over an arbitrary
photograph — a blue-sky skyline defeats it every time.

1. A **flat floor** (`bg-ink-900/25`) so the worst case is known, not hoped for.
2. **Shaped gradients** on top so the picture doesn't flatten to grey.

Measured against the brightest image in the set: **7.1:1 worst-case behind any
text**, versus AA's 4.5:1. **If you change these values, re-measure.** Composite
the layers and compute the contrast ratio; do not judge by eye.

Motion: image settles 1.06 → 1.00 over 1.4s, then drifts 8% on scroll and fades
to 35% as content takes over. Content staggers on *after* the image — the image
is the stage, the words arrive onto it. Slow enough that you feel it rather
than see it.

---

## 5. Work remaining, in priority order

### A. Public pages needing the editorial + cinematic pass

Done: home, destinations index, country detail, services index, service detail,
blog, updates, success stories.

Still plain — they inherit `PageHero` but have had no individual craft:

1. **`(public)/eligibility`** (409 lines) — highest value. Rebuild as **one
   question per screen**: large tap targets, visible progress, nothing else on
   screen. Result must say *initial assessment*, never imply approval. Already
   has Framer transitions and a reduced-motion guard.
2. **`(public)/apply`** — multi-step, same treatment as eligibility.
3. **`(public)/contact`** — asymmetric editorial; both offices as real data
   (mono for phone/address), a map or office photograph.
4. **`(public)/about`** — the trust page. Team, offices, what you don't do.
   Uses `/public/team` and `/public/office`.
5. **`(public)/faq`** — accordion; scannable, quiet.
6. **`(public)/legal/[slug]`** (349 lines) — use the `Prose` primitive in
   `ui/section.tsx`. Long-form, generous measure, no decoration.
7. **`client/login`** — first impression of the portal. Quiet, reassuring.

### B. Client portal — "quiet luxury / private banking"

`src/app/client/(dashboard)/` — application, documents, messages, appointments,
payments, profile.

Dense with operational information but **calm**. Clear case status, one obvious
next action, no marketing language. The vellum case-file band carrying the
reference and status is the continuity device between the public site and the
portal — a client should recognise the same file.

### C. Admin — clean CRM

`src/app/admin/(dashboard)/` — 15 screens.

Reduce decorative KPI cards. Prioritise **tables, status, filters, timelines
and actionable drawers**. Applications needs **Kanban + List views**. Density is
a feature here; a case manager works a queue.

### D. CRUD — built but mostly unwired ⚠️

`src/lib/actions/` has **15 server actions** covering applications, documents,
appointments, payments, messages and leads. They share a foundation in
`core.ts` enforcing three rules:

- **Actions return, they don't redirect.** `requireStaff()` calls `redirect()`,
  which throws — fine in a page, wrong in an action. Use `staffGuard()` /
  `clientGuard()`, which return `{ ok: false, error }`.
- **Every input is Zod-validated.** A server action is a public HTTP endpoint.
- **Ownership is checked, never assumed.** Client ids come from the session,
  never the browser.

**Only the client documents page is wired.** Everything else still needs
connecting. Two reusable controls exist:

- `StatusSelect` — optimistic, **rolls back on failure** so the UI never lies
  about what saved.
- `MessageComposer` — preserves the draft if the send fails.

Wire: admin applications (status, notes), admin leads (stage, assign, delete),
admin/client appointments, admin payments, client + admin messages.

### E. Known issues to fix

- `src/components/seo/json-ld.tsx` imports `siteConfig` but never uses it —
  structured data may be hardcoded rather than reading config. Investigate.
- Document storage writes to local disk (`.uploads/`, gitignored). **This does
  not survive a redeploy on Vercel/Railway/Fly.** Before launch, point
  `DOCUMENT_STORAGE_DIR` at a mounted volume or swap to S3/R2. The DB stores
  only the key, so that change touches one file.
- `DATABASE_URL` points at remote Postgres. Every admin page render pays
  network round-trips. Consider local Postgres in Docker for development, and
  benchmark with `npm run build && npm start`, not `npm run dev`.

---

## 6. Reduce / avoid

- Excessive rounded cards; generic icon-box sections; heavy gradients
- Decorative icons that carry no information (three plane/globe/compass glyphs
  across ten routes told the reader nothing — they were removed)
- Placeholder gradient blocks where a photo would go — give the space to the
  excerpt instead
- Too much vellum — banding only, never a full-page background
- Competitor-negative messaging
- Controls that look interactive but do nothing. A filter that doesn't filter
  is worse than no filter.
- Stock portraits implying client consent you don't have

---

## 7. Quality floor — verify each before reporting done

- [ ] `npm run build` passes; `npx tsc --noEmit` clean
- [ ] Mobile down to **360px**; tables scroll horizontally
- [ ] Visible keyboard focus on every interactive element
- [ ] `prefers-reduced-motion` respected — test via DevTools → Rendering
- [ ] Contrast: **4.5:1 body / 3:1 large text**, measured on image-backed
      surfaces
- [ ] Every image has meaningful `alt`, or `alt=""` + `aria-hidden` if
      decorative
- [ ] Every `next/image` has correct `sizes`; above-fold heroes have `priority`
- [ ] Loading and empty states exist and are written as invitations, not
      dead ends
- [ ] Every form shows a real pending state (`useFormStatus` — note
      `useFormState` on React 18 returns a **two**-element tuple; destructuring
      a third value as `pending` gives `undefined`, which was a live bug here)
- [ ] No plain-data exports from `"use client"` modules

---

## 8. How to report back

For each page: what changed, why, and **what you verified versus what you
assumed**. List every placeholder value you introduced. If something is wrong
in this brief, say so — the brief is not more reliable than what you can read
in the repo.
