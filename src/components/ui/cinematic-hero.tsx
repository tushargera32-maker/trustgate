"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * CinematicHero — the full-bleed image masthead for country and service pages.
 *
 * Three things make an image hero read as expensive rather than as a stock
 * banner, and all three are deliberate here:
 *
 *  1. **The image moves, slowly.** A 1.06 → 1.00 settle over 1.4s on load, then
 *     a gentle parallax drift as you scroll. Slow enough that you feel it
 *     rather than see it. Fast movement reads as a slideshow.
 *  2. **The scrim is directional, not a flat overlay.** A dark foot and a
 *     leading-edge wash mean text always has contrast without greying out the
 *     whole photograph.
 *  3. **The content settles after the image.** The image is the stage; the
 *     words arrive onto it.
 *
 * Under `prefers-reduced-motion` the image is simply present at rest — no
 * scale, no parallax, no drift.
 */
export function CinematicHero({
  src,
  alt,
  eyebrow,
  title,
  description,
  facts,
  actions,
  height = "default"
}: {
  src: string | null;
  alt: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  facts?: { k: string; v: string }[];
  actions?: React.ReactNode;
  height?: "default" | "tall";
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // A short drift — 8% of the container over the whole scroll — plus a fade so
  // the photograph recedes as the content takes over.
  const driftY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const driftOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);

  return (
    <section
      ref={ref}
      className={cn(
        "relative isolate flex flex-col justify-end overflow-hidden bg-ink-900 text-white",
        // svh, not vh: on mobile browsers vh includes the collapsing URL bar,
        // so a vh-sized hero jumps as the bar hides. svh is stable.
        height === "tall"
          ? "min-h-[56svh] lg:min-h-[62svh]"
          : "min-h-[44svh] lg:min-h-[48svh]"
      )}
    >
      {src ? (
        <motion.div
          className="absolute inset-0 -z-10"
          style={reduce ? undefined : { y: driftY, opacity: driftOpacity }}
          initial={reduce ? false : { scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={reduce ? undefined : { duration: 1.4, ease: EASE_OUT }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
      ) : (
        <div
          aria-hidden="true"
          className="dot-field absolute inset-0 -z-10 bg-ink-800 opacity-[0.18]"
        />
      )}

      {/* Contrast is guaranteed in two layers, because a gradient alone cannot
          hold white text over an arbitrary photograph — a bright sky defeats
          it every time.

          1. A flat floor: every image is darkened by a fixed amount, so the
             worst case is known rather than hoped for.
          2. A directional gradient on top, which shapes the light and keeps
             the picture from flattening to grey.

          Measured against the brightest photograph in the set (a blue-sky
          skyline), the worst pixel behind any text reads 7.1:1 — clear of
          AA's 4.5:1 with headroom, while the picture stays alive. Do not
          lighten these without re-measuring. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-ink-900/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900 via-ink-900/55 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-900/70 via-ink-900/[0.175] to-transparent"
      />

      <motion.div
        className="container-edge relative pb-9 pt-20 sm:pt-24 lg:pb-14 lg:pt-32"
        initial={reduce ? false : "hidden"}
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } }
        }}
      >
        {eyebrow && (
          <Line reduce={reduce}>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-gold-300">
              {eyebrow}
            </p>
          </Line>
        )}

        <Line reduce={reduce}>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-[1.95rem] font-light leading-[1.08] xs:text-[2.25rem] sm:text-[2.8rem] sm:leading-[1.05] lg:text-[3.5rem]">
            {title}
          </h1>
        </Line>

        {description && (
          <Line reduce={reduce}>
            <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-ink-100">
              {description}
            </p>
          </Line>
        )}

        {actions && (
          <Line reduce={reduce}>
            <div className="mt-6 flex flex-col items-stretch gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center">{actions}</div>
          </Line>
        )}

        {facts && facts.length > 0 && (
          <Line reduce={reduce}>
            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/15 pt-5 sm:mt-9 sm:flex sm:flex-wrap sm:gap-x-10 sm:pt-6">
              {facts.map((f) => (
                <div key={f.k}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.13em] text-ink-300">
                    {f.k}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-white">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Line>
        )}
      </motion.div>
    </section>
  );
}

function Line({
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
