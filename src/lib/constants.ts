/**
 * Trust Gate Overseas - canonical business constants.
 *
 * SCOPE (FINAL): Trust Gate Overseas is a premium VISITOR / TOURIST visa
 * consultancy serving applicants from the United Kingdom and India.
 *
 * We do NOT offer: permanent residency, Express Entry, PNP, skilled migration,
 * student visas, work permits, family sponsorship, job-seeker or investor visas.
 *
 * This file is the single source of truth for the public service catalogue.
 * The Services CMS in the admin dashboard edits this catalogue - it must never
 * be extended beyond the approved list below without a business decision.
 */

/* ───────────────────────── Origin hubs ───────────────────────── */

export const ORIGIN_HUBS = [
  {
    slug: "uk",
    name: "United Kingdom",
    short: "UK",
    flag: "🇬🇧",
    blurb:
      "Schengen, Australia, New Zealand, Canada, the USA, Turkey and worldwide tourist visas - plus UK visa extensions."
  },
  {
    slug: "india",
    name: "India",
    short: "India",
    flag: "🇮🇳",
    blurb: "Schengen tourist visas and UK Standard Visitor visas from India."
  }
] as const;

export type OriginHub = (typeof ORIGIN_HUBS)[number]["slug"];

/* ───────────────────────── Official sources ─────────────────────────
 * Only official government / intergovernmental portals are listed here.
 * These are landing pages, deliberately not deep links, because deep links
 * change frequently. Re-verify every URL before launch and at each content
 * review; record the check in the Immigration Updates CMS `lastVerifiedAt`.
 */

export const OFFICIAL_SOURCES = {
  UK: {
    name: "GOV.UK - Visit the UK",
    url: "https://www.gov.uk/standard-visitor"
  },
  SCHENGEN: {
    name: "European Commission - Visa policy",
    url: "https://home-affairs.ec.europa.eu/policies/schengen/visa-policy_en"
  },
  AUSTRALIA: {
    name: "Australian Department of Home Affairs",
    url: "https://immi.homeaffairs.gov.au/"
  },
  NEW_ZEALAND: {
    name: "Immigration New Zealand",
    url: "https://www.immigration.govt.nz/"
  },
  CANADA: {
    name: "Immigration, Refugees and Citizenship Canada",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship.html"
  },
  USA: {
    name: "U.S. Department of State - Travel",
    url: "https://travel.state.gov/"
  },
  TURKEY: {
    name: "Republic of Türkiye - e-Visa",
    url: "https://www.evisa.gov.tr/"
  }
} as const;

/* ───────────────────────── Destinations ───────────────────────── */

export const DESTINATIONS = [
  {
    code: "SCH",
    name: "Schengen",
    region: "Europe",
    flag: "🇪🇺",
    stayNote: "Short stay - up to 90 days in any 180-day period",
    source: OFFICIAL_SOURCES.SCHENGEN
  },
  {
    code: "AU",
    name: "Australia",
    region: "Oceania",
    flag: "🇦🇺",
    stayNote: "Visitor visa (subclass 600) - tourism and visiting family",
    source: OFFICIAL_SOURCES.AUSTRALIA
  },
  {
    code: "NZ",
    name: "New Zealand",
    region: "Oceania",
    flag: "🇳🇿",
    stayNote: "Visitor visa - tourism, family visits and short courses",
    source: OFFICIAL_SOURCES.NEW_ZEALAND
  },
  {
    code: "CA",
    name: "Canada",
    region: "North America",
    flag: "🇨🇦",
    stayNote: "Temporary Resident Visa (visitor visa) or eTA, profile-dependent",
    source: OFFICIAL_SOURCES.CANADA
  },
  {
    code: "US",
    name: "USA",
    region: "North America",
    flag: "🇺🇸",
    stayNote: "B-1/B-2 visitor visa, or ESTA where the traveller is eligible",
    source: OFFICIAL_SOURCES.USA
  },
  {
    code: "TR",
    name: "Turkey",
    region: "Europe / Asia",
    flag: "🇹🇷",
    stayNote: "e-Visa or sticker visa, depending on nationality",
    source: OFFICIAL_SOURCES.TURKEY
  },
  {
    code: "GB",
    name: "United Kingdom",
    region: "Europe",
    flag: "🇬🇧",
    stayNote: "Standard Visitor visa - usually up to 6 months",
    source: OFFICIAL_SOURCES.UK
  },
  {
    code: "WW",
    name: "Worldwide",
    region: "Everywhere else",
    flag: "🌍",
    stayNote: "Tourist visas for destinations outside our core routes",
    source: null
  }
] as const;

export type DestinationCode = (typeof DESTINATIONS)[number]["code"];

/* ───────────────────────── Service catalogue ─────────────────────────
 * These ten services are the complete, approved public catalogue.
 */

export type Service = {
  slug: string;
  hub: OriginHub;
  originName: string;
  destinationCode: DestinationCode;
  destinationName: string;
  name: string;
  shortName: string;
  accent: string;
  icon: "Plane" | "Globe2" | "Compass";
  summary: string;
  whoFor: string[];
  typicalDocuments: string[];
  considerations: string[];
  source: { name: string; url: string } | null;
  published: boolean;
};

export const SERVICES: Service[] = [
  {
    slug: "uk-schengen",
    hub: "uk",
    originName: "United Kingdom",
    destinationCode: "SCH",
    destinationName: "Schengen",
    name: "UK → Schengen Tourist Visa",
    shortName: "UK → Schengen",
    accent: "Short-stay tourist visa for the Schengen area",
    icon: "Plane",
    summary:
      "For residents of the UK travelling to the Schengen area for tourism. We identify the correct consulate to apply through, build the itinerary and financial evidence, and prepare you for the appointment.",
    whoFor: [
      "UK residents holding a visa-national passport",
      "Travellers visiting several Schengen countries on one trip",
      "Applicants who have previously been refused and need the file rebuilt"
    ],
    typicalDocuments: [
      "Passport and UK immigration status document",
      "Confirmed travel and accommodation itinerary",
      "Recent personal bank statements",
      "Employment, study or self-employment evidence",
      "Travel medical insurance meeting Schengen requirements"
    ],
    considerations: [
      "You must apply through the consulate of your main destination, or of first entry where the stay is evenly split.",
      "Appointment availability at Schengen visa centres varies significantly by season.",
      "Short-stay rules limit time in the area to 90 days in any 180-day period."
    ],
    source: OFFICIAL_SOURCES.SCHENGEN,
    published: true
  },
  {
    slug: "uk-australia",
    hub: "uk",
    originName: "United Kingdom",
    destinationCode: "AU",
    destinationName: "Australia",
    name: "UK → Australia Visitor Visa",
    shortName: "UK → Australia",
    accent: "Visitor visa for tourism and family visits",
    icon: "Plane",
    summary:
      "For UK-based travellers visiting Australia as tourists or to see family. We map the correct visitor stream for your circumstances and prepare a complete online lodgement.",
    whoFor: [
      "UK residents travelling to Australia for a holiday",
      "Applicants visiting family or friends in Australia",
      "Travellers with a complex travel or immigration history"
    ],
    typicalDocuments: [
      "Passport and UK immigration status document",
      "Evidence of funds for the trip",
      "Ties to the UK - employment, study or property",
      "Invitation or sponsorship details where visiting family",
      "Travel itinerary"
    ],
    considerations: [
      "Health and character requirements apply and may require additional examinations.",
      "The correct visitor stream depends on your passport and purpose of travel.",
      "Conditions such as 'no further stay' may be attached to a grant."
    ],
    source: OFFICIAL_SOURCES.AUSTRALIA,
    published: true
  },
  {
    slug: "uk-new-zealand",
    hub: "uk",
    originName: "United Kingdom",
    destinationCode: "NZ",
    destinationName: "New Zealand",
    name: "UK → New Zealand Visitor Visa",
    shortName: "UK → New Zealand",
    accent: "Visitor visa for tourism and family visits",
    icon: "Plane",
    summary:
      "For UK-based travellers visiting New Zealand for tourism or to see family. We confirm whether a visa or an electronic authority applies to you and prepare the submission accordingly.",
    whoFor: [
      "UK residents planning a holiday in New Zealand",
      "Applicants visiting family or friends",
      "Travellers combining New Zealand with Australia on one trip"
    ],
    typicalDocuments: [
      "Passport and UK immigration status document",
      "Evidence of funds or a sponsoring host",
      "Return or onward travel evidence",
      "Ties to the UK",
      "Travel itinerary"
    ],
    considerations: [
      "Some travellers need an electronic travel authority rather than a visa - this depends on nationality.",
      "Health and character requirements apply.",
      "A visitor visa does not permit work."
    ],
    source: OFFICIAL_SOURCES.NEW_ZEALAND,
    published: true
  },
  {
    slug: "uk-canada",
    hub: "uk",
    originName: "United Kingdom",
    destinationCode: "CA",
    destinationName: "Canada",
    name: "UK → Canada Visitor Visa",
    shortName: "UK → Canada",
    accent: "Temporary Resident Visa for tourism and family visits",
    icon: "Plane",
    summary:
      "For UK-based travellers visiting Canada as tourists or to see family. We confirm whether you need a visitor visa or an electronic travel authorisation, then prepare the file.",
    whoFor: [
      "UK residents travelling to Canada for a holiday",
      "Applicants visiting family or friends in Canada",
      "Applicants who have previously been refused entry or a visa"
    ],
    typicalDocuments: [
      "Passport and UK immigration status document",
      "Proof of funds for the visit",
      "Letter of invitation where applicable",
      "Employment or study evidence",
      "Travel itinerary"
    ],
    considerations: [
      "Whether you need a visitor visa or an electronic travel authorisation depends on your nationality and status.",
      "Biometrics are usually required at a visa application centre.",
      "Previous refusals must be disclosed and addressed directly in the file."
    ],
    source: OFFICIAL_SOURCES.CANADA,
    published: true
  },
  {
    slug: "uk-usa",
    hub: "uk",
    originName: "United Kingdom",
    destinationCode: "US",
    destinationName: "USA",
    name: "UK → USA Visitor Visa",
    shortName: "UK → USA",
    accent: "B-1/B-2 visitor visa and travel-authorisation guidance",
    icon: "Plane",
    summary:
      "For UK-based travellers visiting the United States for tourism or short business trips. We prepare your application and, critically, prepare you for the consular interview.",
    whoFor: [
      "UK residents who are not eligible for visa-free travel",
      "Applicants attending a consular interview for the first time",
      "Travellers with a prior refusal or a complex history"
    ],
    typicalDocuments: [
      "Passport and UK immigration status document",
      "Completed online application confirmation",
      "Evidence of ties to the UK",
      "Evidence of funds and trip purpose",
      "Prior US travel history"
    ],
    considerations: [
      "Most applicants must attend an in-person interview; wait times vary considerably by post.",
      "Eligibility for visa-free travel depends on nationality and travel history - we confirm this before you apply.",
      "The interview, not the paperwork, is usually the decisive stage."
    ],
    source: OFFICIAL_SOURCES.USA,
    published: true
  },
  {
    slug: "uk-turkey",
    hub: "uk",
    originName: "United Kingdom",
    destinationCode: "TR",
    destinationName: "Turkey",
    name: "UK → Turkey Tourist Visa",
    shortName: "UK → Turkey",
    accent: "e-Visa and sticker visa support",
    icon: "Plane",
    summary:
      "For UK-based travellers visiting Türkiye for tourism. We confirm whether you qualify for the e-Visa or need a consular sticker visa, and handle the application either way.",
    whoFor: [
      "UK residents holidaying in Türkiye",
      "Applicants whose nationality is not eligible for the e-Visa",
      "Travellers whose e-Visa application has been rejected"
    ],
    typicalDocuments: [
      "Passport and UK immigration status document",
      "Accommodation and return travel evidence",
      "Proof of funds",
      "Supporting documents for a consular application where the e-Visa is unavailable"
    ],
    considerations: [
      "e-Visa eligibility depends on nationality and on holding a supporting visa or residence permit in some cases.",
      "The e-Visa is issued electronically - there are many unofficial paid lookalike sites; only the government portal is authoritative.",
      "Passport validity requirements are strictly enforced at the border."
    ],
    source: OFFICIAL_SOURCES.TURKEY,
    published: true
  },
  {
    slug: "uk-worldwide",
    hub: "uk",
    originName: "United Kingdom",
    destinationCode: "WW",
    destinationName: "Worldwide",
    name: "UK → Worldwide Tourist Visas",
    shortName: "UK → Worldwide",
    accent: "Tourist visas for destinations outside our core routes",
    icon: "Globe2",
    summary:
      "For UK-based travellers heading somewhere we do not run a dedicated route. We research the current requirements for your destination against the official source, then build and submit the application.",
    whoFor: [
      "Travellers visiting destinations outside our core routes",
      "Multi-country trips crossing several visa regimes",
      "Applicants who want one team handling several visas for one trip"
    ],
    typicalDocuments: [
      "Passport and UK immigration status document",
      "Destination-specific forms and photographs",
      "Financial evidence",
      "Travel itinerary and accommodation"
    ],
    considerations: [
      "Requirements vary enormously by destination and change without much notice.",
      "We confirm the current rules against the destination's official source before you pay for anything.",
      "Some destinations issue visas on arrival for certain nationalities - we will tell you if you do not need us."
    ],
    source: null,
    published: true
  },
  {
    slug: "uk-extension",
    hub: "uk",
    originName: "United Kingdom",
    destinationCode: "GB",
    destinationName: "United Kingdom",
    name: "UK Visa Extensions",
    shortName: "UK Extensions",
    accent: "Profile-dependent extensions of existing UK permission",
    icon: "Compass",
    summary:
      "For people already in the UK who need to extend their current permission to stay. Whether an extension is possible depends entirely on your existing visa and circumstances - we assess that honestly before taking the case.",
    whoFor: [
      "Visitors who need to remain in the UK longer than originally planned",
      "People whose circumstances changed after arrival",
      "Applicants who want an eligibility view before committing to an application"
    ],
    typicalDocuments: [
      "Passport and current UK immigration status document",
      "Evidence of the reason for the extension",
      "Evidence of maintenance and accommodation",
      "Any supporting professional documentation, such as medical evidence"
    ],
    considerations: [
      "Not every visa category can be extended, and not every applicant qualifies. This service is strictly profile-dependent.",
      "Applications must normally be made before your current permission expires.",
      "We will decline the case rather than submit an application we do not believe is arguable."
    ],
    source: OFFICIAL_SOURCES.UK,
    published: true
  },
  {
    slug: "india-schengen",
    hub: "india",
    originName: "India",
    destinationCode: "SCH",
    destinationName: "Schengen",
    name: "India → Schengen Tourist Visa",
    shortName: "India → Schengen",
    accent: "Short-stay tourist visa for the Schengen area",
    icon: "Plane",
    summary:
      "For applicants in India travelling to the Schengen area for tourism. We identify the correct consulate, build the financial and itinerary evidence, and manage the visa-centre appointment process.",
    whoFor: [
      "Indian passport holders travelling to Europe for a holiday",
      "Families and groups travelling together",
      "Applicants with a previous Schengen refusal"
    ],
    typicalDocuments: [
      "Passport and previous passports",
      "Confirmed travel and accommodation itinerary",
      "Bank statements and income tax returns",
      "Employment or business evidence",
      "Travel medical insurance meeting Schengen requirements"
    ],
    considerations: [
      "You must apply through the consulate of your main destination, or of first entry where the stay is evenly split.",
      "Appointment slots in India are frequently the binding constraint - plan well ahead of travel.",
      "Short-stay rules limit time in the area to 90 days in any 180-day period."
    ],
    source: OFFICIAL_SOURCES.SCHENGEN,
    published: true
  },
  {
    slug: "india-uk",
    hub: "india",
    originName: "India",
    destinationCode: "GB",
    destinationName: "United Kingdom",
    name: "India → UK Visitor Visa",
    shortName: "India → UK",
    accent: "Standard Visitor visa for tourism and family visits",
    icon: "Plane",
    summary:
      "For applicants in India visiting the UK as tourists or to see family. We build the evidence of purpose, funding and ties that UK visitor applications turn on.",
    whoFor: [
      "Indian passport holders visiting the UK for a holiday",
      "Parents and relatives visiting family settled in the UK",
      "Applicants who have previously been refused a UK visitor visa"
    ],
    typicalDocuments: [
      "Passport and previous passports",
      "Evidence of funds, or of a UK-based sponsor's funds",
      "Employment, business or retirement evidence",
      "Invitation letter and sponsor's immigration status where applicable",
      "Travel itinerary and accommodation"
    ],
    considerations: [
      "Visitor applications turn on genuineness of intention - financial documents alone are rarely enough.",
      "Where a UK-based relative is sponsoring the visit, their evidence matters as much as the applicant's.",
      "Previous refusals must be disclosed and addressed head-on."
    ],
    source: OFFICIAL_SOURCES.UK,
    published: true
  }
];

/** Services grouped by origin hub - used by navigation and the homepage. */
export function servicesByHub(hub: OriginHub) {
  return SERVICES.filter((s) => s.hub === hub && s.published);
}

/** Services that touch a given destination - used by destination pages. */
export function servicesForDestination(code: string) {
  return SERVICES.filter(
    (s) => s.destinationCode.toLowerCase() === code.toLowerCase() && s.published
  );
}

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}

export function getDestination(code: string) {
  return DESTINATIONS.find((d) => d.code.toLowerCase() === code.toLowerCase());
}

/** Option list for public forms. Kept in sync with the service catalogue. */
export const SERVICE_OPTIONS = SERVICES.filter((s) => s.published).map((s) => ({
  value: s.slug,
  label: s.name
}));

/* ───────────────────────── Case pipeline ─────────────────────────
 * Application timeline for visitor / tourist visa cases.
 */

export const APPLICATION_STATUSES = [
  { slug: "consultation-completed", name: "Consultation Completed", order: 1 },
  { slug: "documents-requested", name: "Documents Requested", order: 2 },
  { slug: "documents-received", name: "Documents Received", order: 3 },
  { slug: "documents-verified", name: "Documents Verified", order: 4 },
  { slug: "application-prepared", name: "Application Prepared", order: 5 },
  { slug: "application-submitted", name: "Application Submitted", order: 6 },
  { slug: "biometrics", name: "Biometrics / VAC", order: 7 },
  { slug: "additional-info", name: "Additional Information Requested", order: 8 },
  { slug: "decision-pending", name: "Decision Pending", order: 9 },
  { slug: "decision-received", name: "Decision Received", order: 10 }
] as const;

export const LEAD_STAGES = [
  "New Lead",
  "Contacted",
  "Consultation Scheduled",
  "Consultation Completed",
  "Interested",
  "Documents Pending",
  "Converted",
  "Not Interested",
  "Lost"
] as const;

export const PIPELINE_STAGE_COLORS: Record<string, string> = {
  "New Lead": "bg-slate-500",
  Contacted: "bg-sky-500",
  "Consultation Scheduled": "bg-indigo-500",
  "Consultation Completed": "bg-violet-500",
  Interested: "bg-amber-500",
  "Documents Pending": "bg-orange-500",
  Converted: "bg-emerald-500",
  "Not Interested": "bg-zinc-500",
  Lost: "bg-rose-500"
};
