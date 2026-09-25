import { PrismaClient } from "@prisma/client";

/**
 * Prisma singleton.
 *
 * Two things the previous version got wrong, both worth knowing:
 *
 *  1. The singleton was only stored on `globalThis` in development, and the
 *     comment claimed this "enables query result caching". It does neither.
 *     Its actual job is to survive Next's hot reload — without it, every HMR
 *     pass leaks a new PrismaClient and a new connection pool, which is a
 *     large part of why dev gets slower the longer it runs.
 *
 *  2. `prisma.$connect()` was called at module scope. That fires an eager
 *     connection on every import, blocks the module graph, and throws an
 *     unhandled rejection if the database is briefly unreachable. Prisma
 *     connects lazily on first query — which is what you want.
 *
 * Connection pooling is configured in the URL, not here. Point DATABASE_URL at
 * your provider's pooled endpoint (Neon: the `-pooler` host; Supabase: port
 * 6543) with `pgbouncer=true&connection_limit=1`.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"]
  });

// Kept in dev so hot reload reuses one client and one pool.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
