"use client";

import { useState, useTransition } from "react";
import { Trash2, UserPlus, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  assignLead,
  deleteLead,
  addLeadActivity,
  updateLeadStage,
} from "@/lib/actions/lead.actions";
import { LeadStage } from "@prisma/client";

type Lead = {
  id: string;
  fullName: string;
  stage: string;
  assignedToId?: string | null;
};

type Staff = {
  id: string;
  name: string | null;
  email: string;
  role: string;
};

type LeadActionsProps = {
  lead: Lead;
  staffList: Staff[];
  onUpdate?: () => void;
};

export function LeadActions({ lead, staffList, onUpdate }: LeadActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    lead.assignedToId || ""
  );
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteLead({ leadId: lead.id });

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        setShowDeleteDialog(false);
        onUpdate?.();
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  const handleAssign = () => {
    startTransition(async () => {
      const result = await assignLead({
        leadId: lead.id,
        staffId: selectedStaffId || null,
      });

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        setShowAssignDialog(false);
        onUpdate?.();
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  const handleAddNote = () => {
    if (!noteContent.trim()) {
      toast({
        title: "Error",
        description: "Note content is required",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const result = await addLeadActivity({
        leadId: lead.id,
        type: "note",
        body: noteContent,
      });

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        setNoteContent("");
        setShowNoteDialog(false);
        onUpdate?.();
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline" disabled={isPending}>
            {isPending ? "Loading..." : "Actions"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowAssignDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Assign to staff
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowNoteDialog(true)}>
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            Add note
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete lead
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete lead</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {lead.fullName}? This action cannot be
              undone and will remove all associated activities.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign lead</DialogTitle>
            <DialogDescription>
              Assign {lead.fullName} to a staff member for follow-up.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="staff">Staff member</Label>
              <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                <SelectTrigger id="staff">
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {staffList.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name || staff.email} ({staff.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAssignDialog(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={isPending}>
              {isPending ? "Assigning..." : "Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add note</DialogTitle>
            <DialogDescription>
              Add a note or activity for {lead.fullName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                placeholder="Enter note or activity details..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNoteDialog(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleAddNote} disabled={isPending}>
              {isPending ? "Adding..." : "Add note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
