import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { DestinationTile } from "@/components/destinations/destination-tile";
import { Section } from "@/components/ui/section";
import { RevealStagger, RevealItem } from "@/components/motion/reveal";
import {
  DESTINATIONS,
  SERVICES,
  ORIGIN_HUBS
} from "@/lib/constants";
import {
  DEMO_UPDATES,
  DEMO_POSTS,
  DEMO_STORIES,
  IS_DEMO_CONTENT
} from "@/lib/content";

/* ─────────────────────────── trust band ───────────────────────────── */

/**
 * Facts rather than adjectives. Every line here is something a reader could
 * check, which is the whole point in a market full of unverifiable claims.
 */
const FACTS = [
  { k: "Registered in", v: "UK & India" },
  { k: "Consultation", v: "Senior counsellor" },
  { k: "Case updates", v: "Live in portal" },
  { k: "Official sources", v: "Linked on every page" }
];

export function TrustBand() {
  return (
    <div className="band-vellum">
      <div className="container-edge grid grid-cols-2 gap-x-6 gap-y-5 py-6 lg:grid-cols-4">
        {FACTS.map((f) => (
          <div key={f.k}>
            <p className="label-data">{f.k}</p>
            <p className="mt-1 text-sm font-medium">{f.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── destinations ─────────────────────────── */

/**
 * The reference design showed these as a stock-photo grid, which carried no
 * information — every card was interchangeable. Here each card leads with the
 * stay rule, because that is the fact a traveller is actually shopping on.
 */
export function Destinations() {
  const featured = DESTINATIONS.slice(0, 2);
  const rest = DESTINATIONS.slice(2);

  return (
    <Section
      eyebrow="Destinations"
      title="Where are you going?"
      lede="Visitor and tourist visa support for the routes we work on most. Every destination page links the official government source for that country."
      action={
        <Link
          href="/countries"
          className="link-sweep text-[13px] font-medium text-accent-ink"
        >
          All destinations
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      }
    >
      {/* Two lead tiles carry the weight, the rest run smaller beneath —
          an editorial hierarchy rather than eight identical squares. */}
      <RevealStagger className="grid gap-3 sm:grid-cols-2">
        {featured.map((d, i) => (
          <RevealItem key={d.code}>
            <DestinationTile destination={d} size="tall" priority={i === 0} />
          </RevealItem>
        ))}
      </RevealStagger>

      <RevealStagger className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((d) => (
          <RevealItem key={d.code}>
            <DestinationTile destination={d} />
          </RevealItem>
        ))}
      </RevealStagger>
    </Section>
  );
}

/* ─────────────────────────── services ─────────────────────────────── */

export function VisaServices() {
  const published = SERVICES.filter((s) => s.published);

  return (
    <Section
      eyebrow="Services"
      title="Ten routes, and nothing else"
      lede="We deliberately do one thing: short-stay visitor and tourist visas, from two hubs."
      action={
        <Link
          href="/services"
          className="link-sweep text-[13px] font-medium text-accent-ink"
        >
          All services
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      }
    >
      {/* A ruled list rather than ten cards. The route pair is the heading,
          because that is how people describe what they need: "UK to Schengen". */}
      <div className="space-y-10">
        {ORIGIN_HUBS.map((hub) => {
          const forHub = published.filter((s) => s.hub === hub.slug);
          if (forHub.length === 0) return null;

          return (
            <div key={hub.slug}>
              <p className="label-data flex items-center gap-2">
                <span aria-hidden="true">{hub.flag}</span>
                Applying from {hub.name}
              </p>

              <RevealStagger as="ul" gap={0.05} className="mt-4 border-t border-border">
                {forHub.map((s) => (
                  <RevealItem as="li" key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="group row-hover flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-border py-4"
                    >
                      <span className="min-w-[13rem] font-display text-xl font-light leading-snug">
                        {s.shortName}
                      </span>
                      <span className="flex-1 text-[13.5px] leading-relaxed text-muted-foreground">
                        {s.accent}
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-accent-ink opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </RevealItem>
                ))}
              </RevealStagger>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ─────────────────────────── process ──────────────────────────────── */

/**
 * Numbered, because this genuinely is a sequence — the order carries
 * information the reader needs. The same five stages drive the portal
 * progress bar, so the promise here and the product match.
 */
const STAGES = [
  {
    label: "Consultation",
    body: "A senior counsellor reviews your travel plan and tells you honestly whether to apply now or wait."
  },
  {
    label: "Documents",
    body: "You get a checklist built for your route, not a generic one. We check each file as it arrives."
  },
  {
    label: "Preparation",
    body: "We assemble the application, write the cover letter, and prepare you for the appointment."
  },
  {
    label: "Submission",
    body: "Filed through the correct consulate or centre, with the reference logged to your portal."
  },
  {
    label: "Decision",
    body: "If it is refused, we read the refusal notice with you and set out what a second application would need."
  }
];

export function Process() {
  return (
    <Section
      eyebrow="How it works"
      title="Five stages, and you can see all of them"
      lede="The same stages you see in your portal. Nothing happens off-screen."
    >
      <RevealStagger as="ol" className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-5">
        {STAGES.map((stage, i) => (
          <RevealItem as="li" key={stage.label} className="bg-card p-5">
            <span className="font-mono text-[10px] tracking-[0.13em] text-accent-ink">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-lg">{stage.label}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              {stage.body}
            </p>
          </RevealItem>
        ))}
      </RevealStagger>
    </Section>
  );
}

/* ─────────────────────────── eligibility ──────────────────────────── */

export function EligibilityCta() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-ink-900 py-16 text-white lg:py-20">
      <div
        aria-hidden="true"
        className="dot-field pointer-events-none absolute inset-0 opacity-[0.12]"
      />
      <div className="container-edge relative grid items-center gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold-300">
            Two minutes, no account needed
          </p>
          <h2 className="mt-4 text-balance text-[1.75rem] leading-tight sm:text-4xl">
            Not sure which service you need?
          </h2>
          <p className="mt-3 max-w-xl text-pretty leading-relaxed text-ink-200">
            Answer seven questions about your trip and we will tell you which
            route fits, what it typically requires, and whether it is worth
            applying yet.
          </p>
        </div>
        <div className="lg:col-span-4 lg:justify-self-end">
          <Button size="lg" asChild>
            <Link href="/eligibility">
              Check eligibility
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="mt-3 max-w-xs text-[11px] leading-relaxed text-ink-400">
            The result is guidance, not a visa approval. Every decision rests
            with the embassy or consulate.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── stories ──────────────────────────────── */

export function SuccessStories() {
  const stories = DEMO_STORIES.filter((s) => s.status === "PUBLISHED").slice(
    0,
    3
  );
  return (
    <Section
      eyebrow="Success stories"
      title={
        IS_DEMO_CONTENT
          ? "Success stories"
          : "Real applications, real results"
      }
      lede={
        IS_DEMO_CONTENT
          ? "Layout placeholders — not real clients. Replace from the Reviews CMS before launch."
          : "Published with client permission. Names are shortened and identifying details removed."
      }
      action={
        <Link
          href="/success-stories"
          className="link-sweep text-[13px] font-medium text-accent-ink"
        >
          All stories
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {stories.map((s, i) => (
          <figure
            key={i}
            className="surface flex flex-col p-5"
          >
            {IS_DEMO_CONTENT ? (
              <StatusPill tone="idle" label="Placeholder" />
            ) : (
              <StatusPill tone="verified" label="Approved" />
            )}
            <blockquote className="mt-4 text-pretty text-[15px] leading-relaxed">
              {s.quote}
            </blockquote>
            <figcaption className="mt-5 border-t border-border pt-4">
              <p className="text-sm font-medium">{s.displayName}</p>
              <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                {s.route} · {s.service}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
      {IS_DEMO_CONTENT && (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          The entries above are placeholder records used to build this layout.
          They are not real client reviews. Trust Gate Overseas does not
          fabricate testimonials — every published statement is a real
          client&rsquo;s words, shared with their consent.
        </p>
      )}
    </Section>
  );
}

/* ─────────────────────────── updates ──────────────────────────────── */

/**
 * Every update carries its official source and the date it was last checked.
 * That verification date is the reason to trust the page, so it renders in
 * mono at the same weight as the headline metadata rather than in fine print.
 */
export function UpdatesPreview() {
  const updates = DEMO_UPDATES.filter((u) => u.status === "PUBLISHED").slice(
    0,
    3
  );
  return (
    <Section
      eyebrow="Visa & immigration updates"
      title="What changed, and when we checked it"
      lede={
        IS_DEMO_CONTENT
          ? "Placeholder entries. Verification dates below are not real checks — replace from the Immigration Updates CMS before launch."
          : "Each update links the official government source and shows the date we last verified it."
      }
      action={
        <Link
          href="/immigration-updates"
          className="link-sweep text-[13px] font-medium text-accent-ink"
        >
          All updates
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      }
    >
      <div className="surface divide-y divide-border overflow-hidden">
        {updates.map((u) => (
          <article key={u.slug} className="p-5 transition-colors hover:bg-secondary">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent-ink">
                {u.destination}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {IS_DEMO_CONTENT
                  ? "Placeholder entry"
                  : `Verified ${u.lastVerifiedAt}`}
              </span>
            </div>
            {/* No /immigration-updates/[slug] route exists, so this was a
                404 on every headline. Plain heading until the detail route
                is built — same call the index page already made. */}
            <h3 className="mt-2 text-lg leading-snug">{u.title}</h3>
            <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
              {u.summary}
            </p>
            {u.source && (
              <a
                href={u.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground hover:text-accent-ink"
              >
                Source: {u.source.name}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────────────────── blog ─────────────────────────────────── */

export function BlogPreview() {
  const posts = DEMO_POSTS.filter((p) => p.status === "PUBLISHED").slice(0, 3);
  return (
    <Section
      eyebrow="The Trust Gate journal"
      title="Practical visa guidance, without the jargon"
      action={
        <Link
          href="/blog"
          className="link-sweep text-[13px] font-medium text-accent-ink"
        >
          All articles
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      }
    >
      {/* Post detail pages are not built yet: there is no /blog/[slug] route,
          so each of these cards was a 404 while the lift-on-hover and the
          corner arrow both promised otherwise. Plain articles until the
          detail route exists — restore the Link and the arrow together. */}
      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((p) => (
          <article key={p.slug} className="surface flex flex-col p-5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent-ink">
                {p.category}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {p.readingTime}
              </span>
            </div>
            <h3 className="mt-3 text-[17px] leading-snug">{p.title}</h3>
            <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
              {p.excerpt}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────────────────── closing cta ──────────────────────────── */

export function ConsultationCta() {
  return (
    <Section
      eyebrow="Talk to us"
      title="Book a consultation"
      lede="A senior counsellor, not a sales call. If your application is not worth filing yet, we will say so."
    >
      <div className="flex flex-wrap items-center gap-3">
        <Button size="lg" asChild>
          <Link href="/contact">
            Book a consultation
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/faq">Read the FAQ first</Link>
        </Button>
      </div>
    </Section>
  );
}
