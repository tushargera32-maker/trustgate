import { PageHero } from "@/components/ui/section";
import { DestinationGrid } from "@/components/destinations/destination-grid";
import { DESTINATIONS } from "@/lib/constants";

export const metadata = {
  title: "Destinations",
  description:
    "Visitor and tourist visa destinations we cover - Schengen, Australia, New Zealand, Canada, the USA, Turkey, the United Kingdom and worldwide."
};

export default function DestinationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Destinations"
        title={
          <>
            Where you are going,
            <br /> and what it takes to get there.
          </>
        }
        description="Each destination has its own short-stay rules, its own evidence expectations and its own appointment reality. Pick yours to see how we handle it."
        facts={[
          { k: "Destinations", v: `${DESTINATIONS.length} covered` },
          { k: "Applying from", v: "UK or India" },
          { k: "Every page cites", v: "The official source" }
        ]}
      />

      <DestinationGrid destinations={[...DESTINATIONS]} />
    </>
  );
}
