import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminAppointmentsPage() {
  const today = [
    { time: "10:30", title: "Decision update - Priya S.", who: "Arjun M." },
    { time: "12:00", title: "Eligibility walkthrough - Hassan", who: "Maya K." },
    { time: "16:00", title: "Pre-landing briefing - Rohan", who: "Settlement" }
  ];
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Operations
        </p>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl">
          Appointments
        </h1>
      </div>
      <Card>
        <CardContent className="p-6">
          <h2 className="font-display text-base">Today</h2>
          <ul className="mt-4 space-y-3">
            {today.map((a, i) => (
              <li
                key={i}
                className="flex items-center gap-4 rounded-lg border border-border/60 p-4"
              >
                <span className="font-mono text-sm text-muted-foreground">
                  {a.time}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.who}</div>
                </div>
                <Badge variant="success">Confirmed</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}