# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Trust Gate Overseas is a premium immigration consultancy website and SaaS client-management platform built with Next.js 14 App Router, TypeScript, Tailwind CSS, Prisma ORM, and NextAuth.js. It serves as both a public-facing marketing site and dual-dashboard system (client portal + admin CRM).

**Important**: All seeded content is for development and demonstration only. Never present demo clients, reviews, or numbers as real data.

## Commands

### Development
```bash
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build (includes prisma generate)
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

### Database
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Sync schema without migrations (fast, for prototyping)
npm run db:migrate   # Create and apply migration (use for production)
npm run db:studio    # Open Prisma Studio GUI
npm run db:seed      # Seed demo data
```

**Database setup**: Requires `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` in `.env.local`. Generate secret: `openssl rand -base64 48`. For local dev without PostgreSQL, switch `provider` to `sqlite` in `prisma/schema.prisma` and set `DATABASE_URL="file:./dev.db"`.

### Demo Credentials (seeded)
- Admin: `admin@demo.com` / `demo1234`
- Client: `client@demo.com` / `demo1234`

## Architecture

### Route Structure

The app follows Next.js 14 App Router conventions with three distinct routing groups:

1. **`app/(public)/`** — Public marketing site with header/footer layout
   - Home, countries (index + `[code]` detail), services (index + `[slug]` detail)
   - Success stories, immigration updates, blog, about, FAQ, contact
   - Eligibility assessment (multi-step), apply form, legal pages `[slug]`
   - Client login at `(public)/client/login`

2. **`app/client/(dashboard)/`** — Client portal (auth-guarded)
   - Dashboard with KPIs, application status timeline, document centre
   - Messages, appointments, payments, profile

3. **`app/admin/(dashboard)/`** — Admin SaaS dashboard (staff-guarded)
   - Dashboard with lead volume charts
   - CRM: leads (pipeline stages), applications, documents, appointments, payments
   - Content managers: countries, services, blog, immigration updates, success stories
   - Users & roles, settings

### Authentication & Authorization

- **Provider**: NextAuth.js with Credentials (bcrypt password hashing)
- **Session**: JWT-based, 7-day expiry
- **Config**: `src/app/api/auth/[...nextauth]/route.ts` exports `authOptions`
- **Helpers**: `src/lib/auth.ts` exports:
  - `getSession()` — fetch current session
  - `requireSession()` — redirect to login if not authenticated
  - `requireStaff()` — redirect to `/client` if role is CLIENT
  - `requireRole(...roles)` — enforce specific staff roles
- **Roles**: `SUPER_ADMIN`, `ADMIN`, `COUNSELLOR`, `CASE_MANAGER`, `CONTENT_MANAGER`, `FINANCE`, `CLIENT`
- **Middleware**: Co-located under `admin/(dashboard)/middleware.ts` to protect admin routes

### Data Layer

- **ORM**: Prisma (`src/lib/db.ts` exports singleton client)
- **Schema**: `prisma/schema.prisma` — comprehensive model covering:
  - Identity: `User`, `Account`, `Session`, `StaffProfile`
  - CRM: `Lead`, `LeadActivity` (pipeline stages: NEW → CONTACTED → CONVERTED)
  - Clients: `Client`, `Application`, `ApplicationTimeline`
  - Geography: `Country`, `VisaType`, `Service`
  - Documents: `Document`, `DocumentRequirement`, `DocumentReview`
  - Operations: `Appointment`, `Message`, `Payment`, `Invoice`
  - Content: `BlogPost`, `ImmigrationUpdate`, `SuccessStory`, `Review`
  - Eligibility: `EligibilityQuestion`, `EligibilityRule`, `EligibilityResult`
  - System: `Notification`, `AuditLog`, `SiteSetting`

**Key relationships**:
- `User` ↔ `Client` (1:1 when role = CLIENT)
- `Lead` → `Client` (conversion via `convertedToClientId`)
- `Client` → `Application` (1:N)
- `Application` → `ApplicationTimeline` (status history)
- All models use `cuid()` IDs

### Configuration

- **Site config**: `src/lib/site-config.ts` — brand, contact, hours, social links
  - Reads from `NEXT_PUBLIC_*` env vars with fallback defaults
  - **Before launch**: Replace demo values (company name, phone, email, regulatory registration)
- **Constants**: `src/lib/constants.ts` — countries, visa categories, statuses
- **SEO helpers**: `src/lib/seo.ts` — JSON-LD builders (Organization, WebSite, Article, FAQPage)
- **Utilities**: `src/lib/utils.ts` — `cn()` (Tailwind class merger), formatters

### Component Organization

- **`components/ui/`** — Design system primitives (shadcn-style, Radix UI + Tailwind)
- **`components/layout/`** — Header (Nav), Footer (public site)
- **`components/admin/`** — Sidebar, Topbar (admin dashboard)
- **`components/client/`** — Sidebar, Topbar (client portal)
- **`components/motion/`** — Framer Motion reveal helpers
- **`components/seo/`** — JSON-LD components

### Styling

- **Tailwind CSS** — utility-first with `@` path imports (`@/`)
- **Global styles**: `src/app/globals.css`
- **Theme**: Dark mode via `next-themes` (provider in `src/components/providers.tsx`)
- **Icons**: `lucide-react`

### TypeScript Configuration

- **Strict mode** enabled
- **Path alias**: `@/*` → `./src/*`
- **Target**: ES2022
- NextAuth types extended in `src/types/next-auth.d.ts` (adds `role` and `id` to session)

## Development Patterns

### Adding a New Page

1. Create route file under appropriate group: `app/(public)/`, `app/client/(dashboard)/`, or `app/admin/(dashboard)/`
2. Use Server Components by default; add `"use client"` only when needed (forms, interactivity)
3. Fetch data with Prisma directly in Server Components (no separate API routes needed)
4. For auth-guarded pages: call `requireSession()` or `requireStaff()` at top of component

### Database Changes

1. Edit `prisma/schema.prisma`
2. Run `npm run db:push` (dev) or `npm run db:migrate` (production)
3. Prisma Client regenerates automatically via `postinstall` hook

### RBAC Enforcement

- **Server-side**: Use `requireRole("SUPER_ADMIN", "ADMIN")` in page/action
- **Client-side**: Check `session.user.role` for conditional UI
- Staff roles: `SUPER_ADMIN` > `ADMIN` > `COUNSELLOR`, `CASE_MANAGER`, `CONTENT_MANAGER`, `FINANCE`

### SEO & Metadata

- Use Next.js `Metadata` API for per-page meta tags
- JSON-LD: Import builders from `@/lib/seo`, render in layout or page
- Sitemap: `app/sitemap.ts` (dynamic, includes countries, services, blog)
- Robots: `app/robots.ts`

## Trust & Compliance Notes

- **No government affiliation claims** unless officially true
- **No visa approval guarantees** — outcomes are determined by immigration authorities
- **Immigration updates** must cite `lastVerifiedAt` date and `sourceName`/`sourceUrl`
- **Document storage paths** (`storageKey`) are private — never expose publicly
- **Demo data warning** — all seeded content is clearly marked; replace before launch

## Integration Stubs

The following integrations are scaffolded (env-var driven, no-op until credentials provided):

- **Payments**: Razorpay (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`)
- **Email**: SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`)
- **WhatsApp**: Business API (`WHATSAPP_BUSINESS_ID`, `WHATSAPP_TOKEN`)
- **Object storage**: S3-compatible (`S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`)
- **Analytics**: GA, GSC, Meta Pixel (`NEXT_PUBLIC_GA_ID`, etc.)

Never expose API keys in frontend code. Use Server Actions or API routes.

## Common Tasks

### Adding a New Staff Role
1. Add enum value to `Role` in `prisma/schema.prisma`
2. Update `StaffRole` type in `src/lib/auth.ts`
3. Run `npm run db:push`

### Adding a New Application Status
1. Add enum value to `ApplicationStatus` in schema
2. Update status display logic in client/admin dashboards
3. Run `npm run db:push`

### Modifying Lead Pipeline Stages
1. Edit `LeadStage` enum in schema
2. Update CRM filters in `app/admin/(dashboard)/leads/page.tsx`
3. Run `npm run db:push`

### Adding a New Country/Service
1. Use admin dashboard (`/admin/countries` or `/admin/services`)
2. Or seed via `prisma/seed.ts` for bulk imports
3. Dynamic routes `[code]` and `[slug]` auto-generate pages

## Production Checklist

Before deploying:
1. Replace all demo content via admin dashboard
2. Update `siteConfig` in `src/lib/site-config.ts` with real values
3. Set production env vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
4. Configure object storage (`S3_*`) for document uploads
5. Set up transactional email (`SMTP_*`)
6. Configure payment provider (`RAZORPAY_*`)
7. Verify regulatory compliance (UK immigration advice is regulated)
8. Test backup restore procedure

## Known Constraints

- **Document storage**: Currently stores `storageKey` paths only; implement S3 adapter with signed URLs for production
- **Payment flow**: Razorpay integration is stubbed; implement checkout + webhook handler
- **Email/WhatsApp**: Senders are no-op until credentials provided
- **Real-time**: No WebSocket/SSE for live notifications yet (roadmap item)
- **Tests**: No test suite yet (Vitest + Playwright planned for Phase 2)
