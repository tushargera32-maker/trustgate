import { cn } from "@/lib/utils";

/**
 * Loading and empty states, in the document vernacular.
 *
 * Most products use grey pulsing blocks for loading. They work, and they look
 * like every other product. Here the placeholder is a **blank form** — ruled
 * lines waiting to be filled — which is what this product is actually about.
 * It costs nothing extra and it means even the loading state is on-brand.
 *
 * The empty state matters more than people allow. An empty screen is the first
 * thing a new client sees after signing in, and "No documents" is a dead end.
 * Every empty state here names what will appear, why it is not there yet, and
 * what to do — in that order.
 */

/** A single ruled line, as on a blank form. Width varies so it reads as text. */
export function RuleLine({
  width = "full",
  className
}: {
  width?: "full" | "long" | "medium" | "short";
  className?: string;
}) {
  const widths = {
    full: "w-full",
    long: "w-4/5",
    medium: "w-3/5",
    short: "w-2/5"
  };

  return (
    <div
      className={cn(
        "h-px animate-pulse bg-gradient-to-r from-border via-border to-transparent",
        widths[width],
        className
      )}
    />
  );
}

/**
 * A form-shaped skeleton. Label rule short, value rule long — the rhythm of a
 * real record, so the page does not visibly re-flow when data arrives.
 */
export function FormSkeleton({
  rows = 4,
  className
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("surface space-y-6 p-6", className)}
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2.5">
          <RuleLine width="short" />
          <RuleLine width={i % 2 === 0 ? "long" : "medium"} />
        </div>
      ))}
      <span className="sr-only">Loading records</span>
    </div>
  );
}

/** Rows for a table that has not loaded yet. */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      className="divide-y divide-border"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-6 px-4 py-5">
          <RuleLine width="short" className="max-w-[110px]" />
          <RuleLine width="medium" className="max-w-[180px]" />
          <RuleLine width="short" className="ml-auto max-w-[90px]" />
        </div>
      ))}
      <span className="sr-only">Loading records</span>
    </div>
  );
}

/**
 * EmptyState — an invitation, not a dead end.
 *
 * `title` names what belongs here. `body` explains why it is not there yet.
 * `action` is the one thing to do about it. If you cannot fill all three,
 * the screen probably should not be empty in the first place.
 */
export function EmptyState({
  title,
  body,
  action,
  className
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "surface-inset flex flex-col items-center px-8 py-14 text-center",
        className
      )}
    >
      {/* A blank form, drawn rather than illustrated. Nothing to license,
          nothing that looks like a stock spot illustration. */}
      <svg
        width="56"
        height="66"
        viewBox="0 0 56 66"
        fill="none"
        aria-hidden="true"
        className="mb-5 text-muted-foreground/45"
      >
        <rect
          x="0.75"
          y="0.75"
          width="54.5"
          height="64.5"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <line x1="12" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="31" x2="44" y2="31" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
        <line x1="12" y1="42" x2="44" y2="42" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
        <line x1="12" y1="53" x2="34" y2="53" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
      </svg>

      <p className="font-display text-xl">{title}</p>
      <p className="measure mt-2 text-[15px] leading-relaxed text-muted-foreground">
        {body}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
