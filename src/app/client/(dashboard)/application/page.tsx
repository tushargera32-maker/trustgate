import Link from "next/link";
import { ArrowUpRight, FileText, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function ApplicationPage() {
  const session = await requireSession();

  const application = await prisma.application.findFirst({
    where: {
      client: {
        userId: session.user.id,
      },
    },
    include: {
      visaType: true,
      country: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!application) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <FileText className="h-12 w-12 text-muted-foreground/50" />
        <h2 className="mt-4 font-display text-xl">No active application</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          You don&apos;t have an active application yet. Contact your counsellor to get started.
        </p>
        <Button asChild className="mt-6">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    );
  }

  const statusOrder = [
    "CONSULTATION_COMPLETED",
    "DOCUMENTS_REQUESTED",
    "DOCUMENTS_RECEIVED",
    "DOCUMENTS_VERIFIED",
    "APPLICATION_PREPARED",
    "APPLICATION_SUBMITTED",
    "BIOMETRICS",
    "ADDITIONAL_INFO_REQUESTED",
    "DECISION_PENDING",
    "DECISION_RECEIVED",
  ];

  const currentIndex = statusOrder.indexOf(application.status);
  const progress = currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;

  const statusLabels: Record<string, string> = {
    CONSULTATION_COMPLETED: "Consultation Completed",
    DOCUMENTS_REQUESTED: "Documents Requested",
    DOCUMENTS_RECEIVED: "Documents Received",
    DOCUMENTS_VERIFIED: "Documents Verified",
    APPLICATION_PREPARED: "Application Prepared",
    APPLICATION_SUBMITTED: "Application Submitted",
    BIOMETRICS: "Biometrics / VAC",
    ADDITIONAL_INFO_REQUESTED: "Additional Information Requested",
    DECISION_PENDING: "Decision Pending",
    DECISION_RECEIVED: "Decision Received",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            My application
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl">
            {application.visaType?.name || "Visa Application"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Reference{" "}
            <span className="font-mono text-foreground">
              {application.reference}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/client/documents">
              <FileText className="h-4 w-4" /> Documents
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/client/messages">
              <ArrowUpRight className="h-4 w-4" /> Message counsellor
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Current status
              </div>
              <div className="mt-1 font-display text-lg">
                {statusLabels[application.status] || application.status}
              </div>
            </div>
            <Badge variant="warning">{Math.round(progress)}% complete</Badge>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 font-display text-base">
              <MapPin className="h-4 w-4 text-gold-600" />
              Trip details
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Destination" value={application.country?.name || "-"} />
              <Row label="Visa type" value={application.visaType?.name || "-"} />
            </dl>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 font-display text-base">
              <Briefcase className="h-4 w-4 text-gold-600" />
              Application progress
            </h2>
            <div className="mt-4 space-y-3">
              {statusOrder.slice(0, currentIndex + 2).map((status, i) => {
                const isComplete = i < currentIndex;
                const isCurrent = i === currentIndex;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <div
                      className={
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold " +
                        (isComplete
                          ? "bg-teal-500/15 text-teal-600"
                          : isCurrent
                          ? "bg-gold-500/15 text-gold-700"
                          : "bg-secondary text-muted-foreground")
                      }
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 text-sm">
                      <div className={isCurrent ? "font-medium" : ""}>
                        {statusLabels[status]}
                      </div>
                    </div>
                    {isComplete && (
                      <span className="text-xs text-teal-600">✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-display text-base">Timeline</h2>
          <div className="mt-4 space-y-4">
            <TimelineItem
              date={application.createdAt}
              title="Application created"
              description="Your case was opened and assigned to a counsellor."
            />
            {application.submittedAt && (
              <TimelineItem
                date={application.submittedAt}
                title="Application submitted"
                description="Your application was submitted to the relevant authority."
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function TimelineItem({
  date,
  title,
  description,
}: {
  date: Date;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 border-l-2 border-border pl-4">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{title}</h3>
          <time className="text-xs text-muted-foreground">
            {new Date(date).toLocaleDateString()}
          </time>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
