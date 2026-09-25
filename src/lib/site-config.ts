/**
 * Centralised site configuration. Edit these values to rebrand.
 * Everything visible on the public site reads from here.
 */
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Trust Gate Overseas",
  shortName: "Trust Gate",
  tagline: "Specialist Visitor & Tourist Visa Consultancy",
  description:
    "Trust Gate Overseas is a specialist visitor and tourist visa consultancy serving clients in the United Kingdom and India. We handle short-stay visa applications for Schengen, Australia, New Zealand, Canada, USA, UK visa extensions, and worldwide tourist destinations.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@trustgate.example",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+44 0000 000000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "+440000000000",
  address:
    process.env.NEXT_PUBLIC_OFFICE_ADDRESS ??
    "United Kingdom · India",
  hours: {
    weekdays: "Mon – Sat · 09:00 – 18:00 IST/GMT",
    saturday: "Appointment basis only",
    sunday: "Closed"
  },
  founded: 2009,
  social: {
    linkedin: "https://linkedin.com/company/trust-gate",
    instagram: "https://instagram.com/trustgate",
    facebook: "https://facebook.com/trustgate",
    youtube: "https://youtube.com/@trustgate"
  },
  legal: {
    companyName: "Trust Gate Overseas Ltd.",
    /**
     * ⚠️ Replace with the firm's real regulatory registration before launch.
     * Providing UK immigration advice is a regulated activity - do not publish
     * a regulator's name or a registration number that cannot be evidenced.
     */
    registration: "UK & India Registered",
    disclaimer:
      "Trust Gate Overseas is a private visitor and tourist visa consultancy. We are not affiliated with any government immigration authority and we do not offer permanent residency, study visas, work permits, or family sponsorship services. Visa application outcomes are determined solely by the relevant immigration authority based on their assessment of your case. Information on this website is general guidance only, verified against official government sources at the time of publication. Past success does not guarantee future outcomes."
  }
} as const;

export type SiteConfig = typeof siteConfig;
