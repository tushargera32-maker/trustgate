import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  MessageSquare,
  CalendarClock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DEMO_CLIENT_CASE } from "@/lib/demo-cases";

export default function ClientDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Welcome back
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl">
            {DEMO_CLIENT_CASE.clientName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {DEMO_CLIENT_CASE.service} · {DEMO_CLIENT_CASE.route} · Ref{" "}
            <span className="font-mono">{DEMO_CLIENT_CASE.reference}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/client/messages">
              <MessageSquare className="h-4 w-4" /> Message counsellor
            </Link>
          </Button>
          <Button asChild size="sm" variant="gold">
            <Link href="/client/documents">
              <Upload className="h-4 w-4" /> Upload document
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="Case progress"
          value={`${DEMO_CLIENT_CASE.progress}%`}
          icon={<FileText className="h-4 w-4" />}
          tone="accent"
        />
        <Kpi
          label="Documents verified"
          value="14 / 18"
          icon={<CheckCircle2 className="h-4 w-4" />}
          tone="success"
        />
        <Kpi
          label="Pending uploads"
          value="3"
          icon={<AlertCircle className="h-4 w-4" />}
          tone="warning"
        />
        <Kpi
          label="Next appointment"
          value="Apr 22 · 10:30"
          icon={<CalendarClock className="h-4 w-4" />}
          tone="default"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Current status
                </div>
                <h3 className="mt-1 font-display text-xl">
                  {DEMO_CLIENT_CASE.currentStatus}
                </h3>
              </div>
              <Badge variant="success">On track</Badge>
            </div>
            <div className="mt-6">
              <Progress value={DEMO_CLIENT_CASE.progress} tone="accent" showLabel />
            </div>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2">
              {DEMO_CLIENT_CASE.timeline.map((s) => (
                <li
                  key={s.status}
                  className="flex items-center gap-3 rounded-lg border border-border/60 px-4 py-3"
                >
                  <span
                    className={
                      s.done
                        ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-teal-600"
                        : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground"
                    }
                  >
                    {s.done ? "✓" : <Clock className="h-3.5 w-3.5" />}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{s.status}</div>
                    <div className="text-xs text-muted-foreground">{s.date}</div>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base">
                Action items
              </h3>
              <Badge variant="warning">3 pending</Badge>
            </div>
            <ul className="mt-5 space-y-3">
              {[
                {
                  t: "Upload updated bank statement",
                  d: "Requested Apr 14 · Due Apr 21",
                  icon: Upload
                },
                {
                  t: "Re-upload employment letter (rejected)",
                  d: "Reason: missing signature",
                  icon: AlertCircle
                },
                {
                  t: "Confirm travel history",
                  d: "Form requires confirmation",
                  icon: FileText
                }
              ].map((a) => (
                <li
                  key={a.t}
                  className="flex items-start gap-3 rounded-lg border border-border/60 p-3.5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gold-500/10 text-gold-700">
                    <a.icon className="h-4 w-4" />
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium leading-tight">{a.t}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {a.d}
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
            <Button asChild className="mt-5 w-full" size="sm">
              <Link href="/client/documents">Open document centre</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-display text-base">
              Recent messages
            </h3>
            <ul className="mt-4 space-y-3">
              {[
                {
                  from: `${DEMO_CLIENT_CASE.counsellor} · Counsellor`,
                  body: "Biometrics enrolled at the visa centre. Nothing further needed from you while we wait.",
                  time: "2h ago"
                },
                {
                  from: "Trust Gate",
                  body: "Document 'Employment Letter' was rejected. See notes.",
                  time: "1d ago"
                }
              ].map((m, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-border/60 p-4"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">
                      {m.from}
                    </span>
                    <span className="text-muted-foreground">{m.time}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {m.body}
                  </p>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-4 w-full" size="sm" variant="outline">
              <Link href="/client/messages">Open messages</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-display text-base">
              Upcoming appointments
            </h3>
            <ul className="mt-4 space-y-3">
              {[
                {
                  t: "Decision update call",
                  d: "Apr 22 · 10:30 IST · 30 min",
                  who: DEMO_CLIENT_CASE.counsellor
                },
                {
                  t: "Post-decision debrief",
                  d: "Scheduled once the outcome arrives",
                  who: DEMO_CLIENT_CASE.counsellor
                }
              ].map((a, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 rounded-lg border border-border/60 p-4"
                >
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <span className="text-[10px] uppercase">Apr</span>
                    <span className="font-display text-base leading-none">
                      22
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{a.t}</div>
                    <div className="text-xs text-muted-foreground">
                      {a.d} · {a.who}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        Demo case shown for layout. Live data requires the client portal
        integration described in the completion notes.
      </p>
    </div>
  );
}

function Kpi({
  label,
  value,
  icon,
  tone
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: "default" | "accent" | "success" | "warning";
}) {
  const color =
    tone === "accent"
      ? "bg-gold-500/10 text-gold-700 ring-gold-500/20"
      : tone === "success"
        ? "bg-teal-500/10 text-teal-700 ring-teal-500/20"
        : tone === "warning"
          ? "bg-gold-500/10 text-gold-800 ring-gold-500/30"
          : "bg-secondary text-foreground ring-border";
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg ring-1 ${color}`}
        >
          {icon}
        </span>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-0.5 font-display text-xl">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}