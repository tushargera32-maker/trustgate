/**
 * Trust Gate Overseas — Seed
 *
 * Generates demo content so the platform is browsable immediately.
 *
 * ⚠️  All seeded content is for development and demonstration only.
 *     Replace with real Trust Gate Overseas information before launch.
 *     Never present demo clients, reviews or numbers as real data.
 *
 * SCOPE: visitor / tourist visas only, from two hubs — the United Kingdom
 * and India. Do not seed PR, Express Entry, study, work or family
 * sponsorship records. See src/lib/constants.ts for the approved service
 * catalogue this seed mirrors.
 */

import { PrismaClient, Role, LeadStage, LeadSource } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding…");

  // ----- Demo users (passwords are hashed) -----
  const passwordHash = await bcrypt.hash("demo1234", 10);
  await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      email: "admin@demo.com",
      name: "Demo Admin",
      role: Role.SUPER_ADMIN,
      passwordHash,
      emailVerified: new Date()
    }
  });
  await prisma.user.upsert({
    where: { email: "client@demo.com" },
    update: {},
    create: {
      email: "client@demo.com",
      name: "Demo Client",
      role: Role.CLIENT,
      passwordHash,
      emailVerified: new Date()
    }
  });

  // ----- Destinations we cover -----
  // Mirrors src/lib/constants.ts DESTINATIONS. "WW" (Worldwide) is
  // intentionally excluded — it has no single-country landing page.
  const countries = [
    {
      code: "SCH",
      name: "Schengen",
      region: "Europe",
      flag: "🇪🇺",
      processing: "Varies by consulate (demo)"
    },
    {
      code: "AU",
      name: "Australia",
      region: "Oceania",
      flag: "🇦🇺",
      processing: "Varies by stream (demo)"
    },
    {
      code: "NZ",
      name: "New Zealand",
      region: "Oceania",
      flag: "🇳🇿",
      processing: "Varies by nationality (demo)"
    },
    {
      code: "CA",
      name: "Canada",
      region: "North America",
      flag: "🇨🇦",
      processing: "Varies by application type (demo)"
    },
    {
      code: "US",
      name: "USA",
      region: "North America",
      flag: "🇺🇸",
      processing: "Varies by consular post (demo)"
    },
    {
      code: "TR",
      name: "Turkey",
      region: "Europe / Asia",
      flag: "🇹🇷",
      processing: "Usually fast for e-Visa (demo)"
    },
    {
      code: "GB",
      name: "United Kingdom",
      region: "Europe",
      flag: "🇬🇧",
      processing: "Published by UKVI (demo)"
    }
  ];
  for (const c of countries) {
    await prisma.country.upsert({
      where: { code: c.code },
      update: {},
      create: {
        code: c.code,
        name: c.name,
        region: c.region,
        flag: c.flag,
        overview: `Demo overview for ${c.name} visitor visas. Replace with real, verified content before launch.`,
        processing: c.processing,
        published: true,
        order: 0,
        seoTitle: `${c.name} visitor visa — pathways & eligibility`,
        seoDescription: `Visitor and tourist visa guidance for ${c.name}. Eligibility, documents and processing information for prospective applicants.`
      }
    });
  }

  // ----- Demo leads (CRM) -----
  // countryOfInterest stores our Country.code; visaTypeInterest stores the
  // Service.slug from src/lib/constants.ts (e.g. "uk-schengen").
  const leadsData = [
    {
      name: "Ananya Kapoor",
      country: "GB",
      visa: "india-uk",
      stage: LeadStage.INTERESTED,
      source: LeadSource.WEBSITE_CONTACT
    },
    {
      name: "Rohan Mehta",
      country: "SCH",
      visa: "uk-schengen",
      stage: LeadStage.CONSULTATION_SCHEDULED,
      source: LeadSource.REFERRAL
    },
    {
      name: "Maria S.",
      country: "AU",
      visa: "uk-australia",
      stage: LeadStage.DOCUMENTS_PENDING,
      source: LeadSource.ELIGIBILITY_FORM
    },
    {
      name: "Hassan M.",
      country: "CA",
      visa: "uk-canada",
      stage: LeadStage.NEW,
      source: LeadSource.WHATSAPP
    },
    {
      name: "Sophie L.",
      country: "US",
      visa: "uk-usa",
      stage: LeadStage.CONTACTED,
      source: LeadSource.OTHER
    }
  ];
  for (const l of leadsData) {
    await prisma.lead.create({
      data: {
        fullName: l.name,
        email: `${l.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        phone: "+1 000 000 0000",
        countryOfInterest: l.country,
        visaTypeInterest: l.visa,
        source: l.source,
        stage: l.stage,
        notes: "Demo lead"
      }
    });
  }

  // ----- Demo immigration/visa update -----
  const schengen = await prisma.country.findUnique({ where: { code: "SCH" } });
  if (schengen) {
    await prisma.immigrationUpdate.upsert({
      where: { slug: "demo-schengen-90-180-rule-explained" },
      update: {},
      create: {
        slug: "demo-schengen-90-180-rule-explained",
        title: "How the Schengen 90/180 short-stay rule is counted",
        summary:
          "Demo update — an explanatory piece on how the 90-day short-stay window is calculated within any rolling 180-day period.",
        body:
          "Demo body. This is placeholder content for the Visa Updates feed. Always cite the official government source in production and never assert a policy has changed without verifying it first.",
        country: { connect: { code: "SCH" } },
        visaType: "uk-schengen",
        status: "PUBLISHED",
        publishedAt: new Date(),
        lastVerifiedAt: new Date(),
        sourceName: "European Commission — Visa policy",
        sourceUrl: "https://home-affairs.ec.europa.eu/policies/schengen/visa-policy_en",
        featured: true
      }
    });
  }

  // ----- Demo success story -----
  // Placeholder only — replace with a real, consented client statement
  // before publishing anything from the Reviews CMS.
  const gb = await prisma.country.findUnique({ where: { code: "GB" } });
  if (gb) {
    await prisma.successStory.create({
      data: {
        clientName: "Sample client",
        country: { connect: { code: "GB" } },
        visaType: "india-uk",
        summary: "Demo testimonial for layout purposes only — not a real client statement.",
        body: "Replace with a real, consented client testimonial before launch. Never fabricate a review.",
        rating: 5,
        featured: true,
        published: true
      }
    });
  }

  console.log("✅ Seed complete. Demo credentials:");
  console.log("   admin@demo.com / demo1234  (Super Admin)");
  console.log("   client@demo.com / demo1234  (Client)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
