"use client";

import * as React from "react";
import Image from "next/image";
import { StatusPill } from "@/components/ui/status-pill";
import { ApprovalStamp } from "@/components/ui/approval-stamp";
import { cn } from "@/lib/utils";

type Story = {
  initials: string;
  displayName: string;
  route: string;
  service: string;
  quote: string;
  rating: number;
};

/**
 * The route chips on the previous version looked like filters but did nothing.
 * A control that does not act is worse than no control, so these now filter.
 */
const PORTRAITS = [
  "/stories/client-1.webp",
  "/stories/client-2.webp",
  "/stories/client-3.webp"
];

export function StoryFilter({ stories }: { stories: Story[] }) {
  const routes = React.useMemo(
    () => Array.from(new Set(stories.map((s) => s.route))),
    [stories]
  );
  const [active, setActive] = React.useState<string>("All");

  const shown =
    active === "All" ? stories : stories.filter((s) => s.route === active);

  return (
    <>
      <div
        role="group"
        aria-label="Filter stories by route"
        className="flex flex-wrap items-center gap-2"
      >
        {["All", ...routes].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setActive(r)}
            aria-pressed={active === r}
            className={cn(
              "rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
              active === r
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-gold-300 hover:text-foreground"
            )}
          >
            {r}
            <span className="ml-1.5 opacity-60">
              {r === "All"
                ? stories.length
                : stories.filter((s) => s.route === r).length}
            </span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        /* An empty screen is an invitation to act, not a dead end. */
        <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-sm font-medium">No stories on this route yet.</p>
          <button
            type="button"
            onClick={() => setActive("All")}
            className="mt-2 font-mono text-[10px] uppercase tracking-[0.13em] text-accent-ink hover:underline"
          >
            Show all routes
          </button>
        </div>
      ) : (
        <div className="mt-8 grid items-stretch gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((s, i) => (
            <figure key={`${s.route}-${i}`} className="flex flex-col bg-card p-6">
              <StatusPill tone="verified" label="Approved" />

              <blockquote className="mt-4 text-pretty text-[15px] leading-relaxed">
                {s.quote}
              </blockquote>

              <figcaption className="mt-auto border-t border-border pt-4">
                <div className="flex items-center gap-3">
                  {/* Initials rather than a stock portrait: these are real
                      people whose faces we do not have permission to show. */}
                  {/* Portraits are stock imagery standing in for real clients
                      until consented photos exist, so they are decorative and
                      hidden from screen readers — the name below is the real
                      identifier. */}
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-secondary">
                    <Image
                      src={PORTRAITS[i % PORTRAITS.length]}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {s.displayName}
                    </p>
                    <p className="mt-0.5 truncate text-[12.5px] text-muted-foreground">
                      {s.route} · {s.service}
                    </p>
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </>
  );
}
