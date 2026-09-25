"use client";

import { useState, useTransition } from "react";
import { Calendar, Clock, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createAppointment, cancelAppointment } from "@/lib/actions/appointment.actions";

interface Appointment {
  id: string;
  title: string;
  type: string;
  scheduledAt: Date;
  durationMin: number;
  status: string;
  notes: string | null;
}

interface AppointmentsClientProps {
  appointments: Appointment[];
}

export default function AppointmentsClient({ appointments }: AppointmentsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    type: "consultation",
    scheduledAt: "",
    scheduledTime: "",
    durationMin: "30",
    notes: "",
  });

  const upcoming = appointments.filter(
    (a) => new Date(a.scheduledAt) > new Date() && a.status !== "CANCELLED"
  );
  const past = appointments.filter(
    (a) => new Date(a.scheduledAt) <= new Date() || a.status === "CANCELLED"
  );

  const handleCreate = () => {
    startTransition(async () => {
      if (!formData.title || !formData.scheduledAt || !formData.scheduledTime) {
        toast({
          title: "Validation error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const scheduledAt = new Date(`${formData.scheduledAt}T${formData.scheduledTime}`);

      const result = await createAppointment({
        title: formData.title,
        type: formData.type,
        scheduledAt,
        durationMin: parseInt(formData.durationMin),
        notes: formData.notes || undefined,
      });

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Appointment requested successfully",
        });
        setIsCreateOpen(false);
        setFormData({
          title: "",
          type: "consultation",
          scheduledAt: "",
          scheduledTime: "",
          durationMin: "30",
          notes: "",
        });
        window.location.reload();
      }
    });
  };

  const handleCancel = (id: string) => {
    startTransition(async () => {
      const result = await cancelAppointment(id);

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Appointment cancelled",
        });
        setCancelId(null);
        window.location.reload();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Appointments
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl">Schedule</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Book consultations and track upcoming meetings.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4" /> Request appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request appointment</DialogTitle>
              <DialogDescription>
                Submit a request and our team will confirm the details with you.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Initial consultation"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="call">Phone call</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select
                  value={formData.durationMin}
                  onValueChange={(value) => setFormData({ ...formData, durationMin: value })}
                >
                  <SelectTrigger id="duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific topics you'd like to discuss..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isPending}>
                {isPending ? "Submitting..." : "Submit request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[40vh] flex-col items-center justify-center p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/50" />
            <h2 className="mt-4 font-display text-lg">No appointments yet</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Book your initial consultation to discuss your travel plans and visa requirements
              with a senior counsellor.
            </p>
            <Button onClick={() => setIsCreateOpen(true)} className="mt-6">
              Request appointment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div>
              <h2 className="mb-4 font-display text-base">Upcoming</h2>
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
                          <div className="flex-1">
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
                              <span>
                                {apt.durationMin} min
                              </span>
                              <span className="capitalize">{apt.type}</span>
                            </div>
                            {apt.notes && (
                              <p className="mt-2 text-sm text-muted-foreground">
                                {apt.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusPill status={apt.status} />
                          {apt.status !== "CANCELLED" && apt.status !== "COMPLETED" && (
                            <Dialog open={cancelId === apt.id} onOpenChange={(open) => setCancelId(open ? apt.id : null)}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <X className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Cancel appointment</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to cancel this appointment?
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setCancelId(null)}>
                                    Keep appointment
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleCancel(apt.id)}
                                    disabled={isPending}
                                  >
                                    {isPending ? "Cancelling..." : "Cancel appointment"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
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
