"use client";

import * as React from "react";
import { ExternalLink } from "lucide-react";
import {
  DestinationTile,
  type Destination
} from "@/components/destinations/destination-tile";
import { ORIGIN_HUBS, servicesForDestination } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * The origin selector is a real filter, not decoration: a UK resident and an
 * applicant in India can apply for different routes, so showing all eight
 * destinations to both is misleading. Selecting a hub hides the destinations
 * we do not serve from there.
 */
export function DestinationGrid({
  destinations
}: {
  destinations: Destination[];
}) {
  const [hub, setHub] = React.useState<string>("all");

  const shown = React.useMemo(() => {
    if (hub === "all") return destinations;
    return destinations.filter((d) =>
      servicesForDestination(d.code).some((s) => s.hub === hub)
    );
  }, [destinations, hub]);

  const lead = shown.slice(0, 2);
  const rest = shown.slice(2);

  return (
    <section className="container-edge py-12 lg:py-14">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <p className="label-data">Applying from</p>
        <div role="group" aria-label="Filter by where you are applying from" className="flex flex-wrap gap-2">
          <FilterButton active={hub === "all"} onClick={() => setHub("all")}>
            Anywhere
          </FilterButton>
          {ORIGIN_HUBS.map((h) => (
            <FilterButton
              key={h.slug}
              active={hub === h.slug}
              onClick={() => setHub(h.slug)}
            >
              <span aria-hidden="true" className="mr-1.5">
                {h.flag}
              </span>
              {h.short}
            </FilterButton>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="surface-inset mt-8 border-dashed p-12 text-center">
          <p className="text-sm font-medium">
            No destinations listed for that origin yet.
          </p>
          <button
            type="button"
            onClick={() => setHub("all")}
            className="mt-2 font-mono text-[10px] uppercase tracking-[0.13em] text-accent-ink hover:underline"
          >
            Show all destinations
          </button>
        </div>
      ) : (
        <>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {lead.map((d, i) => (
              <DestinationTile
                key={d.code}
                destination={d}
                size="tall"
                priority={i === 0}
              />
            ))}
          </div>
          {rest.length > 0 && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((d) => (
                <DestinationTile key={d.code} destination={d} />
              ))}
            </div>
          )}
        </>
      )}

      <p className="mt-8 flex max-w-3xl items-start gap-2 text-[13px] leading-relaxed text-muted-foreground">
        <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Stay rules summarised here are guidance only. Each destination page
        links the official government source, which is what governs your
        application.
      </p>
    </section>
  );
}

function FilterButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
        active
          ? "border-transparent bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:border-gold-300 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
