import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Badge is for labels and categories (a blog tag, a country region).
 * For anything that expresses *state*, use <StatusPill> instead — status has
 * its own four-tone vocabulary and must not be improvised here.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        accent: "border-gold-200 bg-gold-100 text-accent-ink",
        gold: "border-gold-200 bg-gold-100 text-accent-ink",
        outline: "border-border text-foreground",
        success: "border-teal-200 bg-success-tint text-success",
        warning: "border-gold-200 bg-warning-tint text-accent-ink",
        destructive: "border-ochre-200 bg-destructive-tint text-destructive"
      }
    },
    defaultVariants: { variant: "default" }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };