"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveStatus } from "@/components/ui/status-pill";
import { cn } from "@/lib/utils";
import type { ActionResult } from "@/lib/actions/core";

/**
 * StatusSelect — changes a record's status through a server action.
 *
 * Optimistic on purpose: a case manager working a queue should not wait on a
 * round trip to a remote database for every change. If the action fails the
 * value snaps back and the error is shown, so the UI never lies about what
 * was saved.
 */
export function StatusSelect<S extends string>({
  id,
  value,
  options,
  action,
  className
}: {
  id: string;
  value: S;
  options: readonly S[];
  action: (input: { id: string; status: S }) => Promise<ActionResult<unknown>>;
  className?: string;
}) {
  const router = useRouter();
  const [current, setCurrent] = React.useState<S>(value);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Keep in step when the server sends fresh data after a refresh.
  React.useEffect(() => setCurrent(value), [value]);

  async function change(next: S) {
    const previous = current;
    setCurrent(next);
    setBusy(true);
    setError(null);

    const result = await action({ id, status: next });

    if (!result.ok) {
      setCurrent(previous); // roll back — never show a change that did not save
      setError(result.error);
    } else {
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="relative">
        <select
          value={current}
          disabled={busy}
          onChange={(e) => change(e.target.value as S)}
          aria-label="Change status"
          aria-busy={busy}
          className={cn(
            "w-full appearance-none rounded-md border border-border bg-card py-1.5 pl-2.5 pr-8",
            "font-mono text-[10px] uppercase tracking-[0.1em]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            busy && "opacity-60"
          )}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {resolveStatus(option).label}
            </option>
          ))}
        </select>

        {busy && (
          <Loader2 className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {error && (
        <p role="alert" className="text-[11px] leading-snug text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * MessageComposer — posts to the shared sendMessage action.
 *
 * Enter sends, Shift+Enter breaks the line. The draft is only cleared once the
 * server confirms, so a failed send never loses what someone typed.
 */
export function MessageComposer({
  applicationId,
  action,
  placeholder = "Type your message…"
}: {
  applicationId?: string | null;
  action: (input: {
    applicationId?: string | null;
    body: string;
  }) => Promise<ActionResult<unknown>>;
  placeholder?: string;
}) {
  const router = useRouter();
  const [body, setBody] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function send() {
    const trimmed = body.trim();
    if (!trimmed || busy) return;

    setBusy(true);
    setError(null);

    const result = await action({ applicationId, body: trimmed });

    if (!result.ok) {
      setError(result.error); // draft is preserved
    } else {
      setBody("");
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <div className="border-t border-border p-3">
      <div className="flex items-end gap-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          rows={2}
          placeholder={placeholder}
          disabled={busy}
          aria-label="Message"
          className="min-h-[44px] flex-1 resize-none rounded-md border border-border bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button
          type="button"
          onClick={() => void send()}
          disabled={busy || body.trim().length === 0}
          aria-busy={busy}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="sr-only sm:not-sr-only">Send</span>
        </Button>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-2 flex items-start gap-1.5 text-[12px] text-destructive"
        >
          <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
          {error}
        </p>
      )}

      <p className="mt-1.5 text-[11px] text-muted-foreground">
        Enter to send · Shift+Enter for a new line
      </p>
    </div>
  );
}
