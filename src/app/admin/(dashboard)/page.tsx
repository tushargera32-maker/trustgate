import Link from "next/link";
import {
  Users,
  FileText,
  Folder,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/db";
import * as React from "react";

// Faster revalidation
export const revalidate = 60;

async function getStats() {
  const now = Date.now();
  const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const [
    totalLeads,
    newLeadsThisWeek,
    totalApplications,
    activeApplications,
    totalDocuments,
    pendingDocuments,
    totalUsers,
    recentLeads,
    recentApplications
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: oneWeekAgo } } }),
    prisma.application.count(),
    prisma.application.count({
      where: {
        status: {
          not: "DECISION_RECEIVED"
        }
      }
    }),
    prisma.document.count(),
    prisma.document.count({
      where: { status: { in: ["REQUESTED", "UPLOADED", "UNDER_REVIEW"] } }
    }),
    prisma.user.count(),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.application.findMany({
      include: {
        client: { include: { user: true } },
        country: true
      },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);

  return {
    totalLeads,
    newLeadsThisWeek,
    totalApplications,
    activeApplications,
    totalDocuments,
    pendingDocuments,
    totalUsers,
    recentLeads,
    recentApplications
  };
}

export default async function AdminDashboardPage() {
  await requireStaff();
  const stats = await getStats();

  const statCards = [
    {
      label: "Total Leads",
      value: stats.totalLeads,
      change: `+${stats.newLeadsThisWeek} this week`,
      icon: TrendingUp,
      href: "/admin/leads",
      color: "text-ink-600",
      bgColor: "bg-ink-500/10"
    },
    {
      label: "Active Cases",
      value: stats.activeApplications,
      change: `${stats.totalApplications} total`,
      icon: FileText,
      href: "/admin/applications",
      color: "text-accent-ink",
      bgColor: "bg-gold-500/10"
    },
    {
      label: "Pending Docs",
      value: stats.pendingDocuments,
      change: `${stats.totalDocuments} total`,
      icon: Folder,
      href: "/admin/documents",
      color: "text-gold-600",
      bgColor: "bg-gold-500/10"
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      change: "All accounts",
      icon: Users,
      href: "/admin/users",
      color: "text-teal-600",
      bgColor: "bg-teal-500/10"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your visa consultancy operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="group transition-all hover:shadow-md hover:border-primary/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-2 font-display text-3xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stat.change}
                    </p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor} ${stat.color} transition-transform group-hover:scale-110`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg font-semibold">
              Recent Leads
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/leads">
                View all <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentLeads.length === 0 ? (
              <div className="flex min-h-[200px] items-center justify-center text-center">
                <div>
                  <Users className="mx-auto h-12 w-12 text-muted-foreground/40" />
                  <p className="mt-4 text-sm font-medium text-muted-foreground">
                    No leads yet
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {stats.recentLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href="/admin/leads"
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{lead.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {lead.email}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-3 shrink-0 text-xs">
                      {lead.stage.replace(/_/g, " ")}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg font-semibold">
              Recent Applications
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/applications">
                View all <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentApplications.length === 0 ? (
              <div className="flex min-h-[200px] items-center justify-center text-center">
                <div>
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/40" />
                  <p className="mt-4 text-sm font-medium text-muted-foreground">
                    No applications yet
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {stats.recentApplications.map((app) => {
                  const statusIcon =
                    app.status === "DECISION_RECEIVED"
                      ? CheckCircle2
                      : app.status === "DOCUMENTS_REQUESTED"
                      ? AlertCircle
                      : Clock;
                  return (
                    <Link
                      key={app.id}
                      href="/admin/applications"
                      className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                        {React.createElement(statusIcon, {
                          className: "h-4 w-4 text-muted-foreground"
                        })}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">
                          {app.client.user.name || app.client.user.email}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {app.country?.name} • {app.reference}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto justify-start py-4" asChild>
              <Link href="/admin/leads">
                <TrendingUp className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Manage Leads</div>
                  <div className="text-xs text-muted-foreground">CRM Pipeline</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto justify-start py-4" asChild>
              <Link href="/admin/applications">
                <FileText className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Applications</div>
                  <div className="text-xs text-muted-foreground">Track Cases</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto justify-start py-4" asChild>
              <Link href="/admin/services">
                <FileText className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Services</div>
                  <div className="text-xs text-muted-foreground">Manage Content</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto justify-start py-4" asChild>
              <Link href="/admin/blog">
                <FileText className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Blog</div>
                  <div className="text-xs text-muted-foreground">Create Posts</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
