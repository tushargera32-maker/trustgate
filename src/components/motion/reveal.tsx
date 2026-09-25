"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import {
  fadeUp,
  noMotion,
  stagger,
  transition,
  VIEWPORT
} from "@/lib/motion";

/**
 * Scroll reveals.
 *
 * Two rules these enforce:
 *  1. Reduced motion still renders content — it arrives without travel rather
 *     than not arriving. Returning the hidden state would blank the page.
 *  2. Travel is set through variants, never through `style`. A `style={{ y }}`
 *     prop wins over the animated value, which silently pins the element at its
 *     offset and cancels the animation — the bug this file previously had.
 */

/**
 * These wrap list and grid content, so they must be able to render as the
 * correct element — a <div> between <ul> and <li> is invalid markup and breaks
 * list semantics for screen readers.
 */
type RevealTag = "div" | "ul" | "ol" | "li" | "section" | "article" | "span";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  delay?: number;
  y?: number;
  once?: boolean;
  as?: RevealTag;
}

export function Reveal({
  children,
  delay = 0,
  y = 20,
  once = true,
  as = "div",
  className,
  ...props
}: RevealProps) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ ...VIEWPORT, once }}
      variants={
        reduce
          ? noMotion
          : {
              hidden: { opacity: 0, y },
              visible: {
                opacity: 1,
                y: 0,
                transition: { ...transition.base, delay }
              }
            }
      }
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

export function RevealStagger({
  children,
  className,
  gap = 0.07,
  delay = 0,
  as = "div",
  ...props
}: HTMLMotionProps<"div"> & {
  gap?: number;
  delay?: number;
  as?: RevealTag;
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={reduce ? noMotion : stagger(gap, delay)}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * A child of RevealStagger. Inherits the parent's hidden/visible state, so it
 * takes no viewport props of its own.
 */
export function RevealItem({
  children,
  className,
  as = "div",
  ...props
}: HTMLMotionProps<"div"> & { as?: RevealTag }) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      variants={reduce ? noMotion : fadeUp}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

// fadeUp / fadeIn are NOT re-exported: plain objects must not cross the
// server/client boundary. Import them from "@/lib/motion" instead.
export const MotionDiv = motion.div;
export const MotionSpan = motion.span;
