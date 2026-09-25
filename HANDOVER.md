# Trust Gate Overseas — refinement handover

Changes are against the codebase in `_claude.zip` as uploaded. Sixteen files:
fourteen modified, two new. No dependencies added, no design tokens changed, no
routes added or removed.

Apply with `git apply trust-gate-changes.patch`, or copy the tree in
`changed-files/` over your `src/` and `prisma/`.

---

## 0. Read this first — a discrepancy in my working copy

Partway through this work I found that my extracted working directory had
drifted from the zip you uploaded. Thirteen files I never touched had been
modified in place at 13:39, eleven minutes after I extracted the archive. I
have not been able to explain what did it.

I rebuilt the delivery from a fresh extraction of your zip and applied only my
own sixteen files, and verified byte-for-byte that nothing else came with them.
**What you are receiving is clean.**

But it means one thing I told you earlier was wrong:

> "the client portal dashboard already queries Prisma and has proper empty
> states"

That is true of the drifted copy. It is **not** true of your uploaded code. See
item 1 under "Not fixed" below — it is now the most serious open issue in the
project, and I would not ship without addressing it.

I also cited the `/blog` index page's handling of missing detail routes as an
"established convention in this codebase" when justifying a homepage fix. That
convention exists only in the drifted copy. The fix itself is still correct and
still applies; the justification was borrowed from code you do not have.

---

## 1. Eligibility triage — rebuilt

**New: `src/lib/eligibility.ts`.** The assessment logic is out of the page
component and into a module that can be read, reviewed and tested on its own.

### Two logic bugs that were rejecting viable clients

**The `"other"` purpose auto-rejected in-scope enquiries.** The option is
labelled *"Other short-stay purpose"* — a short stay is exactly this firm's
practice area — but `computeOutcome()` returned `OUT_OF_SCOPE` for it.
Weddings, conferences, medical visits, short courses: all bounced.

**Any unpublished origin/destination pair was a flat rejection.** The India hub
publishes two desks (Schengen, UK). So every India → Australia, New Zealand,
Canada, USA and Turkey enquiry received *"Probably not one for us"* and the flow
ended. On the current catalogue that is six of eight destinations dead-ended for
one of your two markets.

### What replaced it

Four outcomes, and only one is a referral out — reserved for study, work and
settlement, which genuinely are not visitor visas:

| Outcome | When | What the client sees |
|---|---|---|
| `ROUTE_MATCHED` | Published desk, nothing unusual | The route, the document list, next steps |
| `ROUTE_MATCHED_WITH_CARE` | Published desk, points needing preparation | The same, plus what to prepare and why |
| `ROUTE_UNPUBLISHED` | No published desk for the pair | Honest "we don't run this desk", nearest routes, and a consultation |
| `SCOPE_REFERRAL` | Study / work / settlement | Where to go instead, and an offer to help with any short visit |

Every result now carries **what is working in your favour**, **what to prepare
for** (each with the remedy, not just the flag), and **numbered next steps**.
Previous refusals and tight timelines became preparation notes rather than
strikes — consistent with what your own form already told people
("A previous refusal is not fatal").

### The line I did not cross

The engine states no financial thresholds, processing times, refusal
cooling-off periods, or approval rates. Every substantive sentence comes from
your published catalogue in `constants.ts`, from process facts that hold
regardless of the rules, or from the client's own answers reflected back.

I did **not** extend the service catalogue to claim coverage you have not
approved — that file states it must not be extended without a business
decision. "In the client's favour" here means never dead-ending someone; it
does not mean asserting eligibility that cannot be substantiated. An
unpublished route routes to a person, which captures the lead without the site
promising a desk that does not exist.

### Verification

The engine compiles under `strict` with zero errors against its real
dependency. Nine scenarios were executed covering every branch, asserting: no
result lacks a next step, no visitor enquiry is referred out, every watch point
carries guidance, and every outcome has presentation styling. All held.

### Supporting changes

- `src/app/(public)/eligibility/page.tsx` — rewired to the engine. Options are
  now a real `radiogroup` with arrow-key navigation (previously every option
  needed its own tab stop). The question heading takes focus on each step.
  Progress is exposed to assistive tech. Added a phone field, "change my last
  answer", and "start again".
- `src/app/actions/leads.ts` — accepts the new outcome codes, writes the
  engine's reasoning trail to the previously unused `matchedRules` column, and
  stores readable values. Leads previously recorded `countryOfInterest: "SCH"`
  and `visaTypeInterest: "From uk"`.
- `prisma/schema.prisma` — **comments only, no migration.** The stale codes in
  the comments (`POTENTIALLY_SUITABLE` etc.) matched neither the old code nor
  the new.

---

## 2. Client portal was unnavigable on mobile

`ClientSidebar` and `ClientTopbar` are siblings, and each held its own
`useState` for the drawer:

- The topbar rendered the hamburger and called **its own** `setOpen(true)`.
  Nothing read that value.
- The sidebar read **its own** `open`. Nothing ever set it to `true`.

Below the `lg` breakpoint, a signed-in client could not reach Documents,
Messages, Appointments, Payments or Profile — and Sign out lived only in the
sidebar they could not open. The button had a pressed state, which is likely
why it survived review.

**Fix:** `src/components/client/shell-context.tsx` lifts the state above both,
with Escape-to-close and background scroll lock. The layout wraps them.

While in the topbar:

- The bell carried a permanently lit unread dot directly above a menu reading
  "No new notifications". It is now a real menu with no false badge. Same
  hardcoded dot removed from the admin topbar.
- The user chip was a `div` with a chevron on it. A chevron promises a menu, so
  tapping it and getting nothing reads as broken. It is now an actual menu —
  which also puts Sign out within reach on a phone.
- The search field was removed. It was a non-functional input promising "Search
  applications, documents, invoices…". The admin equivalent is kept but
  disabled and labelled, since staff tolerate a known stub and clients read one
  as a broken product. **Revert either if you disagree** — this is a judgement
  call, not a bug fix.

---

## 3. Dead links

I checked every internal `href` in the codebase against the routes that
actually exist. There is no `/blog/[slug]` and no `/immigration-updates/[slug]`.

| Was | Now |
|---|---|
| 3 homepage blog cards → `/blog/{slug}` (404) | Plain articles; hover-lift and arrow removed with the link |
| 3 homepage update headlines → `/immigration-updates/{slug}` (404) | Plain headings; the official source links still work |
| Admin "View" on a published post → 404 in a new tab | Points at `/blog` with an explanatory title |
| Login page "Forgot?" → `/client/forgot-password` (404) | Points at `/contact` — there is no password reset flow anywhere in the codebase |

Every one is commented with what to restore when the detail routes are built.

---

## 4. Fabricated content presented as verified

The homepage renders `DEMO_STORIES` and `DEMO_UPDATES`. Those fixtures carry
their own warning: *"invented for layout purposes … Never present these
figures, names or cases as real."*

The homepage presented them under the heading **"Real applications, real
results"**, with the lede *"Published with client permission"*, and stamped each
card with a teal **"Approved"** verification pill. The updates section showed
**"Verified {date}"** on invented records — and verification is the entire
reason that section exists.

`/success-stories`, `/immigration-updates` and `/blog` already show a
placeholder notice when `IS_DEMO_CONTENT` is true. The homepage did not.

Fixed by extending the same guard: while `IS_DEMO_CONTENT` is `true` the
headings and ledes say plainly that these are placeholders, the pill drops to
neutral, and the verification date is replaced. Flip `IS_DEMO_CONTENT` to
`false` in `src/lib/content.ts` and the original copy returns automatically.

For an immigration consultancy, fabricated testimonials and fabricated
verification dates are the two claims most likely to cause real damage.

---

## 5. Navigation, forms, footer

**`nav.tsx`**
- Dropdowns were hover-only with no `aria-expanded` and no keyboard path — and
  a tap fires no `mouseenter`, so they were unusable on tablets. Now a real
  disclosure with Escape-to-close.
- A hover arrow used `group-hover:` with no `group` ancestor (the nearest was a
  sibling). It could never appear. Scoped to `group/item`.
- Hamburger had no expanded state or `aria-controls`.

**`apply/page.tsx`** — the one that was corrupting data:
- **"Not sure yet" sat last in the visa select with `value=""`.** A `<select>`
  adopts its first option as the default, so anyone who did not touch the
  control submitted **"UK → Schengen Tourist Visa"** as their stated interest.
  Every untouched form produced a wrong lead. Same trap on "Applying from" and
  "Purpose", where an untouched form asserted the applicant was in the UK on
  holiday. All three now open on a neutral option.
- Purpose options did not match the eligibility form's; added the missing one.
- No `autoComplete` anywhere. Added on name, email, phone, date of birth.
- Field errors were not tied to their inputs (`aria-invalid`,
  `aria-describedby`), and the form-level error had no `role="alert"`.

**`footer.tsx`**
- Grid was `5 + 2 + 2 + 2 = 11` of 12 columns, pulling the layout off-axis.
- All four social links announced as "Social link".
- Office hours hardcoded in two places while `siteConfig.hours` held the real
  values — already diverging (`9:00 AM - 6:00 PM` vs `09:00 – 18:00 IST/GMT`).

**Both sidebars** — active items were styled but never announced
(`aria-current`); icon-only buttons were unlabelled; the admin overlay had no
keyboard exit and the page behind it scrolled. Removed dead
`AdminMobileMenuTrigger` (exported, never imported).

---

## Not fixed — in priority order

**1. The client portal dashboard shows invented data to every real client.**
`src/app/client/(dashboard)/page.tsx` imports `DEMO_CLIENT_CASE` and renders an
invented client name, case reference, progress percentage, timeline and
counsellor name. Every signed-in client sees the same fictional case. The
fixture file says never to present it as real. **This is the highest-severity
issue remaining and it should block launch.** The fix is to query Prisma for
the signed-in client's `Client`, `Application`, `Document`, `Appointment` and
`Message` records, with a real empty state for accounts that have no case open
yet. `src/lib/demo-cases.ts` becomes dead code at that point.

**2. I could not run a build.** No `node_modules`, no network access. The
engine type-checks strictly with zero errors against its real dependency; the
fourteen `.tsx`/`.ts` files are syntax-verified only, and I confirmed no
dangling references to anything I removed. **Run `npm install && npm run build`
before deploying.** That is the gap in my verification, and it is a real one.

**3. Placeholder identity data, left deliberately.** `siteConfig.social` points
at `linkedin.com/company/trust-gate` and similar; `legal.registration` reads
"UK & India Registered". Inventing a regulator, a registration number or social
handles for a firm giving immigration advice is exactly the wrong kind of help,
and the file's own comment already flags it.

**4. Coverage.** I have read roughly two dozen of 167 source files closely.
Untouched: the admin applications, leads, documents, payments, appointments,
messages, services, countries, settings and users screens; the client
application, documents, messages, payments, profile and appointments pages; the
homepage hero and remaining sections; country and service detail pages; the
contact and about pages; auth configuration and the API routes. I cannot claim
"every broken element" has been found — only that what is listed above was
found, verified, and fixed.

**5. Twenty-two stale status/summary markdown files** in the project root
(`DONE.md`, `FINAL_SUMMARY.md`, `COMPLETE_SUCCESS.md`, `CRITICAL_STATUS.md` and
so on), several contradicting each other, plus `page.tsx.backup`,
`page.tsx.backup-broken`, `page.tsx.broken` and a 810KB
`trust-gate-overseas.rar` committed alongside `src/`. Not a functional bug, but
it makes the real state of the project hard to establish — as this session
demonstrated.
