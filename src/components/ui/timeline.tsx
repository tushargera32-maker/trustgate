import * as React from "react";
import { cn } from "@/lib/utils";

interface TimelineStep {
  label: string;
  description?: string;
  date?: string;
  status?: "complete" | "current" | "upcoming";
}

interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  steps: TimelineStep[];
}

export function Timeline({ steps, className, ...props }: TimelineProps) {
  return (
    <ol
      className={cn(
        "relative space-y-6 border-l border-border/60 pl-6",
        className
      )}
      {...props}
    >
      {steps.map((step, i) => {
        const status = step.status ?? "upcoming";
        return (
          <li key={i} className="relative">
            <span
              className={cn(
                "absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border-2 bg-card",
                status === "complete" &&
                  "border-teal-500 bg-teal-500/10",
                status === "current" &&
                  "border-gold-500 bg-gold-500/10 shadow-[0_0_0_4px_hsl(var(--background))]",
                status === "upcoming" && "border-border bg-card"
              )}
            >
              {status === "complete" && (
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              )}
              {status === "current" && (
                <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              )}
            </span>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between gap-3">
                <h4
                  className={cn(
                    "text-sm font-semibold",
                    status === "upcoming" && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </h4>
                {step.date && (
                  <time className="text-xs text-muted-foreground">
                    {step.date}
                  </time>
                )}
              </div>
              {step.description && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}