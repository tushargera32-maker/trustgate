import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  CheckCircle2,
  FileText,
  ListChecks,
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import { CinematicHero } from "@/components/ui/cinematic-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SERVICES, getService, APPLICATION_STATUSES } from "@/lib/constants";
import {
  destinationImage,
  destinationAlt
} from "@/lib/destination-images";
import { siteConfig } from "@/lib/site-config";
import { jsonLd, breadcrumbsSchema } from "@/lib/seo";

export function generateStaticParams() {
  return SERVICES.filter((s) => s.published).map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const service = getService(params.slug);
  if (!service) return {};
  const url = `${siteConfig.url.replace(/\/$/, "")}/services/${service.slug}`;
  return {
    title: service.name,
    description: service.summary,
    alternates: { canonical: url },
    openGraph: {
      title: service.name,
      description: service.summary,
      url,
      type: "article"
    }
  };
}

export default function ServiceDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const service = getService(params.slug);
  if (!service || !service.published) notFound();

  const base = siteConfig.url.replace(/\/$/, "");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbsSchema([
            { name: "Home", url: base },
            { name: "Services", url: `${base}/services` },
            { name: service.name, url: `${base}/services/${service.slug}` }
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.name,
            serviceType: "Visitor visa consultancy",
            description: service.summary,
            areaServed: service.originName,
            provider: { "@type": "Organization", name: siteConfig.name }
          }
        )}
      />

      <CinematicHero
        // The route's destination supplies the imagery, so a service page and
        // its country page share a visual identity rather than competing.
        src={destinationImage(service.destinationCode)}
        alt={destinationAlt(service.destinationCode)}
        eyebrow={`${service.originName === "United Kingdom" ? "UK" : service.originName} → ${service.destinationName}`}
        title={service.name}
        description={service.summary}
        facts={[
          { k: "Applying from", v: service.originName },
          { k: "Destination", v: service.destinationName },
          { k: "Visa class", v: "Short stay · visitor" }
        ]}
        actions={
          <>
            <Button asChild size="lg">
              <Link href="/eligibility">
                Check eligibility <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline-invert">
              <Link href="/apply">Start an application</Link>
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
            <Link href="/services" className="hover:text-foreground">
              Services
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground">{service.name}</li>
        </ol>
      </nav>

      <section className="container-edge my-12 grid gap-10 lg:grid-cols-3">
        <article className="lg:col-span-2">
          <Block icon={<ListChecks className="h-4 w-4" />} title="Who this is for">
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              {service.whoFor.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  {item}
                </li>
              ))}
            </ul>
          </Block>

          <Block
            icon={<FileText className="h-4 w-4" />}
            title="Documents typically required"
            className="mt-10"
          >
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              {service.typicalDocuments.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-600" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              This is an indicative list, not a checklist. Your personalised
              checklist is generated when your case is opened, and is based on
              your nationality, status and travel purpose.
            </p>
          </Block>

          <Block
            icon={<AlertTriangle className="h-4 w-4" />}
            title="Important considerations"
            className="mt-10"
          >
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              {service.considerations.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
                  {item}
                </li>
              ))}
            </ul>
          </Block>

          <Block
            icon={<CheckCircle2 className="h-4 w-4" />}
            title="How your case runs"
            className="mt-10"
          >
            <ol className="grid gap-2 sm:grid-cols-2">
              {APPLICATION_STATUSES.map((s) => (
                <li
                  key={s.slug}
                  className="flex items-center gap-3 rounded-lg border border-border/50 px-3.5 py-2.5 text-sm"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold">
                    {s.order}
                  </span>
                  <span className="text-muted-foreground">{s.name}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Not every stage applies to every route. Biometrics, for example,
              are required for some destinations and not others.
            </p>
          </Block>
        </article>

        <aside className="space-y-5">
          <Card>
            <CardContent className="p-6">
              <Badge variant="outline" className="mb-3">
                Route
              </Badge>
              <div className="font-display text-xl">
                {service.originName} → {service.destinationName}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {service.accent}
              </p>
              <Button asChild className="mt-6 w-full" variant="gold">
                <Link href="/eligibility">Start eligibility check</Link>
              </Button>
              <Button asChild className="mt-2 w-full" variant="outline">
                <Link href="/contact">Talk to a counsellor</Link>
              </Button>
            </CardContent>
          </Card>

          {service.source && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-display text-sm uppercase tracking-wider">
                  Official source
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Always confirm current requirements against the authority
                  itself before acting on any guidance here.
                </p>
                <a
                  href={service.source.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gold-700 hover:underline"
                >
                  {service.source.name}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <h3 className="font-display text-sm uppercase tracking-wider">
                What we do not do
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                We advise on visitor and tourist visas only. We do not handle
                permanent residency, skilled migration, study, work or family
                sponsorship. We never guarantee an outcome - the decision rests
                entirely with the immigration authority.
              </p>
            </CardContent>
          </Card>
        </aside>
      </section>
    </>
  );
}

function Block({
  icon,
  title,
  children,
  className
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="flex items-center gap-2 font-display text-xl">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gold-500/10 text-gold-700">
          {icon}
        </span>
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
