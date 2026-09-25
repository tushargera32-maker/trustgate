import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/ui/status-pill";
import { DocumentUpload } from "@/components/client/document-upload";

export default async function DocumentsPage() {
  const session = await requireSession();

  const documents = await prisma.document.findMany({
    where: { client: { userId: session.user.id } },
    orderBy: { uploadedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Documents
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl">
            Your documents
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload requested documents and track verification status.
          </p>
        </div>
        {/* No page-level upload button: a document is always uploaded against
            a specific request from your case manager, so the action lives on
            each card. A free-floating upload would create orphaned files. */}
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[40vh] flex-col items-center justify-center p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
            <h2 className="mt-4 font-display text-lg">
              No documents yet
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Your counsellor will request documents as needed for your application.
              You&apos;ll be notified by email when action is required.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => {
            return (
              <Card key={doc.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <FileText className="h-8 w-8 text-gold-600" />
                    <StatusPill status={doc.status} />
                  </div>
                  <h3 className="mt-3 font-medium">{doc.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {doc.fileName || "General"}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Uploaded{" "}
                    {doc.uploadedAt
                      ? new Date(doc.uploadedAt).toLocaleDateString()
                      : "Pending"}
                  </p>
                  {doc.reviewerNote && (
                    <p className="mt-3 rounded-md bg-destructive-tint p-2.5 text-[12px] leading-relaxed text-destructive">
                      {doc.reviewerNote}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-2">
                    {/* View only exists once there is something to view. */}
                    {doc.storageKey ? (
                      <Button size="sm" variant="outline" asChild>
                        <Link
                          href={`/api/client/documents/${doc.id}/file`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </Link>
                      </Button>
                    ) : (
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        Awaiting upload
                      </span>
                    )}

                    <DocumentUpload
                      documentId={doc.id}
                      label={doc.storageKey ? "Replace" : "Upload"}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
