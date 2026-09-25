import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { DESTINATIONS, SERVICES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = siteConfig.url.replace(/\/$/, "");

  const staticPages = [
    "",
    "/countries",
    "/services",
    "/success-stories",
    "/immigration-updates",
    "/blog",
    "/about",
    "/faq",
    "/contact",
    "/eligibility",
    "/apply",
    "/legal/privacy",
    "/legal/terms",
    "/legal/refund",
    "/legal/cookies",
    "/legal/disclaimer"
  ];

  return [
    ...staticPages.map((p) => ({
      url: `${base}${p}`,
      lastModified: now,
      changeFrequency: p === "" ? ("weekly" as const) : ("monthly" as const),
      priority: p === "" ? 1 : 0.7
    })),
    ...DESTINATIONS.map((d) => ({
      url: `${base}/countries/${d.code.toLowerCase()}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8
    })),
    ...SERVICES.filter((s) => s.published).map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9
    }))
  ];
}
