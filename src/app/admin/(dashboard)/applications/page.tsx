import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Filter, Download } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/ui/status-pill";

// Add revalidation for faster page loads
export const revalidate = 30; // Revalidate every 30 seconds

export default async function ApplicationsPage() {
  await requireStaff();

  const applications = await prisma.application.findMany({
    include: {
      client: {
        include: {
          user: { select: { name: true, email: true } },
        },
      },
      country: true,
      visaType: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Cases
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl">
            Applications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Active cases, documents, submission status and outcomes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" /> New case
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active cases", value: applications.length },
          { label: "Pending decision", value: applications.filter(a => a.status === "DECISION_PENDING").length },
          { label: "Awaiting documents", value: applications.filter(a => a.status === "DOCUMENTS_REQUESTED").length },
          { label: "Submitted", value: applications.filter(a => a.submittedAt !== null).length },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </div>
              <div className="mt-1 font-display text-2xl">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          {applications.length === 0 ? (
            <div className="flex min-h-[40vh] items-center justify-center text-center">
              <div>
                <p className="font-display text-base">No applications yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Active cases appear here once leads convert and cases are opened.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border/60">
              <table className="w-full text-sm">
                <thead className="bg-secondary/30 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="h-11 px-4 text-left font-semibold">Reference</th>
                    <th className="h-11 px-4 text-left font-semibold">Client</th>
                    <th className="h-11 px-4 text-left font-semibold">Visa type</th>
                    <th className="h-11 px-4 text-left font-semibold">Destination</th>
                    <th className="h-11 px-4 text-left font-semibold">Status</th>
                    <th className="h-11 px-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {applications.map((app) => (
                    <tr key={app.id} className="transition-colors hover:bg-secondary/20">
                      <td className="px-4 py-3 font-mono text-xs font-medium">
                        {app.reference}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{app.client.user.name}</div>
                        <div className="text-xs text-muted-foreground">{app.client.user.email}</div>
                      </td>
                      <td className="px-4 py-3">{app.visaType?.name || "-"}</td>
                      <td className="px-4 py-3">{app.country?.name || "-"}</td>
                      <td className="px-4 py-3">
                        <StatusPill status={app.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="outline">
                          Manage
                        </Button>
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
