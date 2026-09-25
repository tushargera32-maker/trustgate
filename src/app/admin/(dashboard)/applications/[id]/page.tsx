import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, FileText, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import { ApplicationStatusManager } from "./status-manager";
import { ApplicationTimeline } from "./timeline";
import { InternalNotesPanel } from "./internal-notes";

export const revalidate = 0;

export default async function ApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requireStaff();

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: {
      client: {
        include: {
          user: { select: { name: true, email: true, phone: true } },
        },
      },
      country: true,
      visaType: true,
      caseOwner: { select: { id: true, name: true, email: true } },
      timelineEntries: {
        orderBy: { occurredAt: "desc" },
        take: 50,
      },
      documents: {
        select: {
          id: true,
          title: true,
          status: true,
          uploadedAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
      payments: {
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
      appointments: {
        select: {
          id: true,
          title: true,
          scheduledAt: true,
          status: true,
        },
        orderBy: { scheduledAt: "desc" },
      },
    },
  });

  if (!application) {
    notFound();
  }

  const staff = await prisma.user.findMany({
    where: {
      role: { not: "CLIENT" },
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      role: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/applications">
            <ArrowLeft className="h-4 w-4" />
            Back to applications
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Case Details
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl">
            {application.reference}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {application.client.user.name} · {application.country?.name}
          </p>
        </div>
        <StatusPill status={application.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ApplicationStatusManager
            applicationId={application.id}
            currentStatus={application.status}
            staff={staff}
            caseOwnerId={application.caseOwnerId}
          />

          <ApplicationTimeline
            applicationId={application.id}
            entries={application.timelineEntries}
            currentStatus={application.status}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Client information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Name</div>
                <div className="font-medium">{application.client.user.name}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="font-medium">{application.client.user.email}</div>
              </div>
              {application.client.user.phone && (
                <div>
                  <div className="text-xs text-muted-foreground">Phone</div>
                  <div className="font-medium">{application.client.user.phone}</div>
                </div>
              )}
              <div>
                <div className="text-xs text-muted-foreground">Visa type</div>
                <div className="font-medium">{application.visaType?.name || "-"}</div>
              </div>
              {application.caseOwner && (
                <div>
                  <div className="text-xs text-muted-foreground">Case owner</div>
                  <div className="font-medium">{application.caseOwner.name}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" />
                Documents ({application.documents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {application.documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No documents yet</p>
              ) : (
                <div className="space-y-2">
                  {application.documents.slice(0, 5).map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate">{doc.title}</span>
                      <StatusPill status={doc.status} hideDot />
                    </div>
                  ))}
                  {application.documents.length > 5 && (
                    <Button variant="link" size="sm" className="h-auto p-0" asChild>
                      <Link href={`/admin/applications/${application.id}/documents`}>
                        View all {application.documents.length} documents
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-4 w-4" />
                Payments ({application.payments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {application.payments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payments yet</p>
              ) : (
                <div className="space-y-2">
                  {application.payments.slice(0, 3).map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>
                        {payment.currency} {payment.amount.toString()}
                      </span>
                      <StatusPill status={payment.status} hideDot />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <InternalNotesPanel
            applicationId={application.id}
            notes={application.internalNotes}
          />
        </div>
      </div>
    </div>
  );
}
