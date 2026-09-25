import Link from "next/link";
import { PageHero } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { jsonLd, faqSchema } from "@/lib/seo";

export const metadata = {
  title: "FAQ",
  description:
    "Common questions about visitor and tourist visa applications and how Trust Gate Overseas works."
};

const GROUPS = [
  {
    title: "Scope of what we do",
    items: [
      {
        q: "What visas do you actually handle?",
        a: "Visitor and tourist visas only, from two hubs. From the UK: Schengen, Australia, New Zealand, Canada, the USA, Turkey and worldwide tourist destinations, plus UK visa extensions where the profile supports one. From India: Schengen tourist visas and UK Standard Visitor visas."
      },
      {
        q: "Do you handle PR, study, work or family visas?",
        a: "No. We do not offer permanent residency, Express Entry, provincial nomination, skilled migration, student visas, work permits, family sponsorship or investor routes. If that is what you need, we will tell you plainly rather than take the enquiry."
      },
      {
        q: "Can you extend my UK visa?",
        a: "Sometimes. Whether an extension is possible depends entirely on your current permission and your circumstances, so this service is strictly profile-dependent. We assess it honestly first and will decline the case rather than submit an application we do not think is arguable."
      }
    ]
  },
  {
    title: "Process",
    items: [
      {
        q: "How long does a visitor visa application take?",
        a: "It depends on the destination and the time of year. Each authority publishes its own current processing times, and we show you the published figure for your route rather than an estimate of our own. Appointment availability at visa centres is often the real constraint, not processing time."
      },
      {
        q: "Do you guarantee visa approval?",
        a: "No, and nobody honestly can. The decision belongs entirely to the immigration authority. What we control is the accuracy of the advice and the completeness of what the decision-maker sees."
      },
      {
        q: "What if I have been refused before?",
        a: "Disclose it - concealing a refusal is far more damaging than the refusal itself. We read the refusal notice properly, identify the ground actually relied on, and address it directly in the new application. Most repeat refusals are the first refusal, ignored."
      },
      {
        q: "What happens after I submit the enquiry form?",
        a: "A counsellor reviews it and comes back within one business day with an initial view of which visa applies to you and whether we think the application is worth making."
      }
    ]
  },
  {
    title: "About Trust Gate",
    items: [
      {
        q: "Are you affiliated with any government?",
        a: "No. Trust Gate Overseas is a private consultancy. We are not a government body, we do not represent one, and we cannot influence a decision."
      },
      {
        q: "Where are you located?",
        a: "Trust Gate Overseas operates from the United Kingdom and India. We serve clients in both jurisdictions. Our office locations and contact details are available on our Contact page."
      },
      {
        q: "Why do you not publish approval rates?",
        a: "Because an unaudited approval rate is not evidence of anything. Any firm quoting one should be able to tell you the denominator, the period and who verified it."
      }
    ]
  }
];

export default function FaqPage() {
  const flat = GROUPS.flatMap((g) =>
    g.items.map((i) => ({ question: i.q, answer: i.a }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(faqSchema(flat))}
      />
      <PageHero
        eyebrow="FAQ"
        title="Honest answers to honest questions."
        description="The questions we hear most - answered plainly, without the marketing fluff."
      />
      <section className="container-edge my-16 space-y-12">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <h2 className="font-display text-xl">{g.title}</h2>
            <div className="mt-4 surface rounded-2xl">
              {g.items.map((f, i) => (
                <details
                  key={i}
                  className="group border-b border-border/40 last:border-0 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-medium">
                    {f.q}
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/60 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        ))}
        <div className="text-center">
          <Button asChild variant="gold">
            <Link href="/eligibility">Check eligibility</Link>
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Still unsure? {siteConfig.name} answers enquiries within one business
            day.
          </p>
        </div>
      </section>
    </>
  );
}
