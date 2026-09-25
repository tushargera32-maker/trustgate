"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  showLabel?: boolean;
  tone?: "default" | "accent" | "success";
}

export function Progress({
  value,
  showLabel,
  tone = "default",
  className,
  ...props
}: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const barColor =
    tone === "accent"
      ? "bg-gold-500"
      : tone === "success"
        ? "bg-teal-500"
        : "bg-primary";
  const reduce = useReducedMotion();
  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={reduce ? { width: `${clamped}%` } : { width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={
            reduce ? { duration: 0 } : { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
          }
          className={cn("h-full rounded-full", barColor)}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium tabular-nums text-muted-foreground">
          {clamped}%
        </span>
      )}
    </div>
  );
}