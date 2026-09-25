import { PageHero } from "@/components/ui/section";
import { StoryFilter } from "@/components/stories/story-filter";
import { DEMO_STORIES, IS_DEMO_CONTENT } from "@/lib/content";

export const metadata = {
  title: "Client stories",
  description:
    "How Trust Gate Overseas handles visitor and tourist visa cases, in clients' own words."
};

export default function SuccessStoriesPage() {
  const stories = DEMO_STORIES.filter((s) => s.status === "PUBLISHED");

  return (
    <>
      <PageHero
        eyebrow="Client stories"
        title="What working with us actually looks like."
        description="Short-stay applications rarely fail dramatically. They fail quietly, on a detail nobody checked. These are stories about the checking."
        facts={[
          { k: "Published", v: `${stories.length} stories` },
          { k: "Shared with", v: "Client consent" },
          { k: "Names", v: "Shortened by default" }
        ]}
      />

      <section className="container-edge py-14 lg:py-16">
        <StoryFilter stories={stories} />

        {/* The previous version's honesty note is kept verbatim in substance —
            it is the single most trust-building block on the page. */}
        <div className="mt-12 rounded-xl border border-border bg-secondary p-6">
          <p className="label-data">About these testimonials</p>
          <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
            {IS_DEMO_CONTENT && (
              <>
                The entries above are placeholder records used to build the page
                layout. They are not real client reviews and must be replaced
                from the Reviews CMS before launch.{" "}
              </>
            )}
            Trust Gate Overseas does not fabricate testimonials: every published
            statement is a real client&rsquo;s words, shared with their consent,
            and identifying details are used only where the client has agreed to
            them. A visa outcome depends on the applicant&rsquo;s circumstances
            and on the decision of the immigration authority — past cases do not
            predict future ones.
          </p>
        </div>
      </section>
    </>
  );
}
