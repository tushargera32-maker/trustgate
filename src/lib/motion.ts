import type { Variants, Transition } from "framer-motion";

/**
 * Motion tokens for Trust Gate Overseas.
 *
 * The governing idea: one orchestrated moment on load, disciplined reveals on
 * scroll, and micro-interactions that confirm an action. Scattered effects read
 * as decoration and cheapen a consultancy that is selling carefulness — so
 * everything here is slow-ish, eased out, and never bounces.
 *
 * Every duration and easing lives here rather than inline, so the whole site
 * can be re-timed from one file.
 */

/** Ease-out expo. Fast departure, long settle — reads as "considered". */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Symmetrical ease for things that move both ways (accordions, drawers). */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DURATION = {
  /** Hover states, focus rings, colour changes. */
  micro: 0.18,
  /** Buttons, small transforms. */
  fast: 0.32,
  /** The default for content entering. */
  base: 0.6,
  /** Hero headline, large imagery. */
  slow: 0.9
} as const;

export const transition = {
  micro: { duration: DURATION.micro, ease: EASE_OUT },
  fast: { duration: DURATION.fast, ease: EASE_OUT },
  base: { duration: DURATION.base, ease: EASE_OUT },
  slow: { duration: DURATION.slow, ease: EASE_OUT }
} satisfies Record<string, Transition>;

/* ─────────────────────────── shared variants ─────────────────────────── */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: transition.base }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.base }
};

/** For the hero: a shorter rise, because the headline is already large. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: transition.slow }
};

/**
 * Stagger container. 70ms is the sweet spot here — fast enough that the group
 * still reads as one gesture, slow enough that the sequence is legible.
 */
export const stagger = (staggerChildren = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } }
});

/**
 * Reduced-motion fallback. Content still appears — it just arrives without
 * travel. Never return `hidden` here, or the page is blank for those users.
 */
export const noMotion: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { duration: 0 } }
};

/** Standard viewport config so every scroll reveal triggers at the same point. */
export const VIEWPORT = { once: true, margin: "-15% 0px -10% 0px" } as const;

/* ─────────────────────────── hero sequence ───────────────────────────── */

/**
 * Rough order-of-arrival for the hero load sequence, in seconds.
 *
 * This lives here, NOT in hero-sequence.tsx, and the reason matters: that file
 * is a "use client" module, and under React Server Components every export
 * from a client module becomes a client *reference proxy* rather than real
 * data. A server component importing a plain object from it receives a module
 * path, not a number — which fails at runtime with "Could not find the module
 * ...#BEAT#eyebrow in the React Client Manifest".
 *
 * Rule of thumb: constants shared across the server/client boundary belong in
 * a module with no "use client" directive.
 */
export const BEAT = {
  eyebrow: 0.0,
  headline: 0.1,
  lede: 0.28,
  actions: 0.4,
  facts: 0.5,
  card: 0.35,
  reference: 0.5,
  bar: 0.7,
  steps: 0.9,
  mrz: 1.3
} as const;
