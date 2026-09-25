"use client";

import { useReducedMotion } from "framer-motion";

/**
 * The CSS `prefers-reduced-motion` block in globals.css cannot reach Framer
 * Motion: Framer animates via inline styles and its own rAF loop, so a CSS
 * rule that zeroes `transition-duration` has no effect on it. Every animated
 * component therefore has to check the preference in JavaScript.
 *
 * `useMotionSafe` returns a helper that strips travel from a set of motion
 * props while keeping the element visible. Content always arrives — it just
 * arrives without moving.
 *
 *   const safe = useMotionSafe();
 *   <motion.div {...safe({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } })} />
 */
export function useMotionSafe() {
  const reduce = useReducedMotion();

  return function safe<T extends Record<string, unknown>>(props: T): T {
    if (!reduce) return props;

    return {
      ...props,
      initial: false,
      animate: undefined,
      exit: undefined,
      transition: { duration: 0 }
    } as unknown as T;
  };
}

/** True when the user has asked for reduced motion. */
export function useReducedMotionSafe() {
  return useReducedMotion() ?? false;
}
