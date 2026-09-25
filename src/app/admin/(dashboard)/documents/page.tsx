import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, CheckCircle2, XCircle } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/ui/status-pill";

export default async function DocumentsAdminPage() {
  await requireStaff();

  const documents = await prisma.document.findMany({
    include: {
      client: {
        include: {
          user: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  const stats = {
    requested: documents.filter(d => d.status === "REQUESTED").length,
    underReview: documents.filter(d => d.status === "UNDER_REVIEW").length,
    verified: documents.filter(d => d.status === "VERIFIED").length,
    rejected: documents.filter(d => d.status === "REJECTED").length
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Queue
        </p>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl">
          Document Review Queue
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review, verify, and manage client document submissions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Requested
            </div>
            <div className="mt-1 font-display text-2xl text-gold-600">
              {stats.requested}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Under Review
            </div>
            <div className="mt-1 font-display text-2xl text-accent-ink">
              {stats.underReview}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Verified
            </div>
            <div className="mt-1 font-display text-2xl text-teal-600">
              {stats.verified}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Rejected
            </div>
            <div className="mt-1 font-display text-2xl text-ochre-600">
              {stats.rejected}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          {documents.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center text-center">
              <div>
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h2 className="mt-4 font-display text-lg">No documents yet</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Documents will appear here as clients upload them.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border/60">
              <table className="w-full text-sm">
                <thead className="bg-secondary/30 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="h-11 px-4 text-left font-semibold">Client</th>
                    <th className="h-11 px-4 text-left font-semibold">Document</th>
                    <th className="h-11 px-4 text-left font-semibold">Uploaded</th>
                    <th className="h-11 px-4 text-left font-semibold">Status</th>
                    <th className="h-11 px-4 text-left font-semibold">Note</th>
                    <th className="h-11 px-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="transition-colors hover:bg-secondary/20">
                      <td className="px-4 py-3 font-medium">
                        {doc.client.user.name || doc.client.user.email}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <div>{doc.title}</div>
                        {doc.fileName && (
                          <div className="text-xs text-muted-foreground">{doc.fileName}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {doc.uploadedAt
                          ? new Date(doc.uploadedAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={doc.status} />
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {doc.reviewerNote || "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          {doc.uploadedAt && (
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3" /> View
                            </Button>
                          )}
                          {doc.status === "UPLOADED" && (
                            <Button size="sm">
                              <CheckCircle2 className="h-3 w-3" /> Verify
                            </Button>
                          )}
                          {doc.status === "UNDER_REVIEW" && (
                            <Button size="sm" variant="outline">
                              <XCircle className="h-3 w-3" /> Reject
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
