"use client";

import { useState, useTransition } from "react";
import { Calendar, Clock, Plus, Check, X, Edit, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  createAppointment,
  updateAppointment,
  cancelAppointment,
  confirmAppointment,
  completeAppointment,
  deleteAppointment,
} from "@/lib/actions/appointment.actions";

interface Appointment {
  id: string;
  clientId: string | null;
  applicationId: string | null;
  staffId: string | null;
  title: string;
  type: string;
  scheduledAt: Date;
  durationMin: number;
  status: string;
  notes: string | null;
  client: {
    id: string;
    fullName: string;
    user: {
      name: string | null;
      email: string;
    };
  } | null;
  application: {
    reference: string;
  } | null;
}

interface Client {
  id: string;
  fullName: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface Staff {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface AdminAppointmentsClientProps {
  appointments: Appointment[];
  clients: Client[];
  staff: Staff[];
}

export default function AdminAppointmentsClient({
  appointments,
  clients,
  staff,
}: AdminAppointmentsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    clientId: "",
    staffId: "",
    title: "",
    type: "consultation",
    scheduledAt: "",
    scheduledTime: "",
    durationMin: "30",
    notes: "",
  });

  const resetForm = () => {
    setFormData({
      clientId: "",
      staffId: "",
      title: "",
      type: "consultation",
      scheduledAt: "",
      scheduledTime: "",
      durationMin: "30",
      notes: "",
    });
  };

  const loadEditForm = (apt: Appointment) => {
    const date = new Date(apt.scheduledAt);
    const dateStr = date.toISOString().split("T")[0];
    const timeStr = date.toTimeString().slice(0, 5);

    setFormData({
      clientId: apt.clientId || "",
      staffId: apt.staffId || "",
      title: apt.title,
      type: apt.type,
      scheduledAt: dateStr,
      scheduledTime: timeStr,
      durationMin: apt.durationMin.toString(),
      notes: apt.notes || "",
    });
    setEditingId(apt.id);
  };

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
        clientId: formData.clientId || undefined,
        staffId: formData.staffId || undefined,
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
          description: "Appointment created successfully",
        });
        setIsCreateOpen(false);
        resetForm();
        window.location.reload();
      }
    });
  };

  const handleUpdate = () => {
    if (!editingId) return;

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

      const result = await updateAppointment(editingId, {
        title: formData.title,
        type: formData.type,
        scheduledAt,
        durationMin: parseInt(formData.durationMin),
        staffId: formData.staffId || undefined,
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
          description: "Appointment updated successfully",
        });
        setEditingId(null);
        resetForm();
        window.location.reload();
      }
    });
  };

  const handleConfirm = (id: string) => {
    startTransition(async () => {
      const result = await confirmAppointment(id);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({ title: "Success", description: "Appointment confirmed" });
        window.location.reload();
      }
    });
  };

  const handleComplete = (id: string) => {
    startTransition(async () => {
      const result = await completeAppointment(id);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({ title: "Success", description: "Appointment marked as completed" });
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
        toast({ title: "Success", description: "Appointment cancelled" });
        window.location.reload();
      }
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;

    startTransition(async () => {
      const result = await deleteAppointment(deleteId);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({ title: "Success", description: "Appointment deleted" });
        setDeleteId(null);
        window.location.reload();
      }
    });
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter === "all") return true;
    return apt.status === statusFilter;
  });

  const today = filteredAppointments.filter((apt) => {
    const aptDate = new Date(apt.scheduledAt);
    const now = new Date();
    return (
      aptDate.toDateString() === now.toDateString() &&
      apt.status !== "CANCELLED" &&
      apt.status !== "COMPLETED"
    );
  });

  const upcoming = filteredAppointments.filter((apt) => {
    const aptDate = new Date(apt.scheduledAt);
    const now = new Date();
    return (
      aptDate > now &&
      aptDate.toDateString() !== now.toDateString() &&
      apt.status !== "CANCELLED" &&
      apt.status !== "COMPLETED"
    );
  });

  const past = filteredAppointments.filter((apt) => {
    const aptDate = new Date(apt.scheduledAt);
    const now = new Date();
    return aptDate < now || apt.status === "CANCELLED" || apt.status === "COMPLETED";
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "success" | "warning" | "destructive"> = {
      REQUESTED: "warning",
      CONFIRMED: "success",
      COMPLETED: "default",
      CANCELLED: "destructive",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Operations
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl">Appointments</h1>
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="REQUESTED">Requested</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4" /> Create appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create appointment</DialogTitle>
                <DialogDescription>Schedule a new appointment for a client</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client">Client</Label>
                    <Select
                      value={formData.clientId}
                      onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                    >
                      <SelectTrigger id="client">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.fullName} ({client.user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="staff">Assigned staff (optional)</Label>
                    <Select
                      value={formData.staffId}
                      onValueChange={(value) => setFormData({ ...formData, staffId: value })}
                    >
                      <SelectTrigger id="staff">
                        <SelectValue placeholder="Select staff" />
                      </SelectTrigger>
                      <SelectContent>
                        {staff.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name || s.email} ({s.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Initial consultation"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
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
                  <Label htmlFor="duration">Duration</Label>
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
                    placeholder="Additional details..."
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
                  {isPending ? "Creating..." : "Create appointment"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {today.length > 0 && (
        <div>
          <h2 className="mb-4 font-display text-lg">Today</h2>
          <div className="space-y-3">
            {today.map((apt) => (
              <AppointmentCard
                key={apt.id}
                apt={apt}
                onEdit={() => loadEditForm(apt)}
                onConfirm={() => handleConfirm(apt.id)}
                onComplete={() => handleComplete(apt.id)}
                onCancel={() => handleCancel(apt.id)}
                onDelete={() => setDeleteId(apt.id)}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <h2 className="mb-4 font-display text-lg">Upcoming</h2>
          <div className="space-y-3">
            {upcoming.slice(0, 10).map((apt) => (
              <AppointmentCard
                key={apt.id}
                apt={apt}
                onEdit={() => loadEditForm(apt)}
                onConfirm={() => handleConfirm(apt.id)}
                onComplete={() => handleComplete(apt.id)}
                onCancel={() => handleCancel(apt.id)}
                onDelete={() => setDeleteId(apt.id)}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="mb-4 font-display text-lg">Past</h2>
          <div className="space-y-3">
            {past.slice(0, 10).map((apt) => (
              <AppointmentCard
                key={apt.id}
                apt={apt}
                onEdit={() => loadEditForm(apt)}
                onConfirm={() => handleConfirm(apt.id)}
                onComplete={() => handleComplete(apt.id)}
                onCancel={() => handleCancel(apt.id)}
                onDelete={() => setDeleteId(apt.id)}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        </div>
      )}

      {filteredAppointments.length === 0 && (
        <Card>
          <CardContent className="flex min-h-[40vh] flex-col items-center justify-center p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/50" />
            <h2 className="mt-4 font-display text-lg">No appointments found</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {statusFilter !== "all"
                ? "Try adjusting your filter"
                : "Create an appointment to get started"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingId} onOpenChange={(open) => { if (!open) { setEditingId(null); resetForm(); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit appointment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="edit-staff">Assigned staff</Label>
              <Select
                value={formData.staffId}
                onValueChange={(value) => setFormData({ ...formData, staffId: value })}
              >
                <SelectTrigger id="edit-staff">
                  <SelectValue placeholder="Select staff" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name || s.email} ({s.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="call">Phone call</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-duration">Duration</Label>
              <Select
                value={formData.durationMin}
                onValueChange={(value) => setFormData({ ...formData, durationMin: value })}
              >
                <SelectTrigger id="edit-duration">
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
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditingId(null); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete appointment</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The appointment will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AppointmentCard({
  apt,
  onEdit,
  onConfirm,
  onComplete,
  onCancel,
  onDelete,
  getStatusBadge,
}: {
  apt: Appointment;
  onEdit: () => void;
  onConfirm: () => void;
  onComplete: () => void;
  onCancel: () => void;
  onDelete: () => void;
  getStatusBadge: (status: string) => JSX.Element;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4 flex-1">
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-gold-500/10 text-xs font-semibold text-gold-700">
              <div className="text-lg leading-none">
                {new Date(apt.scheduledAt).getDate()}
              </div>
              <div className="mt-1 uppercase leading-none opacity-70">
                {new Date(apt.scheduledAt).toLocaleString("en-US", { month: "short" })}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-display text-base">{apt.title}</h3>
                {getStatusBadge(apt.status)}
              </div>
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(apt.scheduledAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span>{apt.durationMin} min</span>
                <span className="capitalize">{apt.type}</span>
              </div>
              {apt.client && (
                <p className="mt-2 text-sm">
                  <strong>Client:</strong> {apt.client.fullName} ({apt.client.user.email})
                </p>
              )}
              {apt.notes && (
                <p className="mt-2 text-sm text-muted-foreground">{apt.notes}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {apt.status === "REQUESTED" && (
              <Button variant="outline" size="sm" onClick={onConfirm}>
                <Check className="h-4 w-4" />
              </Button>
            )}
            {apt.status === "CONFIRMED" && (
              <Button variant="outline" size="sm" onClick={onComplete}>
                Complete
              </Button>
            )}
            {apt.status !== "CANCELLED" && apt.status !== "COMPLETED" && (
              <>
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
