# Performance — what to fix, in order

Measure first: `node scripts/db-latency.mjs`. It tells you whether the problem
is the network or your code, so you fix the right thing.

## 1. Use the POOLED database endpoint  ← biggest win

Your `DATABASE_URL` points at Neon's **direct** endpoint (no `-pooler` in the
host). Every query therefore opens a fresh TCP + TLS handshake to AWS, and
Neon's serverless compute may cold-start on top of that. Expect 300–800ms of
pure overhead per page render.

In the Neon console, copy the **Pooled connection** string:

```bash
DATABASE_URL="postgresql://…@ep-xxx-pooler.<region>.aws.neon.tech/db?sslmode=require&pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://…@ep-xxx.<region>.aws.neon.tech/db?sslmode=require"
```

`DIRECT_URL` is for migrations only — pgbouncer cannot run DDL in transaction
pooling mode. `prisma/schema.prisma` is already configured for both.

## 2. Check the database region

If the DB is in `us-east-1` and you are in Haryana, that is ~250ms round trip
on physics alone, and no amount of code fixes it. For an India-based team,
recreate the project in **ap-south-1** (Mumbai). For UK users, `eu-west-2`.

## 3. Turn off scale-to-zero while developing

Neon suspends idle compute. The first request after a pause pays a cold start.
Disable autosuspend on your dev branch.

## 4. Stop judging speed by `npm run dev`

`next dev` compiles each route on first visit, skips minification, and
`reactStrictMode: true` double-renders every component. It is not
representative. Always compare with:

```bash
npm run build && npm start
```

## 5. Already fixed in the codebase

- **`modularizeImports` conflict removed** from `next.config.mjs`. It duplicated
  `experimental.optimizePackageImports` on lucide-react; running both resolves
  every icon twice and badly slows dev compiles.
- **Prisma singleton corrected.** `prisma.$connect()` at module scope was firing
  an eager connection on every import and could throw an unhandled rejection.
  Prisma connects lazily on first query.
- **Images: 43.25 MB → 2.24 MB** (94.8%). Run `python3 scripts/optimise-images.py`
  after adding any new asset. Originals kept in `public/_originals/`.

## 6. Query patterns

The admin overview already parallelises 10 counts with `Promise.all` — good.
Keep that pattern: **10 parallel queries cost roughly one round trip; 10 serial
`await`s cost ten.** With a 200ms link that is the difference between 0.2s and
2s on one page.

When adding queries, check for N+1: a `findMany` followed by a per-row lookup
inside `.map()` is the usual culprit. Use `include`/`select` instead.

## 7. Only after the above

If pages are still slow once latency is low, profile before optimising —
`next build` prints per-route bundle sizes, and the React DevTools Profiler
shows render cost. Do not guess.
