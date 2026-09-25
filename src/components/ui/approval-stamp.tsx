"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * ApprovalStamp — the site's secondary signature mark.
 *
 * The design direction named two signature devices: the MRZ strip (used, and
 * confined to case contexts) and the embassy stamp, which was never built.
 * This is it.
 *
 * Why a stamp rather than a tick: a tick is a UI convention that belongs to
 * every product ever made. A stamp belongs to *this* product's world — it is
 * the physical object that ends a visa application. It is the difference
 * between a site that has been styled and a site that knows what it is about.
 *
 * Three details do the work, and all three are the kind of thing that looks
 * like nothing and reads as expensive:
 *
 *   1. **It is rotated, and never by a round number.** −7.5°, because a stamp
 *      pressed by a hand is never square to the page.
 *   2. **The ink is uneven.** A subtle noise mask breaks up the fill so it
 *      reads as ink absorbed by paper, not as a vector shape.
 *   3. **It lands rather than fades.** Scale 1.35 → 1, 320ms, with a tiny
 *      overshoot. The eye reads that as an impact.
 *
 * Use sparingly. One per view, on a genuinely completed thing — a granted
 * decision, a verified document set. A stamp on everything is a sticker.
 */

export function ApprovalStamp({
  label = "Approved",
  sublabel,
  tone = "teal",
  size = 112,
  animate = true,
  className
}: {
  label?: string;
  sublabel?: string;
  /** teal = approved/verified · gold = a Trust Gate mark rather than a decision */
  tone?: "teal" | "gold";
  size?: number;
  animate?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const shouldAnimate = animate && !reduce;
  const id = React.useId();

  const ink = tone === "teal" ? "hsl(174 56% 27%)" : "hsl(40 70% 32%)";

  return (
    <motion.div
      className={cn("pointer-events-none select-none", className)}
      initial={shouldAnimate ? { scale: 1.35, opacity: 0, rotate: -14 } : false}
      whileInView={
        shouldAnimate ? { scale: 1, opacity: 1, rotate: -7.5 } : undefined
      }
      viewport={{ once: true, margin: "-10%" }}
      transition={
        shouldAnimate
          ? { duration: 0.32, ease: [0.34, 1.4, 0.64, 1] }
          : undefined
      }
      style={reduce ? { transform: "rotate(-7.5deg)" } : undefined}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        role="presentation"
      >
        <defs>
          {/* Uneven ink. Fractal noise displaced slightly, then used as a mask,
              so the stamp reads as absorbed pigment rather than flat vector. */}
          <filter id={`${id}-ink`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="3"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="1.6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          <path
            id={`${id}-arc-top`}
            d="M 22 60 A 38 38 0 0 1 98 60"
            fill="none"
          />
          <path
            id={`${id}-arc-bottom`}
            d="M 26 60 A 34 34 0 0 0 94 60"
            fill="none"
          />
        </defs>

        <g
          filter={`url(#${id}-ink)`}
          stroke={ink}
          fill={ink}
          opacity="0.82"
        >
          {/* Double ring — the outer heavier, as a real die would press. */}
          <circle cx="60" cy="60" r="54" strokeWidth="3" fill="none" />
          <circle cx="60" cy="60" r="47" strokeWidth="1" fill="none" />

          {/* Curved text around the top of the die. */}
          <text
            fontSize="9.5"
            letterSpacing="2.4"
            fontFamily="var(--font-mono), monospace"
            fontWeight="500"
            stroke="none"
          >
            <textPath href={`#${id}-arc-top`} startOffset="50%" textAnchor="middle">
              TRUST GATE OVERSEAS
            </textPath>
          </text>

          {sublabel && (
            <text
              fontSize="7.5"
              letterSpacing="2"
              fontFamily="var(--font-mono), monospace"
              stroke="none"
            >
              <textPath
                href={`#${id}-arc-bottom`}
                startOffset="50%"
                textAnchor="middle"
              >
                {sublabel.toUpperCase()}
              </textPath>
            </text>
          )}

          {/* Rules above and below the label, as on a real cachet. */}
          <line x1="30" y1="49" x2="90" y2="49" strokeWidth="1.2" />
          <line x1="30" y1="73" x2="90" y2="73" strokeWidth="1.2" />

          <text
            x="60"
            y="66"
            fontSize="15"
            letterSpacing="1.2"
            fontFamily="var(--font-mono), monospace"
            fontWeight="600"
            textAnchor="middle"
            stroke="none"
          >
            {label.toUpperCase()}
          </text>
        </g>
      </svg>
    </motion.div>
  );
}
