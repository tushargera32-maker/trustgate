"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * CaseReference — a reference number you can copy.
 *
 * This is unglamorous and it is the detail people will actually notice. A case
 * reference exists to be quoted: read down a phone line, pasted into an email,
 * typed into a consulate portal. Every client and every case manager will
 * select-and-copy these dozens of times, and on a phone that means a long-press
 * and two drag handles.
 *
 * One tap instead. That is the whole feature.
 *
 * Craft details that are easy to skip and shouldn't be:
 *   · It is a <button>, so it is keyboard-reachable and announced properly.
 *   · The confirmation is announced via aria-live, not only shown.
 *   · The icon slot is a fixed width, so the label does not shift when the
 *     tick replaces the clipboard.
 *   · It degrades to plain text if the Clipboard API is unavailable, rather
 *     than offering an affordance that fails.
 */
export function CaseReference({
  value,
  prefix = "#",
  className,
  tone = "default"
}: {
  value: string;
  prefix?: string;
  className?: string;
  /** `invert` for use on navy or over imagery. */
  tone?: "default" | "invert";
}) {
  const [copied, setCopied] = React.useState(false);
  const [supported, setSupported] = React.useState(true);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => {
    setSupported(
      typeof navigator !== "undefined" && Boolean(navigator.clipboard)
    );
    return () => clearTimeout(timer.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setSupported(false);
    }
  }

  const text = `${prefix}${value}`;

  // No Clipboard API: render the reference plainly rather than a button that
  // silently does nothing.
  if (!supported) {
    return (
      <span className={cn("font-data text-[13px]", className)}>{text}</span>
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy reference"
      className={cn(
        "group inline-flex items-center gap-2 rounded-md px-1.5 py-1 font-data text-[13px] transition-colors",
        tone === "invert"
          ? "text-white hover:bg-white/10"
          : "text-foreground hover:bg-secondary",
        className
      )}
    >
      {text}

      {/* Fixed-width slot so swapping the glyph never nudges the label. */}
      <span className="grid h-3.5 w-3.5 place-items-center">
        {copied ? (
          <Check className="h-3.5 w-3.5 text-success" />
        ) : (
          <Copy
            className={cn(
              "h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60 group-focus-visible:opacity-60",
              tone === "invert" && "text-white"
            )}
          />
        )}
      </span>

      <span aria-live="polite" className="sr-only">
        {copied ? `Reference ${value} copied to clipboard` : ""}
      </span>
    </button>
  );
}
