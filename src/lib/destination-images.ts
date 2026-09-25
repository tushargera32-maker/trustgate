import { type DestinationCode } from "@/lib/constants";

/**
 * Destination imagery.
 *
 * ⚠️ AUDIT, AUG 2026 — the files in /public/destinations are misnamed. Every
 * filename was checked against the actual image content, and only two of six
 * showed the country they claimed:
 *
 *   australia.webp    → Toronto skyline (Canada)
 *   canada.webp       → passport + blank form on a desk (no country)
 *   new-zealand.webp  → Dubai, Burj Khalifa (UAE — not a route we cover)
 *   schengen.webp     → a man holding a UK visa in the Trust Gate office
 *   uk.webp           → Lake Tekapo (New Zealand)
 *   usa.webp          → Singapore, the Merlion
 *
 * A second pass found the same problem in /public/office:
 *   london-office.webp → Paris, the Eiffel Tower (usable: Schengen)
 *   india-office.webp  → Westminster at sunset  (usable: United Kingdom)
 *
 * ⚠️ CONSEQUENCE: there is NO photography of either office. The About page
 * must not present these as Jalandhar or London premises.
 *
 * This map therefore points each destination at the file that genuinely shows
 * it, regardless of what the file is called. Destinations with no truthful
 * image get the typographic fallback tile instead — showing the wrong country
 * on a visa page is worse than showing no photograph at all.
 *
 * TO FIX PROPERLY: source licensed photography for Schengen, the UK, Australia,
 * the USA and Turkey, drop it in /public/destinations, and register it below.
 * The two entries here are correct and can stay.
 */
export const DESTINATION_IMAGES: Partial<Record<DestinationCode, string>> = {
  // Toronto skyline — filed under australia.webp, but genuinely Canada.
  CA: "/destinations/australia.webp",
  // Lake Tekapo — filed under uk.webp, but genuinely New Zealand.
  NZ: "/destinations/uk.webp",
  // Paris at sunset — filed under office/london-office.webp. Not an office.
  SCH: "/office/london-office.webp",
  // Westminster at sunset — filed under office/india-office.webp. Not an office.
  GB: "/office/india-office.webp"

  // AU — no image. australia.webp is Canada.
  // US — no image. usa.webp is Singapore.
  // TR — no image supplied.
  // WW — intentionally never a photograph; it means "everywhere else".
};

export const DESTINATION_ALT: Partial<Record<DestinationCode, string>> = {
  CA: "Toronto waterfront and skyline",
  NZ: "Lake Tekapo with the Southern Alps beyond",
  SCH: "The Seine and the Eiffel Tower at sunset",
  GB: "Westminster and the Thames at sunset"
};

/**
 * Generic imagery with no country claim — safe anywhere a photograph is wanted
 * but a specific place is not being asserted.
 */
export const GENERIC_IMAGES = {
  /** Passport and a blank application form on a desk. */
  paperwork: "/destinations/canada.webp",
  /** A client holding an approved visa, in the Trust Gate office. */
  approval: "/destinations/schengen.webp",
  /** Dubai at dusk. Not a route we cover — do not use as a destination. */
  unusedCity: "/destinations/new-zealand.webp"
} as const;

export function destinationImage(code: DestinationCode) {
  return DESTINATION_IMAGES[code] ?? null;
}

export function destinationAlt(code: DestinationCode) {
  return DESTINATION_ALT[code] ?? "";
}

export function hasDestinationImage(code: DestinationCode) {
  return Boolean(DESTINATION_IMAGES[code]);
}
