import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Filter, Download } from "lucide-react";
import { LEAD_STAGES } from "@/lib/constants";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/ui/status-pill";

// Add revalidation for faster page loads
export const revalidate = 30; // Revalidate every 30 seconds

const STAGES = ["All", ...LEAD_STAGES];

export default async function LeadsPage() {
  await requireStaff();

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  });

  const leadsByStage = STAGES.map((stage) => ({
    stage,
    leads: stage === "All" ? leads : leads.filter((l) => l.stage === stage),
    count: stage === "All" ? leads.length : leads.filter((l) => l.stage === stage).length
  }));

  const sourceLabels: Record<string, string> = {
    WEBSITE_CONTACT: "Contact Form",
    BOOKING: "Apply Form",
    ELIGIBILITY_FORM: "Eligibility Checker",
    REFERRAL: "Referral",
    DIRECT: "Direct"
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Pipeline
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl">
            Leads CRM
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every website enquiry, eligibility triage and booking - in one pipeline.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" /> New lead
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total leads", value: leads.length },
          { label: "New this week", value: leads.filter(l => new Date(l.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length },
          { label: "Interested", value: leads.filter(l => l.stage === "INTERESTED").length },
          { label: "Converted", value: leads.filter(l => l.stage === "CONVERTED").length }
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

      <Tabs defaultValue="All">
        <TabsList>
          {STAGES.map((stage) => {
            const count = leadsByStage.find((s) => s.stage === stage)?.count || 0;
            return (
              <TabsTrigger key={stage} value={stage}>
                {stage} {count > 0 && `(${count})`}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {STAGES.map((stage) => {
          const stageLeads = leadsByStage.find((s) => s.stage === stage)?.leads || [];
          return (
            <TabsContent key={stage} value={stage}>
              <Card>
                <CardContent className="p-4 sm:p-6">
                  {stageLeads.length === 0 ? (
                    <div className="flex min-h-[30vh] items-center justify-center text-center">
                      <div>
                        <p className="font-display text-base">
                          No leads in {stage === "All" ? "pipeline" : stage}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          New leads appear here as they come in from the website.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-border/60">
                      <table className="w-full text-sm">
                        <thead className="bg-secondary/30 text-xs uppercase tracking-wider text-muted-foreground">
                          <tr>
                            <th className="h-11 px-4 text-left font-semibold">Name</th>
                            <th className="h-11 px-4 text-left font-semibold">Contact</th>
                            <th className="h-11 px-4 text-left font-semibold">Interest</th>
                            <th className="h-11 px-4 text-left font-semibold">Source</th>
                            <th className="h-11 px-4 text-left font-semibold">Stage</th>
                            <th className="h-11 px-4 text-left font-semibold">Created</th>
                            <th className="h-11 px-4 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {stageLeads.map((lead) => (
                            <tr key={lead.id} className="transition-colors hover:bg-secondary/20">
                              <td className="px-4 py-3 font-medium">{lead.fullName}</td>
                              <td className="px-4 py-3 text-muted-foreground">
                                <div className="text-xs">{lead.email}</div>
                                {lead.phone && (
                                  <div className="text-xs">{lead.phone}</div>
                                )}
                              </td>
                              <td className="px-4 py-3 text-xs">
                                {lead.countryOfInterest && (
                                  <div>{lead.countryOfInterest}</div>
                                )}
                                {lead.visaTypeInterest && (
                                  <div className="text-muted-foreground">
                                    {lead.visaTypeInterest}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <Badge variant="outline" className="text-xs">
                                  {sourceLabels[lead.source] || lead.source}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                <StatusPill status={lead.stage} />
                              </td>
                              <td className="px-4 py-3 text-xs text-muted-foreground">
                                {new Date(lead.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button size="sm" variant="outline">
                                  View
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
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
