import * as React from "react";
import { cn } from "@/lib/utils";

interface StatProps {
  value: string | number;
  label: string;
  hint?: string;
  trend?: { value: string; positive?: boolean };
  className?: string;
}

export function Stat({ value, label, hint, trend, className }: StatProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium",
              trend.positive ? "text-teal-600" : "text-ochre-600"
            )}
          >
            {trend.positive ? "▲" : "▼"} {trend.value}
          </span>
        )}
      </div>
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {hint && (
        <p className="text-xs text-muted-foreground/80">{hint}</p>
      )}
    </div>
  );
}