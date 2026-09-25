/**
 * Measures real round-trip latency to your database.
 * Run:  node scripts/db-latency.mjs
 *
 * Tells you whether slowness is the network (high, flat latency) or your
 * queries (low latency but slow pages) — so you fix the right thing.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const runs = 12;

console.log("Connecting…");
const coldStart = Date.now();
await prisma.$queryRaw`SELECT 1`;
console.log(`  first query (incl. connect + any cold start): ${Date.now() - coldStart}ms\n`);

const times = [];
for (let i = 0; i < runs; i++) {
  const t = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  times.push(Date.now() - t);
}
times.sort((a, b) => a - b);

const median = times[Math.floor(runs / 2)];
console.log(`warm round trip over ${runs} runs:`);
console.log(`  min ${times[0]}ms · median ${median}ms · max ${times[runs - 1]}ms\n`);

if (median < 15) console.log("✅ Local or same-region. Not your bottleneck.");
else if (median < 60) console.log("🟡 Acceptable. A 10-query page pays ~" + median * 10 + "ms if serial.");
else console.log("🔴 High. Use the POOLED endpoint and move the DB to your region (ap-south-1 for India).");

console.log(`\nA page with 10 parallel queries costs roughly one round trip (~${median}ms).`);
console.log(`The same 10 run serially would cost ~${median * 10}ms — parallelise with Promise.all.`);

await prisma.$disconnect();
