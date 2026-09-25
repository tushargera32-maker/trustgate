import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/ui/status-pill";

export default async function AppointmentsPage() {
  const session = await requireSession();

  const appointments = await prisma.appointment.findMany({
    where: { client: { userId: session.user.id } },
    orderBy: { scheduledAt: "desc" },
  });

  const upcoming = appointments.filter(
    (a) => new Date(a.scheduledAt) > new Date() && a.status !== "CANCELLED"
  );
  const past = appointments.filter(
    (a) => new Date(a.scheduledAt) <= new Date() || a.status === "CANCELLED"
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Appointments
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl">
            Schedule
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Book consultations and track upcoming meetings.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/contact">
            <Calendar className="h-4 w-4" /> Book consultation
          </Link>
        </Button>
      </div>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[40vh] flex-col items-center justify-center p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/50" />
            <h2 className="mt-4 font-display text-lg">
              No appointments yet
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Book your initial consultation to discuss your travel plans and
              visa requirements with a senior counsellor.
            </p>
            <Button asChild className="mt-6">
              <Link href="/contact">Book now</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div>
              <h2 className="mb-4 font-display text-base">
                Upcoming
              </h2>
              <div className="space-y-3">
                {upcoming.map((apt) => (
                  <Card key={apt.id}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-gold-500/10 text-xs font-semibold text-gold-700">
                            <div className="text-lg leading-none">
                              {new Date(apt.scheduledAt).getDate()}
                            </div>
                            <div className="mt-1 uppercase leading-none opacity-70">
                              {new Date(apt.scheduledAt).toLocaleString("en-US", {
                                month: "short",
                              })}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-display text-base">
                              {apt.title || "Consultation"}
                            </h3>
                            <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(apt.scheduledAt).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            {apt.notes && (
                              <p className="mt-2 text-sm text-muted-foreground">
                                {apt.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <StatusPill status={apt.status} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 className="mb-4 font-display text-base">Past</h2>
              <div className="space-y-3">
                {past.slice(0, 5).map((apt) => (
                  <Card key={apt.id}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">
                            {apt.title || "Consultation"}
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(apt.scheduledAt).toLocaleDateString()} at{" "}
                            {new Date(apt.scheduledAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <StatusPill status={apt.status} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
