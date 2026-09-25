import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/ui/section";
import { ORIGIN_HUBS, servicesByHub, SERVICES } from "@/lib/constants";

export const metadata = {
  title: "Services",
  description:
    "Visitor and tourist visa services for applicants in the United Kingdom and India - Schengen, Australia, New Zealand, Canada, the USA, Turkey and worldwide, plus UK visa extensions."
};

/**
 * Every service card carries the same three-stage summary, so the cards are
 * genuinely comparable rather than each making its own claim. The icon set the
 * previous version used added nothing — three plane/globe/compass glyphs across
 * ten routes told the reader nothing, so it is gone.
 */
export default function ServicesPage() {
  const published = SERVICES.filter((s) => s.published);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Visitor and tourist visas.
            <br /> Nothing we cannot do properly.
          </>
        }
        description="We deliberately do one thing. Every service below is a short-stay visitor or tourist route from one of our two hubs — the United Kingdom and India."
        facts={[
          { k: "Routes", v: `${published.length} published` },
          { k: "Hubs", v: "United Kingdom · India" },
          { k: "Not offered", v: "PR, study, work, sponsorship" }
        ]}
      />

      {ORIGIN_HUBS.map((hub, hubIndex) => {
        const services = servicesByHub(hub.slug);
        if (services.length === 0) return null;

        return (
          <section
            key={hub.slug}
            className={`border-b border-border py-14 lg:py-16 ${
              hubIndex % 2 === 1 ? "bg-secondary" : ""
            }`}
          >
            <div className="container-edge">
              <p className="eyebrow">
<span aria-hidden="true">{hub.flag}</span>
                Applying from {hub.name}
              </p>

              <h2 className="mt-4 text-[1.6rem] leading-tight sm:text-3xl">
                {services.length} route{services.length === 1 ? "" : "s"} from{" "}
                {hub.short}
              </h2>
              <p className="mt-3 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
                {hub.blurb}
              </p>

              <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group flex flex-col bg-card p-6 transition-colors hover:bg-secondary"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent-ink">
                      {s.originName === "United Kingdom" ? "UK" : s.originName} →{" "}
                      {s.destinationName}
                    </span>

                    <h3 className="mt-3 text-lg leading-snug">{s.shortName}</h3>
                    <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                      {s.accent}
                    </p>

                    <ul className="mt-5 space-y-1.5 border-t border-border pt-4 text-[12.5px] text-muted-foreground">
                      <li>Eligibility and route confirmation</li>
                      <li>Document preparation and review</li>
                      <li>Submission, appointment and follow-up</li>
                    </ul>

                    <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-accent-ink">
                      Read the detail
                      <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="container-edge py-12">
        <p className="max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
          Trust Gate Overseas advises on visitor and tourist visas only. We do
          not offer permanent residency, skilled migration, study, work or
          family sponsorship services. Visa outcomes are decided solely by the
          relevant immigration authority — we do not guarantee approval.
        </p>
      </section>
    </>
  );
}
