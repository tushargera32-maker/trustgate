"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  XCircle,
  MoreVertical,
  Download,
  FileText,
  RefreshCw,
  Edit,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  reviewDocument,
  requestDocumentReplacement,
  updateReviewerNote,
  updateDocumentStatus,
} from "@/lib/actions/document.actions";

type Document = {
  id: string;
  title: string;
  status: string;
  fileName: string | null;
  storageKey: string | null;
  uploadedAt: Date | null;
  reviewerNote: string | null;
};

type DialogType = "approve" | "reject" | "replacement" | "note" | "review" | null;

export function DocumentActionsCell({ document }: { document: Document }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [note, setNote] = useState(document.reviewerNote || "");

  const handleApprove = async () => {
    setIsLoading(true);
    const result = await reviewDocument(document.id, "VERIFIED", note || undefined);

    if (result.success) {
      toast({ title: "Success", description: "Document verified successfully" });
      setDialogType(null);
      setNote("");
      router.refresh();
    } else {
      toast({ title: "Error", description: result.error || "Failed to verify document", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleReject = async () => {
    if (!note.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setIsLoading(true);
    const result = await reviewDocument(document.id, "REJECTED", note);

    if (result.success) {
      toast.success("Document rejected");
      setDialogType(null);
      setNote("");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to reject document");
    }
    setIsLoading(false);
  };

  const handleRequestReplacement = async () => {
    if (!note.trim()) {
      toast.error("Please provide a reason for requesting replacement");
      return;
    }

    setIsLoading(true);
    const result = await requestDocumentReplacement(document.id, note);

    if (result.success) {
      toast.success("Replacement requested");
      setDialogType(null);
      setNote("");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to request replacement");
    }
    setIsLoading(false);
  };

  const handleUpdateNote = async () => {
    setIsLoading(true);
    const result = await updateReviewerNote(document.id, note);

    if (result.success) {
      toast.success("Note updated");
      setDialogType(null);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update note");
    }
    setIsLoading(false);
  };

  const handleSetUnderReview = async () => {
    setIsLoading(true);
    const result = await updateDocumentStatus(document.id, "UNDER_REVIEW");

    if (result.success) {
      toast.success("Status updated to Under Review");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update status");
    }
    setIsLoading(false);
  };

  const canReview = ["UPLOADED", "UNDER_REVIEW", "REPLACEMENT_REQUIRED"].includes(
    document.status
  );
  const hasFile = document.uploadedAt && document.storageKey;

  return (
    <>
      <div className="flex justify-end gap-2">
        {hasFile && (
          <Button size="sm" variant="outline">
            <Download className="h-3 w-3" /> View
          </Button>
        )}

        {canReview && (
          <>
            <Button
              size="sm"
              onClick={() => {
                setNote(document.reviewerNote || "");
                setDialogType("approve");
              }}
            >
              <CheckCircle2 className="h-3 w-3" /> Verify
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setNote(document.reviewerNote || "");
                    setDialogType("reject");
                  }}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setNote(document.reviewerNote || "");
                    setDialogType("replacement");
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Request Replacement
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {document.status !== "UNDER_REVIEW" && (
                  <DropdownMenuItem onClick={handleSetUnderReview}>
                    <FileText className="mr-2 h-4 w-4" />
                    Mark Under Review
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => {
                    setNote(document.reviewerNote || "");
                    setDialogType("note");
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      {/* Approve Dialog */}
      <Dialog open={dialogType === "approve"} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Document</DialogTitle>
            <DialogDescription>
              Mark &ldquo;{document.title}&rdquo; as verified. You can optionally add a note.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="approve-note">Note (optional)</Label>
              <Textarea
                id="approve-note"
                placeholder="Add any comments about this document..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={dialogType === "reject"} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Mark &ldquo;{document.title}&rdquo; as rejected. Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reject-note">Reason for rejection *</Label>
              <Textarea
                id="reject-note"
                placeholder="Explain why this document is being rejected..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isLoading || !note.trim()}
            >
              {isLoading ? "Rejecting..." : "Reject Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Replacement Dialog */}
      <Dialog
        open={dialogType === "replacement"}
        onOpenChange={() => setDialogType(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Document Replacement</DialogTitle>
            <DialogDescription>
              Ask the client to re-upload &ldquo;{document.title}&rdquo;. Explain what needs to be
              corrected.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="replacement-note">Reason for replacement *</Label>
              <Textarea
                id="replacement-note"
                placeholder="Explain what needs to be corrected (e.g., document expired, poor quality, missing pages)..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleRequestReplacement}
              disabled={isLoading || !note.trim()}
            >
              {isLoading ? "Requesting..." : "Request Replacement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog open={dialogType === "note"} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Reviewer Note</DialogTitle>
            <DialogDescription>
              Update the internal note for &ldquo;{document.title}&rdquo;.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-note">Internal Note</Label>
              <Textarea
                id="edit-note"
                placeholder="Add internal notes about this document..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateNote} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
