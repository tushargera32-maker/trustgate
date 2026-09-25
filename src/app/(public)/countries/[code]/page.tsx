import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  FileText,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plane,
  Globe2,
  Compass
} from "lucide-react";
import { CinematicHero } from "@/components/ui/cinematic-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RevealStagger, RevealItem } from "@/components/motion/reveal";
import {
  DESTINATIONS,
  getDestination,
  servicesForDestination,
  type Service
} from "@/lib/constants";
import {
  destinationImage,
  destinationAlt
} from "@/lib/destination-images";
import { siteConfig } from "@/lib/site-config";
import { jsonLd, breadcrumbsSchema, faqSchema } from "@/lib/seo";

const ICONS: Record<Service["icon"], React.ReactNode> = {
  Plane: <Plane className="h-4 w-4" />,
  Globe2: <Globe2 className="h-4 w-4" />,
  Compass: <Compass className="h-4 w-4" />
};

export async function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ code: d.code.toLowerCase() }));
}

export async function generateMetadata({
  params
}: {
  params: { code: string };
}) {
  const d = getDestination(params.code);
  if (!d) return {};
  const url = `${siteConfig.url.replace(/\/$/, "")}/countries/${d.code.toLowerCase()}`;
  const title = `${d.name} visitor & tourist visas`;
  const description = `Visitor and tourist visa support for ${d.name} - who it is for, what documents are typically required, and the official source to verify against.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" }
  };
}

const FAQ = [
  {
    q: "How long does a visitor visa application take?",
    a: "Processing times are published by each authority and change through the year. We share the current published time for your route before you commit, and we do not estimate beyond what the authority publishes."
  },
  {
    q: "What is actually being assessed?",
    a: "Short-stay applications generally turn on the genuineness of your stated purpose, whether the trip is funded, and whether you are likely to leave at the end of it. Documents matter because they evidence those three things."
  },
  {
    q: "Can my family apply together?",
    a: "Family members normally submit individual applications, though they are often linked and assessed together. We coordinate the timing so travel dates line up."
  },
  {
    q: "What if I have been refused before?",
    a: "Disclose it. A refusal is not fatal to a later application, but concealing one is. We read the refusal notice carefully and address the stated ground directly in the new file."
  }
];

export default function DestinationPage({
  params
}: {
  params: { code: string };
}) {
  const destination = getDestination(params.code);
  if (!destination) notFound();

  const services = servicesForDestination(destination.code);
  const base = siteConfig.url.replace(/\/$/, "");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbsSchema([
            { name: "Home", url: base },
            { name: "Destinations", url: `${base}/countries` },
            {
              name: destination.name,
              url: `${base}/countries/${destination.code.toLowerCase()}`
            }
          ]),
          faqSchema(FAQ.map((f) => ({ question: f.q, answer: f.a })))
        )}
      />

      <CinematicHero
        src={destinationImage(destination.code)}
        alt={destinationAlt(destination.code)}
        height="tall"
        eyebrow={`${destination.region} · Visitor & tourist visas`}
        title={
          <>
            <span aria-hidden="true" className="mr-3 align-middle text-4xl">
              {destination.flag}
            </span>
            {destination.name}
          </>
        }
        description={`${destination.stayNote}. Below is how we run ${destination.name} cases, and where to verify the rules for yourself.`}
        facts={[
          { k: "Applying from", v: services.map((x) => x.originName === "United Kingdom" ? "UK" : x.originName).join(" or ") || "UK or India" },
          { k: "Routes we run", v: `${services.length} service${services.length === 1 ? "" : "s"}` },
          { k: "Official source", v: "Linked below" }
        ]}
        actions={
          <>
            <Button asChild size="lg">
              <Link href="/eligibility">
                Check eligibility <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline-invert">
              <Link href="/contact">Book a consultation</Link>
            </Button>
          </>
        }
      />

      <nav aria-label="Breadcrumb" className="container-edge mt-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/countries" className="hover:text-foreground">
              Destinations
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground">{destination.name}</li>
        </ol>
      </nav>

      <section className="container-edge my-12 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl">Overview</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            We handle short-stay visitor and tourist visas for {destination.name}
            {" "}and nothing else. That narrowness is deliberate: the evidence a
            visitor application turns on is quite different from the evidence a
            long-stay application turns on, and mixing the two produces weak
            files.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Requirements change, and they change without much warning. Nothing on
            this page should be treated as the current rule - use the official
            source linked alongside it, and ask us if the two disagree.
          </p>

          <h2 className="mt-12 font-display text-2xl">
            Routes we cover
          </h2>
          {services.length > 0 ? (
            <RevealStagger className="mt-4 grid gap-4 sm:grid-cols-2">
              {services.map((s) => (
                <RevealItem key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="surface-elevated flex items-start gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-elevated"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gold-500/10 text-gold-700 ring-1 ring-gold-500/30">
                      {ICONS[s.icon]}
                    </span>
                    <div className="flex-1">
                      <div className="font-display text-base">
                        {s.name}
                      </div>
                      <div className="mt-0.5 text-sm text-muted-foreground">
                        {s.accent}
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </RevealItem>
              ))}
            </RevealStagger>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              We do not currently run a dedicated route to this destination.
              Speak to us about our worldwide tourist visa service.
            </p>
          )}

          <h2 className="mt-12 font-display text-2xl">
            Frequently asked
          </h2>
          <div className="mt-4 surface rounded-2xl">
            {FAQ.map((f, i) => (
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

        <aside className="space-y-5">
          <Card>
            <CardContent className="p-6">
              <Badge variant="outline" className="mb-3">
                Short stay
              </Badge>
              <div className="font-display text-lg leading-snug">
                {destination.stayNote}
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { Icon: Clock, label: "Published processing times shared upfront" },
                  { Icon: FileText, label: "Document preparation and review included" },
                  { Icon: CheckCircle2, label: "One named counsellor per case" }
                ].map((row, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <row.Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                    {row.label}
                  </div>
                ))}
              </div>

              <Button asChild className="mt-6 w-full" variant="gold">
                <Link href="/eligibility">Check my eligibility</Link>
              </Button>
            </CardContent>
          </Card>

          {destination.source && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-display text-sm uppercase tracking-wider">
                  Official source
                </h3>
                <a
                  href={destination.source.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gold-700 hover:underline"
                >
                  {destination.source.name}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <h3 className="font-display text-sm uppercase tracking-wider">
                Trust &amp; compliance
              </h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-muted-foreground">
                <li>
                  This page is general guidance, not advice on your case.
                  Outcomes are determined by the {destination.name} immigration
                  authority.
                </li>
                <li>
                  Government fees, document requirements and processing times
                  change. Verify against the official source before acting.
                </li>
                <li>
                  We advise on visitor and tourist visas only.
                </li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </section>
    </>
  );
}
