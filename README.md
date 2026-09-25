# Trust Gate Overseas

A premium immigration consultancy website and SaaS client-management platform for **Trust Gate Overseas** — built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion and Prisma.

> ⚠️ All seeded content is **for development and demonstration only**. Replace with real Trust Gate Overseas data before launch. Never present demo clients, reviews, or numbers as real data.

---

## Architecture

```
trust-gate-overseas/
├── prisma/
│   ├── schema.prisma          # Full data model: users, roles, leads, clients,
│   │                          # countries, visas, services, applications,
│   │                          # documents, appointments, payments, blog,
│   │                          # immigration updates, eligibility, audit, …
│   └── seed.ts                # Demo seed (clearly marked)
├── public/                    # Static assets
└── src/
    ├── app/
    │   ├── (public)/          # Public site — header/footer layout
    │   │   ├── page.tsx       # Home
    │   │   ├── countries/     # Index + [code] detail
    │   │   ├── services/      # Index + [slug] detail
    │   │   ├── success-stories/
    │   │   ├── immigration-updates/
    │   │   ├── blog/
    │   │   ├── about/
    │   │   ├── faq/
    │   │   ├── contact/
    │   │   ├── eligibility/   # Multi-step assessment
    │   │   ├── apply/
    │   │   ├── legal/[slug]/  # Privacy, Terms, Refund, Cookies, Disclaimer
    │   │   └── client/login/
    │   ├── client/            # Client portal (auth-guarded)
    │   ├── admin/             # Admin SaaS dashboard (staff-guarded)
    │   ├── api/auth/          # NextAuth handler
    │   ├── layout.tsx         # Root layout (providers, fonts, JSON-LD)
    │   ├── sitemap.ts         # Dynamic sitemap
    │   ├── robots.ts          # robots.txt
    │   └── not-found.tsx
    ├── components/
    │   ├── ui/                # Design system primitives
    │   ├── motion/            # Framer Motion reveal helpers
    │   ├── layout/            # Header, Footer
    │   ├── admin/             # Admin sidebar/topbar
    │   ├── client/            # Client sidebar/topbar
    │   └── seo/               # JSON-LD components
    └── lib/
        ├── db.ts              # Prisma client
        ├── auth.ts            # Session + RBAC helpers
        ├── site-config.ts     # Brand, contact, hours
        ├── constants.ts       # Countries, visa categories, statuses
        ├── seo.ts             # JSON-LD builders
        └── utils.ts           # cn(), formatters
```

## Tech stack

| Layer        | Choice                                                                 |
| ------------ | ---------------------------------------------------------------------- |
| Framework    | Next.js 14 (App Router, Server Components, Server Actions)             |
| Language     | TypeScript (strict)                                                    |
| Styling      | Tailwind CSS · shadcn-style primitives · Radix UI                      |
| Motion       | Framer Motion                                                          |
| Data         | PostgreSQL (recommended) · Prisma ORM                                  |
| Auth         | NextAuth.js (Credentials provider) · bcrypt                           |
| Forms        | react-hook-form · zod                                                  |
| Charts       | Recharts (admin)                                                       |
| Icons        | lucide-react                                                           |

## Quick start

### 1. Install

```bash
npm install
```

### 2. Configure

Copy `.env.example` to `.env.local` and fill in:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/trust_gate?schema=public"
NEXTAUTH_SECRET="a-long-random-string"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a strong secret:

```bash
openssl rand -base64 48
```

> For local quick-start with no PostgreSQL available, swap the `provider` in
> `prisma/schema.prisma` to `sqlite` and set `DATABASE_URL="file:./dev.db"`.

### 3. Migrate + seed

```bash
npm run db:push      # or: npm run db:migrate
npm run db:seed
```

### 4. Run

```bash
npm run dev
```

Open <http://localhost:3000>.

### Demo credentials (seeded)

| Role            | Email             | Password   |
| --------------- | ----------------- | ---------- |
| Super Admin     | `admin@demo.com`  | `demo1234` |
| Client          | `client@demo.com` | `demo1234` |

## Scripts

| Command                  | Action                                       |
| ------------------------ | -------------------------------------------- |
| `npm run dev`            | Start dev server                             |
| `npm run build`          | Production build (with Prisma generate)      |
| `npm run start`          | Start production server                      |
| `npm run lint`           | Lint                                         |
| `npm run format`         | Prettier                                     |
| `npm run db:push`        | Sync schema (no migration history)           |
| `npm run db:migrate`     | Create migration + apply                     |
| `npm run db:studio`      | Open Prisma Studio                           |
| `npm run db:seed`        | Run demo seed                                |

## What's included

### Public site

- **Home** — hero, trust band, country discovery, services, eligibility CTA, why us, process timeline, success stories, immigration updates, blog, FAQ, consultation CTA
- **Countries** — index + dynamic per-country page with pathways, eligibility, FAQs
- **Services** — index + dynamic per-visa-category page
- **Success Stories** — feature cards with country/visa filters
- **Immigration Updates** — verified, dated updates with source attribution
- **Blog** — editorial-grade cards
- **About** — story, values, leadership, credentials
- **FAQ** — grouped
- **Contact** — multi-field form with confirmation state
- **Eligibility Assessment** — multi-step assessment with preliminary outcome
- **Apply** — phased application form
- **Legal** — Privacy, Terms, Refund, Cookies, Disclaimer

### Client portal

- Dashboard with KPIs, timeline and action items
- Application view with full status timeline
- Document centre with drag-and-drop UI and status states
- Messages (with internal/external separation in the data model)
- Appointments (upcoming + past)
- Payments (paid / outstanding / invoices)
- Profile + notification preferences

### Admin SaaS dashboard

- Dashboard with KPIs and 30-day lead volume
- **Leads CRM** — pipeline tabs by stage, search, filters, export
- Applications — searchable reference/client list with progress bars
- Document review queue
- Appointments queue
- Payments
- Content managers — countries, services, blog, immigration updates, stories
- Users & roles with RBAC tags
- Settings — brand, contact, integrations (env-var driven)

### Auth & RBAC

- Roles: `SUPER_ADMIN`, `ADMIN`, `COUNSELLOR`, `CASE_MANAGER`, `CONTENT_MANAGER`, `FINANCE`, `CLIENT`
- `src/lib/auth.ts` exports `requireSession`, `requireStaff`, `requireRole`
- `src/middleware.ts` (co-located under `admin/(dashboard)/middleware.ts`) bounces unauthenticated traffic
- JWT-based sessions, password hashing with bcrypt

### SEO

- Per-page metadata via Next.js Metadata API
- Dynamic `sitemap.ts` and `robots.ts`
- JSON-LD: Organization, WebSite, Article, FAQPage, BreadcrumbList
- Open Graph + Twitter cards, canonical URLs

### Integrations (clean layers, env-var driven)

- **Payments** — Razorpay (`RAZORPAY_*`)
- **Email** — SMTP (`SMTP_*`)
- **WhatsApp** — Business API (`WHATSAPP_*`)
- **Object storage** — S3-compatible (`S3_*`)
- **Analytics** — GA / GSC / Meta Pixel (`NEXT_PUBLIC_*`)

All integrations are no-op until credentials are provided. Never expose keys in
frontend code.

## Replacing demo content

After launch, replace demo content from the admin dashboard:

- Brand, contact details → `admin/settings`
- Countries, services, blog, updates, success stories → respective admin pages
- Replace `siteConfig` defaults in `src/lib/site-config.ts`
- Update `NEXT_PUBLIC_*` env vars

## Trust & compliance

- We never claim government affiliation unless officially true
- We never promise visa approvals, guaranteed outcomes or processing times
- All immigration updates cite a `lastVerifiedAt` date and source
- Document storage paths are private — never exposed publicly

## Production deployment

Recommended:

1. **Database** — managed PostgreSQL (Neon, Supabase, RDS)
2. **App** — Vercel, Render, Fly.io, or a Node-capable host
3. **Object storage** — S3 / R2 for client documents (configure `S3_*`)
4. **Email** — transactional provider via SMTP
5. **Backups** — daily database snapshots; test restore quarterly

## Roadmap (Phase 2+)

- Real document storage adapter (S3 with signed URLs)
- Real Razorpay checkout flow + webhooks
- Real email + WhatsApp senders
- Real-time notifications (Server-Sent Events or Pusher)
- Multi-office / multi-tenant settings
- Advanced analytics + funnel reporting
- Test suite (Vitest + Playwright)

## Licence

Proprietary. © Trust Gate Overseas. All rights reserved.