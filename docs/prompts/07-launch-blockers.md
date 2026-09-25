# Phase 7 — Launch blockers

1. **Document storage is local disk** (`.uploads/`, gitignored). This does not
   survive a redeploy on Vercel/Railway/Fly. Point `DOCUMENT_STORAGE_DIR` at a
   mounted volume, or swap to S3/R2. The DB stores only the key, so the change
   touches `api/client/documents/upload/route.ts` and the download route only.

2. **`components/seo/json-ld.tsx` imports `siteConfig` but never uses it.**
   Structured data may be hardcoded instead of reading config. Investigate and
   fix.

3. **Performance.** `DATABASE_URL` is remote Postgres, so every admin render
   pays network round-trips. Benchmark with `npm run build && npm start`, not
   `npm run dev`. Report real numbers.

4. **Full accessibility pass** against the quality floor in the context file.
   Measure contrast on image-backed surfaces rather than judging by eye.

Report findings with numbers, not impressions.
