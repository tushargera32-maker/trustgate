/**
 * ⚠️ CURRENTLY UNUSED — the homepage hero was rebuilt in Aug 2026 and now
 * inlines its own, simpler sequence. Kept because two pieces here are worth
 * reusing rather than rewriting:
 *
 *   · `CountUp`  — animated figures for admin KPI cards, viewport-triggered,
 *                  and announced once to screen readers instead of counting.
 *   · `MrzScan`  — the machine-readable strip. Per the design brief the MRZ
 *                  belongs only in genuine case contexts, so this is the right
 *                  home for it: the client portal case-file header.
 *
 * If neither is adopted within a release or two, delete this file rather than
 * letting it rot.
 */

"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  useInView,
  animate,
  useMotionValue,
  useTransform
} from "framer-motion";
import { BEAT, EASE_OUT, transition, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The hero's page-load sequence.
 *
 * One orchestrated moment rather than a dozen scattered effects. The order is
 * the argument the page is making, so the motion follows it:
 *
 *   eyebrow → headline → supporting copy → actions → proof facts
 *   ...then the case file assembles: card, reference, progress fills,
 *   steps stamp in one at a time, and the MRZ strip scans across last.
 *
 * The tracker deliberately arrives *after* the claim. The reader should read
 * the promise, then watch the evidence for it appear.
 *
 * Under prefers-reduced-motion the whole sequence collapses to a plain render:
 * everything is present immediately, at full opacity, with no travel.
 */

/** A single beat in the load sequence. */
export function Beat({
  at = 0,
  y = 14,
  children,
  className,
  as = "div"
}: {
  at?: number;
  y?: number;
  children: React.ReactNode;
  className?: string;
  as?: "div" | "p" | "h1" | "dl" | "ol";
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  if (reduce) {
    const Plain = as as React.ElementType;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Component
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: EASE_OUT, delay: at }}
      className={className}
    >
      {children}
    </Component>
  );
}

/**
 * The progress bar fills from zero to its real value rather than appearing
 * full. The fill *is* the proof — showing it move is the whole point.
 */
export function ProgressFill({
  percent,
  at = BEAT.bar,
  className
}: {
  percent: number;
  at?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn("h-full rounded-full bg-accent", className)}
      initial={reduce ? { width: `${percent}%` } : { width: "0%" }}
      animate={{ width: `${percent}%` }}
      transition={
        reduce ? { duration: 0 } : { duration: 1.1, ease: EASE_OUT, delay: at }
      }
    />
  );
}

/**
 * Counts a number up to its target. Used for the progress percentage and for
 * admin KPIs, so the figure and the bar move together.
 */
export function CountUp({
  to,
  suffix = "",
  duration = 1.1,
  at = 0,
  className
}: {
  to: number;
  suffix?: string;
  duration?: number;
  at?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const value = useMotionValue(reduce ? to : 0);
  const rounded = useTransform(value, (v) => `${Math.round(v)}${suffix}`);

  React.useEffect(() => {
    if (reduce || !inView) return;
    const controls = animate(value, to, {
      duration,
      ease: EASE_OUT,
      delay: at
    });
    return () => controls.stop();
  }, [inView, reduce, to, duration, at, value]);

  return (
    <span ref={ref} className={className}>
      {/* aria-hidden on the animated text and a static value for assistive
          tech, so a screen reader announces "70%" once rather than counting. */}
      <motion.span aria-hidden="true">{rounded}</motion.span>
      <span className="sr-only">{`${to}${suffix}`}</span>
    </span>
  );
}

/**
 * Steps stamp in one at a time, like entries being added to a file. The
 * completed ones settle first; the current one arrives last and holds.
 */
export function StepList({
  children,
  at = BEAT.steps,
  className
}: {
  children: React.ReactNode;
  at?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.ol
      className={className}
      initial="hidden"
      animate="visible"
      variants={
        reduce
          ? { hidden: {}, visible: {} }
          : { hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: at } } }
      }
    >
      {children}
    </motion.ol>
  );
}

export function Step({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.li
      className={className}
      variants={
        reduce
          ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
          : {
              hidden: { opacity: 0, x: -6 },
              visible: { opacity: 1, x: 0, transition: transition.fast }
            }
      }
    >
      {children}
    </motion.li>
  );
}

/**
 * The MRZ strip reads left to right once, like a passport being swiped. It is
 * the last thing to happen, and it happens only once — a looping version would
 * pull attention for the whole session.
 */
export function MrzScan({
  text,
  at = BEAT.mrz,
  className
}: {
  text: string;
  at?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const padded = `${text}${"<".repeat(140)}`;

  return (
    <div
      aria-hidden="true"
      className={cn("relative overflow-hidden", className)}
    >
      <motion.div
        className="mrz text-white/30"
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, delay: at }}
      >
        {padded}
      </motion.div>

      {/* The scan head: a narrow gold wash that crosses once. */}
      {!reduce && (
        <motion.div
          className="pointer-events-none absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-gold-300/25 to-transparent"
          initial={{ x: "-10%", opacity: 0 }}
          animate={{ x: "1200%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.6, ease: "linear", delay: at }}
        />
      )}
    </div>
  );
}
