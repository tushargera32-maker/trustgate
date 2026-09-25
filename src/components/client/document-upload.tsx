"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitDocumentUpload } from "@/lib/actions/documents";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

/**
 * Uploads a file against a requested document, then records it via the server
 * action. Two-step on purpose: the binary goes to the upload route, and only
 * the resulting storage key touches the database.
 *
 * Validation runs client-side for a fast response *and* server-side in the
 * action, because a client-side check is a convenience, not a control.
 */
export function DocumentUpload({
  documentId,
  label = "Upload"
}: {
  documentId: string;
  label?: string;
}) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!ACCEPTED.includes(file.type)) {
      setError("Upload a PDF, JPG, PNG or WebP file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That file is over 10MB. Please compress it and try again.");
      return;
    }

    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("documentId", documentId);

      const upload = await fetch("/api/client/documents/upload", {
        method: "POST",
        body
      });

      const payload = (await upload.json()) as {
        storageKey?: string;
        error?: string;
      };

      if (!upload.ok || !payload.storageKey) {
        // Surface the server's reason (wrong type, too large) rather than a
        // generic failure the user cannot act on.
        setError(payload.error ?? "The file could not be uploaded.");
        return;
      }

      const result = await submitDocumentUpload({
        documentId,
        storageKey: payload.storageKey,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      // Server components hold this data, so a refresh is what re-renders the
      // list with the new status.
      router.refresh();
    } catch {
      setError("Something went wrong during the upload. Please try again.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={ACCEPTED.join(",")}
        onChange={handleFile}
        disabled={busy}
        aria-label={`${label} document`}
      />

      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={busy}
        aria-busy={busy}
        onClick={() => inputRef.current?.click()}
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading…
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            {label}
          </>
        )}
      </Button>

      {error && (
        <p
          role="alert"
          className="flex items-start gap-1.5 text-right text-[12px] leading-snug text-destructive"
        >
          <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
