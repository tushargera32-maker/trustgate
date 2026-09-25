import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/ui/section";
import { DEMO_POSTS } from "@/lib/content";

export const metadata = {
  title: "Blog",
  description:
    "Practical guides to visitor and tourist visa applications - Schengen, the UK, Australia, New Zealand, Canada, the USA and Turkey."
};

/**
 * The previous cards used a gradient block where a photo would go. A decorative
 * placeholder that carries no information is worse than none, so the space now
 * goes to the excerpt — which is what a reader actually chooses an article on.
 *
 * Post detail pages are not built yet, so cards link to the index. That is
 * stated on the page rather than hidden behind a link that goes nowhere useful.
 */
export default function BlogPage() {
  const posts = DEMO_POSTS.filter((p) => p.status === "PUBLISHED");
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <>
      <PageHero
        eyebrow="The Trust Gate journal"
        title="Guides for people filling in the form tonight."
        description="Destination-specific writing about short-stay applications — what is assessed, what evidence carries weight, and what to do after a refusal."
        facts={[
          { k: "Articles", v: `${posts.length} published` },
          { k: "Destinations", v: categories.join(" · ") }
        ]}
      />

      <section className="container-edge py-14 lg:py-16">
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href="/blog"
              className="group flex flex-col bg-card p-6 transition-colors hover:bg-secondary"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent-ink">
                  {p.category}
                </span>
                <span
                  aria-hidden="true"
                  className="h-3 w-px bg-border"
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {p.readingTime} read
                </span>
              </div>

              <h2 className="mt-4 text-balance text-lg leading-snug">
                {p.title}
              </h2>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                {p.excerpt}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {p.author}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-accent-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
          Article bodies are managed in the Blog CMS. Individual post pages are
          not built yet, so these cards currently link back to this index.
        </p>
      </section>
    </>
  );
}
