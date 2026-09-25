"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { CaseReference } from "@/components/ui/case-reference";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The homepage hero — light.
 *
 * The previous version made navy the ground and the whole page read as a wall
 * of blue. The brief's palette is "Navy + Vellum/Ivory + restrained Gold", and
 * the ratio matters more than the hues: **ivory is the page, navy is the
 * typography, gold is the one action.** Navy appears here only as text and as
 * the small tracker card — nowhere as a full-bleed field.
 *
 * The photograph is a contained panel bleeding off the right edge rather than
 * a background behind everything. That is what makes it read as an editorial
 * spread instead of a template banner, and it means the headline sits on clean
 * paper where it is unambiguously legible — no scrim tuning required.
 */

/** Illustrative file shown on the marketing page. Not a real client. */
const SAMPLE_CASE = {
  reference: "TG-2026-045",
  route: "Schengen · France",
  percent: 70,
  steps: [
    { label: "Consultation", state: "done" },
    { label: "Documents verified", state: "done" },
    { label: "Application submitted", state: "done" },
    { label: "Decision awaiting", state: "now" }
  ]
} as const;

const PROOF = [
  { k: "Offices", v: "Jalandhar & London" },
  { k: "Case tracking", v: "Live, in your portal" },
  { k: "Refusal support", v: "Included as standard" }
];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-background">
      {/* A faint warm wash bottom-left, so the ivory is not a dead flat field.
          No blue anywhere in it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[620px] rounded-full bg-gold-100/50 blur-3xl"
      />

      <motion.div
        className="container-edge relative grid items-start gap-10 pb-12 pt-10 sm:pt-12 lg:grid-cols-12 lg:gap-12 lg:pb-14 lg:pt-14"
        initial={reduce ? false : "hidden"}
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
        }}
      >
        {/* ── the claim, on paper ─────────────────────────────────── */}
        <div className="lg:col-span-7">
          <Beat reduce={reduce}>
            <p className="flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent-ink">
              <span aria-hidden="true" className="h-px w-8 bg-accent/50" />
              Visitor &amp; tourist visas · UK and India
            </p>
          </Beat>

          <Beat reduce={reduce}>
            <h1 className="mt-5 text-balance font-display text-[2.15rem] font-light leading-[1.06] text-ink-900 xs:text-[2.5rem] sm:text-[3.3rem] sm:leading-[1.02] lg:text-[4.1rem]">
              The trip is yours.{" "}
              <br className="hidden sm:block" />
              The <span className="text-accent-ink">paperwork</span> is ours.
            </h1>
          </Beat>

          <Beat reduce={reduce}>
            <p className="measure mt-6 leading-relaxed text-muted-foreground sm:text-lg">
              One named case manager, from the first call to the decision — and
              a portal where you can see exactly where your file sits.
            </p>
          </Beat>

          <Beat reduce={reduce}>
            <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/eligibility">
                  Check eligibility
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href="/contact">Book a consultation</Link>
              </Button>
              <Link
                href="/apply"
                className="link-sweep inline-flex h-11 items-center justify-center px-2 text-[15px] text-foreground/80 hover:text-foreground sm:h-12"
              >
                Start an application
              </Link>
            </div>
          </Beat>

          <Beat reduce={reduce}>
            <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-6 lg:grid-cols-3">
              {PROOF.map((item) => (
                <div key={item.k}>
                  <dt className="label-data">{item.k}</dt>
                  <dd className="mt-1.5 text-[15px] font-medium">{item.v}</dd>
                </div>
              ))}
            </dl>
          </Beat>
        </div>

        {/* ── the photograph, as a panel ──────────────────────────── */}
        <div className="lg:col-span-5">
          <Beat reduce={reduce}>
            <figure className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[16/10] lg:aspect-[4/3]">
                <motion.div
                  className="absolute inset-0"
                  initial={reduce ? false : { scale: 1.05 }}
                  animate={reduce ? undefined : { scale: 1 }}
                  transition={
                    reduce ? undefined : { duration: 16, ease: "linear" }
                  }
                >
                  <Image
                    // Swap for the commissioned image once it exists —
                    // see docs/HERO_IMAGE_SPEC.md.
                    src="/hero/visa-success.webp"
                    alt="A traveller with a passport at an airport departures hall"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </motion.div>

                {/* Only enough darkening at the foot to seat the card. The
                    picture is otherwise left alone — it no longer has to
                    carry any text. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink-900/75 via-transparent to-transparent"
                />
              </div>

              {/* The tracker overlaps the panel's foot. This is the one place
                  glass earns its cost: it sits over imagery, and the overlap
                  is what makes the composition read as layered rather than
                  as two boxes side by side. */}
              <div className="relative -mt-16 ml-4 mr-4 sm:-mt-20 sm:ml-6 sm:mr-10 lg:-mt-24">
                <CaseTracker reduce={reduce} />
              </div>
            </figure>
          </Beat>
        </div>
      </motion.div>

      <DestinationStrip reduce={reduce} />
    </section>
  );
}

function Beat({
  reduce,
  children
}: {
  reduce: boolean | null;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={
        reduce
          ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
          : {
              hidden: { opacity: 0, y: 16 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: EASE_OUT }
              }
            }
      }
    >
      {children}
    </motion.div>
  );
}

function CaseTracker({ reduce }: { reduce: boolean | null }) {
  return (
    <div className="glass edge-light rounded-xl p-5 text-white">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-ink-200">
          A live application
        </p>
        <StatusPill tone="review" label={`${SAMPLE_CASE.percent}%`} />
      </div>

      <CaseReference
        value={SAMPLE_CASE.reference}
        tone="invert"
        className="-ml-1.5 mt-2"
      />
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.13em] text-ink-200">
        {SAMPLE_CASE.route}
      </p>

      <div
        className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-black/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
        role="progressbar"
        aria-valuenow={SAMPLE_CASE.percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Application progress"
      >
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={reduce ? false : { width: "0%" }}
          animate={{ width: `${SAMPLE_CASE.percent}%` }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 1.2, ease: EASE_OUT, delay: 0.7 }
          }
        />
      </div>

      <ol className="mt-4 space-y-0.5">
        {SAMPLE_CASE.steps.map((step, i) => (
          <li
            key={step.label}
            className={cn(
              "flex items-baseline gap-3 py-1 text-[13.5px]",
              step.state === "now" ? "text-white" : "text-ink-200"
            )}
          >
            <span className="w-4 shrink-0 font-mono text-[10px] text-white/45">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{step.label}</span>
            <span
              className={cn(
                "ml-auto font-mono text-[10px] uppercase tracking-[0.1em]",
                step.state === "now" ? "text-gold-300" : "text-white/45"
              )}
            >
              {step.state === "now" ? "Now" : "Done"}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/12 pt-3.5">
        <Link
          href="/client/login"
          className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.13em] text-gold-300 hover:text-gold-200"
        >
          View in your portal
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <span className="text-[10px] text-ink-300">Illustrative</span>
      </div>
    </div>
  );
}

/**
 * Destination strip, on ivory. Only destinations with a truthful photograph
 * appear — short by design rather than padded with the wrong country.
 */
const STRIP = [
  {
    href: "/countries/sch",
    label: "Schengen",
    src: "/office/london-office.webp",
    alt: "The Seine and the Eiffel Tower at sunset"
  },
  {
    href: "/countries/gb",
    label: "United Kingdom",
    src: "/office/india-office.webp",
    alt: "Westminster and the Thames at sunset"
  },
  {
    href: "/countries/ca",
    label: "Canada",
    src: "/destinations/australia.webp",
    alt: "Toronto waterfront and skyline"
  },
  {
    href: "/countries/nz",
    label: "New Zealand",
    src: "/destinations/uk.webp",
    alt: "Lake Tekapo with the Southern Alps beyond"
  }
];

function DestinationStrip({ reduce }: { reduce: boolean | null }) {
  const items = [...STRIP, ...STRIP];

  return (
    <div className="border-t border-border bg-secondary/60">
      <div className="container-edge flex items-center gap-2 pt-5">
        <p className="label-data">Where we work</p>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>

      <div className="mask-fade-x group overflow-hidden pb-5 pt-4">
        <div
          className={cn(
            "flex w-max gap-3 px-4",
            !reduce &&
              "animate-marquee group-hover:[animation-play-state:paused]"
          )}
        >
          {items.map((item, i) => {
            const isClone = i >= STRIP.length;
            return (
              <Link
                key={`${item.href}-${i}`}
                href={item.href}
                aria-hidden={isClone || undefined}
                tabIndex={isClone ? -1 : undefined}
                className="group/tile lift relative h-24 w-44 shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-56"
              >
                <Image
                  src={item.src}
                  alt={isClone ? "" : item.alt}
                  fill
                  sizes="224px"
                  className="object-cover transition-transform duration-700 group-hover/tile:scale-105"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink-900/85 to-transparent"
                />
                <span className="absolute inset-x-0 bottom-0 p-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
