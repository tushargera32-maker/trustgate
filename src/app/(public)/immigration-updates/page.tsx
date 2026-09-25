import { ExternalLink } from "lucide-react";
import { PageHero } from "@/components/ui/section";
import { DEMO_UPDATES } from "@/lib/content";

export const metadata = {
  title: "Visa updates",
  description:
    "Sourced guidance on visitor and tourist visa processes for the UK, Schengen, Australia, New Zealand, Canada, the USA and Turkey."
};

/**
 * The verification date is the reason to trust this page, so it is promoted
 * out of the metadata footnote and set in mono at the top of every entry —
 * the same weight as the destination it applies to.
 */
export default function UpdatesPage() {
  const updates = DEMO_UPDATES.filter((u) => u.status === "PUBLISHED");

  return (
    <>
      <PageHero
        eyebrow="Visa & immigration updates"
        title="Sourced, dated, and checkable."
        description="Every entry names the authority it came from and the date we last verified it. Where our summary and the official source disagree, the official source wins."
        facts={[
          { k: "Entries", v: `${updates.length} published` },
          { k: "Sources", v: "Government portals only" },
          { k: "Re-checked", v: "At every content review" }
        ]}
      />

      <section className="container-edge py-14 lg:py-16">
        <div className="surface divide-y divide-border overflow-hidden">
          {updates.map((u) => (
            <article key={u.slug} className="p-6">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent-ink">
                  {u.destination}
                </span>
                <span
                  aria-hidden="true"
                  className="hidden h-3 w-px bg-border sm:block"
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Verified {u.lastVerifiedAt}
                </span>
              </div>

              <h2 className="mt-3 max-w-3xl text-balance text-xl leading-snug">
                {u.title}
              </h2>
              <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
                {u.summary}
              </p>

              <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-3 border-t border-border pt-4">
                <div>
                  <dt className="label-data">Category</dt>
                  <dd className="mt-1 text-[13px]">{u.service}</dd>
                </div>
                <div>
                  <dt className="label-data">Published</dt>
                  <dd className="mt-1 font-mono text-[13px]">{u.publishedAt}</dd>
                </div>
                <div>
                  <dt className="label-data">Last verified</dt>
                  <dd className="mt-1 font-mono text-[13px]">
                    {u.lastVerifiedAt}
                  </dd>
                </div>
              </dl>

              {u.source && (
                <a
                  href={u.source.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-ink hover:underline"
                >
                  {u.source.name}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </article>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
          These entries explain how visitor visa processes work. They are not
          announcements of policy change, and nothing here should be treated as
          the current rule for your case. Requirements change without notice —
          always confirm with the official government source before acting, and
          speak to us if the two appear to disagree.
        </p>
      </section>
    </>
  );
}
