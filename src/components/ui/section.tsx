import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * PageHero — the masthead for every page other than the homepage.
 *
 * Two tones. `vellum` is the default: a paper band that separates the page
 * title from the content without competing with it. `navy` is reserved for
 * pages where the hero is the whole point (eligibility, apply) and carries
 * the perforation texture and MRZ strip from the homepage.
 */
interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  /** Short factual pairs rendered as a data row beneath the description. */
  facts?: { k: string; v: string }[];
  tone?: "vellum" | "navy";
  align?: "left" | "center";
  children?: React.ReactNode;
  className?: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  facts,
  tone = "vellum",
  align = "left",
  children,
  className
}: PageHeroProps) {
  const navy = tone === "navy";

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden border-b border-border",
        navy ? "bg-ink-900 text-white" : "bg-secondary",
        className
      )}
    >
      {navy && (
        <div
          aria-hidden="true"
          className="dot-field mask-fade-b pointer-events-none absolute inset-0 opacity-[0.12]"
        />
      )}

      <div
        className={cn(
          "container-edge relative pb-12 pt-12 lg:pb-16 lg:pt-16",
          align === "center" && "text-center"
        )}
      >
        {eyebrow && (
          <p
            className={cn(
              "font-mono text-[10px] font-medium uppercase tracking-[0.14em]",
              navy ? "text-gold-300" : "text-accent-ink"
            )}
          >
            {eyebrow}
          </p>
        )}

        <h1
          className={cn(
            "mt-4 max-w-3xl text-balance font-display text-[2.25rem] font-light leading-[1.08] sm:text-5xl",
            align === "center" && "mx-auto"
          )}
        >
          {title}
        </h1>

        {description && (
          <p
            className={cn(
              "mt-4 max-w-2xl text-pretty leading-relaxed",
              navy ? "text-ink-200" : "text-muted-foreground",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        )}

        {facts && facts.length > 0 && (
          <dl
            className={cn(
              "mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-5 sm:mt-8 sm:flex sm:flex-wrap sm:gap-x-10 sm:pt-6",
              navy ? "border-white/10" : "border-border",
              align === "center" && "justify-center"
            )}
          >
            {facts.map((f) => (
              <div key={f.k}>
                <dt
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-[0.13em]",
                    navy ? "text-ink-400" : "text-muted-foreground"
                  )}
                >
                  {f.k}
                </dt>
                <dd
                  className={cn(
                    "mt-1 text-sm font-medium",
                    navy && "text-ink-100"
                  )}
                >
                  {f.v}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
}

/**
 * Section — the standard content block. Carries the gold-ink eyebrow with its
 * rule, an optional corner action, and alternating vellum banding.
 */
export function Section({
  eyebrow,
  title,
  lede,
  action,
  band = false,
  className,
  children
}: {
  eyebrow?: string;
  title?: string;
  lede?: string;
  action?: React.ReactNode;
  band?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "border-b border-border py-9 sm:py-12 lg:py-14",
        band && "bg-secondary",
        className
      )}
    >
      <div className="container-edge">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {(title || action) && (
          <div className="mt-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              {title && (
                <h2 className="text-balance text-[1.45rem] leading-tight sm:text-[1.75rem] lg:text-3xl">
                  {title}
                </h2>
              )}
              {lede && (
                <p className="mt-3 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
                  {lede}
                </p>
              )}
            </div>
            {action}
          </div>
        )}
        <div className={cn(eyebrow || title ? "mt-7" : undefined)}>
          {children}
        </div>
      </div>
    </section>
  );
}

/**
 * Prose — long-form content (legal pages, article bodies). Newsreader is the
 * display face only, so body copy here stays in Inter at a comfortable measure.
 */
export function Prose({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "measure text-[17px] leading-[1.75] text-foreground/90",
        "[&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:leading-snug",
        "[&_h3]:mt-8 [&_h3]:text-xl [&_h3]:leading-snug",
        "[&_p]:mt-4 [&_ul]:mt-4 [&_ol]:mt-4",
        "[&_li]:mt-1.5 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5",
        "[&_a]:text-accent-ink [&_a]:underline [&_a]:underline-offset-2",
        "[&_strong]:font-semibold",
        className
      )}
    >
      {children}
    </div>
  );
}
