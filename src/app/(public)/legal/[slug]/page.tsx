import { PageHero } from "@/components/ui/section";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

/* ─────────────────────────────────────────────────────────────
   Legal content
   Each entry is a series of sections rendered as H2 + paragraphs.
   Keep the disclaimer note at the bottom of each page.
───────────────────────────────────────────────────────────── */

type Section = { heading: string; body: string[] };

const PAGES: Record<string, { title: string; updated: string; sections: Section[] }> = {
  privacy: {
    title: "Privacy policy",
    updated: "August 2026",
    sections: [
      {
        heading: "Who we are",
        body: [
          `${siteConfig.legal.companyName} ("Trust Gate Overseas", "we", "our", "us") is a private visitor and tourist visa consultancy. Our registered details and contact information are on our Contact page. We are the data controller for personal information collected through this website and in the course of providing our services.`
        ]
      },
      {
        heading: "What information we collect",
        body: [
          "We collect personal information you give us directly - including your name, email address, phone number, nationality, date of birth, passport details, travel history, financial information, and any other information you supply as part of an eligibility enquiry, application or case.",
          "We collect technical information automatically when you visit our website, such as your IP address, browser type, pages visited, and time of visit. We use this for site security and performance only.",
          "We may receive information from third parties, such as referral partners who introduce clients to us."
        ]
      },
      {
        heading: "How we use your information",
        body: [
          "We use your personal information to assess whether we can help with your visa application, to provide our consultancy services, and to communicate with you about your case.",
          "We may use your contact details to respond to enquiries you have submitted, and to send you updates relevant to your open case. We do not send marketing emails without your explicit consent.",
          "We use technical data to maintain and improve our website and to detect and prevent fraud or abuse.",
          "We may be required to process your information to comply with our legal obligations, including record-keeping requirements and cooperation with regulatory authorities."
        ]
      },
      {
        heading: "Our legal basis for processing",
        body: [
          "We process your personal data on the following bases under UK GDPR: contract performance (where processing is necessary to deliver the services you have engaged us for); legitimate interests (for website analytics and security, where our interests do not override your rights); legal obligation (where we are required by law to process your data); and consent (where you have explicitly agreed, for example to marketing communications)."
        ]
      },
      {
        heading: "Who we share your information with",
        body: [
          "We do not sell your personal data to any third party.",
          "We may share your information with visa application centres, consulates, embassies, and immigration authorities as strictly required to process your application. This is an essential part of the service.",
          "We may share data with trusted service providers who assist us in operating our business (such as cloud infrastructure, email delivery, and payment processors), under contracts that require them to protect your data.",
          "We may disclose your information if required to do so by law or by a regulatory authority with legitimate jurisdiction."
        ]
      },
      {
        heading: "International transfers",
        body: [
          "Because we serve applicants in the United Kingdom and India, your data may be processed and stored in either country. Both are covered by our data handling obligations. Where data is transferred outside the UK or to a country without an adequacy decision, we apply appropriate safeguards including standard contractual clauses."
        ]
      },
      {
        heading: "How long we keep your information",
        body: [
          "We retain case files for a minimum of six years after the conclusion of a case to meet legal and professional obligations. Contact enquiries that did not result in an engagement are deleted after 12 months. You may request earlier deletion where we have no legal obligation to retain the data."
        ]
      },
      {
        heading: "Your rights",
        body: [
          "Under UK GDPR and, where applicable, the Indian Digital Personal Data Protection Act 2023, you have the right to: access the personal data we hold about you; request correction of inaccurate data; request erasure (subject to our legal obligations to retain records); object to processing; request that we restrict processing; and withdraw consent at any time where consent is our basis for processing.",
          `To exercise any of these rights, email us at ${siteConfig.email}. We will respond within one month. You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) in the UK at ico.org.uk.`
        ]
      },
      {
        heading: "Cookies",
        body: [
          "This website uses cookies. See our Cookie Policy for full details."
        ]
      },
      {
        heading: "Changes to this policy",
        body: [
          "We may update this policy from time to time. Material changes will be communicated by a prominent notice on this website. Continued use of our services after a change constitutes acceptance of the updated policy."
        ]
      },
      {
        heading: "Contact",
        body: [
          `For any privacy-related queries, contact us at ${siteConfig.email}.`
        ]
      }
    ]
  },

  terms: {
    title: "Terms of service",
    updated: "August 2026",
    sections: [
      {
        heading: "About us and these terms",
        body: [
          `These terms govern your use of the Trust Gate Overseas website at ${siteConfig.url} and the consultancy services we provide. ${siteConfig.legal.companyName} is the contracting entity. By using this website or engaging our services, you agree to these terms.`
        ]
      },
      {
        heading: "Nature of our services",
        body: [
          "Trust Gate Overseas is a private visitor and tourist visa consultancy. We advise on, prepare, and submit visitor and tourist visa applications on behalf of clients. We operate from the United Kingdom and India.",
          "We do not offer immigration advice on permanent residency, skilled migration, student visas, work permits, family sponsorship, asylum, or any other visa category. If your enquiry falls outside visitor and tourist visas, we will tell you promptly and will not take the engagement.",
          "We are not a government body, an official visa processing authority, or an agent of any embassy or consulate. We have no influence over visa decisions, which are made solely by the relevant immigration authority.",
          "We do not guarantee visa approval, any particular processing time, or any outcome. Any firm that does guarantee a visa outcome should not be trusted."
        ]
      },
      {
        heading: "Engagement letter",
        body: [
          "A formal engagement letter setting out the specific scope of work, fees, and terms for your case is issued before any billable work begins. That letter forms the contract for the particular case and supplements these terms. In case of conflict, the engagement letter prevails."
        ]
      },
      {
        heading: "Your obligations",
        body: [
          "You must provide us with accurate, complete, and truthful information and documents. Withholding relevant information or providing false documents is a serious matter that may harm your application and potentially expose you to legal consequences - it is not something we will assist with.",
          "You are responsible for disclosing any previous visa refusals, immigration violations, criminal history, or other matters that may be relevant to your application. Omission of known material facts will terminate our engagement.",
          "You must review and approve all documents before we submit them on your behalf."
        ]
      },
      {
        heading: "Fees and payment",
        body: [
          "Our fees are set out in the engagement letter for your case. Government fees, visa application centre fees, biometric fees, and any third-party disbursements are charged to you at cost and are separate from our professional fees.",
          "Payment terms are specified in the engagement letter. We reserve the right to suspend work on a case where payment is overdue.",
          "Our fee covers the work described in the engagement letter. Additional work outside that scope will be quoted separately and agreed in writing before proceeding."
        ]
      },
      {
        heading: "Limitation of liability",
        body: [
          "Our liability to you is limited to the professional fees you paid us for the specific case in which the alleged fault arose. We are not liable for any visa refusal, travel disruption, consequential losses, or loss of opportunity arising from a visa decision or processing delay, regardless of its cause.",
          "Nothing in these terms limits our liability for fraud, personal injury caused by negligence, or any other liability that cannot be excluded by law."
        ]
      },
      {
        heading: "Confidentiality",
        body: [
          "We treat all information you share with us as confidential and use it solely for the purpose of providing our services. We will not disclose your information to third parties except as described in our Privacy Policy or as required by law."
        ]
      },
      {
        heading: "Intellectual property",
        body: [
          "All content on this website - including text, structure, and design - is the property of Trust Gate Overseas or its licensors. You may not reproduce it without written permission."
        ]
      },
      {
        heading: "Governing law",
        body: [
          "These terms are governed by the laws of England and Wales. Any disputes arising from them are subject to the exclusive jurisdiction of the courts of England and Wales."
        ]
      },
      {
        heading: "Changes to these terms",
        body: [
          "We may update these terms periodically. The current version is always published at this URL with the last-updated date. Continued engagement with our services after a material change constitutes acceptance."
        ]
      }
    ]
  },

  refund: {
    title: "Refund policy",
    updated: "August 2026",
    sections: [
      {
        heading: "Professional fees",
        body: [
          "Our refund terms for each case are set out in the engagement letter signed before work begins. As a general principle:",
          "Where you cancel an engagement before we have commenced any substantive work, we will refund fees paid less any reasonable administrative cost.",
          "Where work has begun, fees are refundable only in proportion to the work not yet performed. Completed stages are non-refundable.",
          "We do not refund professional fees on the basis of a visa refusal. A refusal is a decision of the immigration authority, not a failure of our service. We prepare the strongest possible case with the information available - we cannot guarantee the outcome."
        ]
      },
      {
        heading: "Government and third-party fees",
        body: [
          "Fees paid to governments, consulates, visa application centres, biometric collection services, or any other third party on your behalf are non-refundable once paid. We have no control over third-party refund policies and cannot recover those amounts from you if the third party does not refund them.",
          "If we have collected third-party fees from you but not yet paid them on your behalf when the engagement is cancelled, those amounts will be returned to you in full."
        ]
      },
      {
        heading: "Statutory cooling-off rights",
        body: [
          "Where UK consumer protection law grants you a statutory right to cancel a services contract within a cooling-off period (typically 14 days for contracts concluded off-premises or at a distance), you have that right unless you have explicitly requested that we begin work before the period expires, in which case you remain liable for the proportion of work already performed."
        ]
      },
      {
        heading: "How to request a refund",
        body: [
          `To request a refund, email us at ${siteConfig.email} with your reference number and the reason for your request. We will acknowledge within two business days and respond with a decision within ten business days.`
        ]
      },
      {
        heading: "Disputes",
        body: [
          "If you disagree with a refund decision, please raise a formal complaint in writing. We will respond within 28 days. Our engagement letters set out the full dispute resolution process."
        ]
      }
    ]
  },

  cookies: {
    title: "Cookie policy",
    updated: "August 2026",
    sections: [
      {
        heading: "What cookies are",
        body: [
          "Cookies are small text files stored on your device when you visit a website. They allow the site to remember information about your visit - such as your language preference or login state."
        ]
      },
      {
        heading: "Cookies we use",
        body: [
          "Strictly necessary cookies: We use a session cookie to maintain your authenticated state when you are signed into the client portal. This cookie is essential to the portal's operation and cannot be disabled without breaking functionality.",
          "Analytics cookies: We use analytics cookies to understand how visitors use this website - which pages are visited most, how long is spent on each page, and where visitors come from. This helps us improve the site. Analytics data is aggregated and not linked to individual identities. You can disable analytics cookies.",
          "Preference cookies: We store your dark/light mode preference in local storage so it persists across sessions. This is not a cookie under the strict definition and is not transmitted to our server."
        ]
      },
      {
        heading: "Third-party cookies",
        body: [
          "Where analytics are enabled, a third-party analytics provider may set cookies on your device. These providers operate under their own privacy policies. We use analytics providers that offer IP anonymisation and do not use analytics data for advertising."
        ]
      },
      {
        heading: "Managing cookies",
        body: [
          "You can control and delete cookies through your browser settings. Note that disabling strictly necessary cookies will impair or break the client portal.",
          "Most browsers allow you to: view and delete cookies currently stored; block cookies from specific sites; block all third-party cookies; block all cookies; and receive a notification when a cookie is set."
        ]
      },
      {
        heading: "Changes to this policy",
        body: [
          "We may update this cookie policy as our use of cookies changes or in response to regulatory requirements. The current version is always at this URL."
        ]
      }
    ]
  },

  disclaimer: {
    title: "Disclaimer",
    updated: "August 2026",
    sections: [
      {
        heading: "What Trust Gate Overseas is",
        body: [
          "Trust Gate Overseas is a private visitor and tourist visa consultancy. We are not a government body, an embassy, a consulate, a visa processing authority, or an official representative of any government.",
          "We are not affiliated with, sponsored by, or authorised by any immigration authority or government department. Any resemblance between our branding and any government source is coincidental."
        ]
      },
      {
        heading: "Scope of our services",
        body: [
          "We advise on visitor and tourist visas only, specifically for applicants based in the United Kingdom and India. We do not offer advice or services on permanent residency, skilled migration, student visas, work permits, family sponsorship, asylum, or any other immigration category.",
          "Nothing on this website constitutes immigration advice on your specific circumstances unless delivered through a formal engagement with a named counsellor."
        ]
      },
      {
        heading: "No guarantee of outcomes",
        body: [
          "We do not guarantee visa approval, any particular processing time, or any specific outcome for any application. Visa decisions are made solely by the relevant immigration authority and are entirely outside our control.",
          "Published processing time estimates, where included, are sourced from official government publications at the time of writing. They are indicative only and do not constitute a commitment."
        ]
      },
      {
        heading: "Accuracy of information",
        body: [
          "Immigration rules change frequently and without notice. We take care to ensure that information on this site is accurate at the time of publication and link to official government sources where possible. We record a lastVerifiedAt date on immigration updates.",
          "You should always verify current requirements with the relevant official government source before making any decision. We accept no liability for decisions made in reliance on information on this site that has subsequently changed."
        ]
      },
      {
        heading: "External links",
        body: [
          "This website contains links to official government and intergovernmental sources. We are not responsible for the content of external sites. Government sites change their structure frequently - if a link is broken, navigate to the official homepage of the relevant authority."
        ]
      },
      {
        heading: "Regulatory status",
        body: [
          siteConfig.legal.disclaimer
        ]
      }
    ]
  }
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = PAGES[params.slug];
  if (!p) return {};
  return {
    title: `${p.title} - ${siteConfig.name}`,
    description: `${siteConfig.name} ${p.title.toLowerCase()}. Last updated ${p.updated}.`
  };
}

export default function LegalPage({ params }: { params: { slug: string } }) {
  const p = PAGES[params.slug];
  if (!p) notFound();
  return (
    <>
      <PageHero eyebrow="Legal" title={p.title} />
      <section className="container-edge my-16 max-w-3xl">
        <p className="mb-10 text-sm text-muted-foreground">
          Last updated: {p.updated}.
        </p>
        <div className="space-y-10">
          {p.sections.map((s) => (
            <div key={s.heading}>
              <h2 className="font-display text-xl">{s.heading}</h2>
              <div className="mt-3 space-y-3">
                {s.body.map((para, i) => (
                  <p key={i} className="text-base leading-relaxed text-muted-foreground">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-12 rounded-lg border border-border/60 bg-secondary/30 p-4 text-xs leading-relaxed text-muted-foreground">
          This document is provided for general information. It does not
          constitute legal advice. For advice on your specific situation,
          consult a qualified adviser. Contact us at{" "}
          <a href={`mailto:${siteConfig.email}`} className="underline">
            {siteConfig.email}
          </a>{" "}
          with any questions about these policies.
        </p>
      </section>
    </>
  );
}
