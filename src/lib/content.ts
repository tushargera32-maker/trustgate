/**
 * Editorial demo content for the Blog, Immigration Updates and Success Stories
 * modules. In production these records come from their CMS tables - this file
 * exists so the public site is browsable before the database is populated.
 *
 * ⚠️ RULES FOR THIS FILE
 *  - Never assert that a government has changed a rule. Nothing here is a
 *    factual claim about current policy; entries are explanatory or are
 *    explicitly flagged as sample records.
 *  - Never invent an approval statistic, a client name presented as real, or
 *    a guarantee of any outcome.
 *  - Every update carries an official source and a last-verified date so the
 *    content team is forced to check before publishing.
 */

export const IS_DEMO_CONTENT = true;

export type UpdateRecord = {
  slug: string;
  title: string;
  summary: string;
  destination: string;
  service: string;
  publishedAt: string;
  lastVerifiedAt: string;
  source: { name: string; url: string };
  status: "PUBLISHED" | "DRAFT";
};

/**
 * Sample immigration-update records. These are explanatory pieces about how
 * visitor-visa processes work, not announcements of policy change.
 */
export const DEMO_UPDATES: UpdateRecord[] = [
  {
    slug: "schengen-90-180-rule-explained",
    title: "How the Schengen 90/180 short-stay rule is actually counted",
    summary:
      "The rule allows 90 days of stay in any rolling 180-day period. This piece explains how the window is calculated and why travellers miscount it.",
    destination: "Schengen",
    service: "Schengen Tourist Visa",
    publishedAt: "2026-08-12",
    lastVerifiedAt: "2026-08-12",
    source: {
      name: "European Commission - Visa policy",
      url: "https://home-affairs.ec.europa.eu/policies/schengen/visa-policy_en"
    },
    status: "PUBLISHED"
  },
  {
    slug: "uk-standard-visitor-supporting-documents",
    title: "What supporting documents a UK Standard Visitor application rests on",
    summary:
      "A walkthrough of the evidence categories UK visitor applications are assessed against, and how to organise them.",
    destination: "United Kingdom",
    service: "UK Visitor Visa",
    publishedAt: "2026-08-06",
    lastVerifiedAt: "2026-08-06",
    source: {
      name: "GOV.UK - Visit the UK as a Standard Visitor",
      url: "https://www.gov.uk/standard-visitor"
    },
    status: "PUBLISHED"
  },
  {
    slug: "australia-visitor-visa-streams",
    title: "Choosing the right Australian visitor stream for your trip",
    summary:
      "Australia's visitor visa has several streams. Applying under the wrong one is a common and avoidable cause of delay.",
    destination: "Australia",
    service: "Australia Visitor Visa",
    publishedAt: "2026-08-01",
    lastVerifiedAt: "2026-08-01",
    source: {
      name: "Australian Department of Home Affairs",
      url: "https://immi.homeaffairs.gov.au/"
    },
    status: "PUBLISHED"
  },
  {
    slug: "canada-visitor-visa-or-eta",
    title: "Visitor visa or electronic travel authorisation for Canada?",
    summary:
      "Which document you need depends on your nationality and status, not on the purpose of your trip. Here is how to check before applying.",
    destination: "Canada",
    service: "Canada Visitor Visa",
    publishedAt: "2026-07-28",
    lastVerifiedAt: "2026-07-28",
    source: {
      name: "Immigration, Refugees and Citizenship Canada",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship.html"
    },
    status: "PUBLISHED"
  },
  {
    slug: "turkey-evisa-official-portal",
    title: "Applying for a Türkiye e-Visa through the official portal only",
    summary:
      "Numerous unofficial sites resell the e-Visa at a markup. This note explains how to identify the government portal.",
    destination: "Turkey",
    service: "Turkey Tourist Visa",
    publishedAt: "2026-07-22",
    lastVerifiedAt: "2026-07-22",
    source: {
      name: "Republic of Türkiye - e-Visa",
      url: "https://www.evisa.gov.tr/"
    },
    status: "PUBLISHED"
  },
  {
    slug: "us-visitor-interview-preparation",
    title: "What a US visitor visa interview is actually assessing",
    summary:
      "The consular interview, not the paperwork, is usually decisive for B-1/B-2 applications. A short guide to preparing for it.",
    destination: "USA",
    service: "USA Visitor Visa",
    publishedAt: "2026-07-15",
    lastVerifiedAt: "2026-07-15",
    source: {
      name: "U.S. Department of State - Travel",
      url: "https://travel.state.gov/"
    },
    status: "DRAFT"
  }
];

export type PostRecord = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  status: "PUBLISHED" | "DRAFT";
  author: string;
};

export const DEMO_POSTS: PostRecord[] = [
  {
    slug: "schengen-tourist-visa-from-the-uk",
    title: "Applying for a Schengen tourist visa from the UK",
    excerpt:
      "Which consulate to apply through, what the itinerary needs to show, and the financial evidence that carries weight.",
    category: "Schengen",
    readingTime: "8 min",
    status: "PUBLISHED",
    author: "Content team"
  },
  {
    slug: "uk-visitor-visa-from-india",
    title: "The UK Standard Visitor visa from India, step by step",
    excerpt:
      "How genuineness of intention is assessed, and why a sponsor's evidence matters as much as the applicant's.",
    category: "United Kingdom",
    readingTime: "7 min",
    status: "PUBLISHED",
    author: "Content team"
  },
  {
    slug: "recovering-from-a-visitor-visa-refusal",
    title: "Recovering from a visitor visa refusal",
    excerpt:
      "Refusal notices are short but specific. Reading one properly is the whole of the work in a second application.",
    category: "Insights",
    readingTime: "6 min",
    status: "PUBLISHED",
    author: "Content team"
  },
  {
    slug: "proving-ties-to-your-home-country",
    title: "What 'ties to your home country' really means on a visitor application",
    excerpt:
      "The most misunderstood phrase in visitor visa guidance, and how to evidence it without padding the file.",
    category: "Insights",
    readingTime: "5 min",
    status: "PUBLISHED",
    author: "Content team"
  },
  {
    slug: "planning-a-multi-country-trip",
    title: "Planning a multi-country trip across several visa regimes",
    excerpt:
      "Sequencing applications, avoiding date conflicts, and deciding which visa to apply for first.",
    category: "Worldwide",
    readingTime: "6 min",
    status: "PUBLISHED",
    author: "Content team"
  },
  {
    slug: "travelling-with-children-on-a-visitor-visa",
    title: "Travelling with children on a visitor visa",
    excerpt:
      "Consent letters, birth certificates and the documents families are most often asked for at the border.",
    category: "Insights",
    readingTime: "5 min",
    status: "DRAFT",
    author: "Content team"
  }
];

export type StoryRecord = {
  initials: string;
  displayName: string;
  route: string;
  service: string;
  quote: string;
  rating: number;
  status: "PUBLISHED" | "DRAFT";
  featured: boolean;
};

/**
 * Placeholder testimonials. These are illustrative sample records, NOT real
 * client reviews. Replace entirely from the Reviews CMS before launch - every
 * published testimonial must be a real client statement given with consent.
 */
export const DEMO_STORIES: StoryRecord[] = [
  {
    initials: "SM",
    displayName: "Sample client",
    route: "UK → Schengen",
    service: "Schengen Tourist Visa",
    quote:
      "They told me which consulate to apply through before I booked anything, which saved the whole trip.",
    rating: 5,
    status: "PUBLISHED",
    featured: true
  },
  {
    initials: "SC",
    displayName: "Sample client",
    route: "India → UK",
    service: "UK Visitor Visa",
    quote:
      "My first application was refused. The second one addressed the refusal directly instead of ignoring it.",
    rating: 5,
    status: "PUBLISHED",
    featured: true
  },
  {
    initials: "SD",
    displayName: "Sample client",
    route: "UK → Australia",
    service: "Australia Visitor Visa",
    quote:
      "Straight answers about what was and was not likely. No promises, which is what I wanted.",
    rating: 5,
    status: "PUBLISHED",
    featured: true
  },
  {
    initials: "SE",
    displayName: "Sample client",
    route: "UK → USA",
    service: "USA Visitor Visa",
    quote:
      "The interview preparation was the part that mattered, and it was the part they spent the most time on.",
    rating: 5,
    status: "PUBLISHED",
    featured: false
  },
  {
    initials: "SF",
    displayName: "Sample client",
    route: "India → Schengen",
    service: "Schengen Tourist Visa",
    quote:
      "Appointment slots were the hard part. They planned the timeline around that from day one.",
    rating: 5,
    status: "PUBLISHED",
    featured: false
  },
  {
    initials: "SG",
    displayName: "Sample client",
    route: "UK → Canada",
    service: "Canada Visitor Visa",
    quote:
      "They checked whether I even needed a visa before taking me on as a client.",
    rating: 5,
    status: "DRAFT",
    featured: false
  }
];
