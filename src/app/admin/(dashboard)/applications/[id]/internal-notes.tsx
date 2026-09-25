"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote, Plus, X } from "lucide-react";

interface InternalNotesPanelProps {
  applicationId: string;
  notes: string | null;
}

export function InternalNotesPanel({
  applicationId,
  notes,
}: InternalNotesPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState(notes || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // TODO: Wire up to updateApplicationNotes action
    // For now, just simulate save
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <StickyNote className="h-4 w-4" />
            Internal Notes
          </span>
          {!isEditing && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
            >
              <Plus className="h-3 w-3" />
              {notes ? "Edit" : "Add"}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Add internal notes about this application (not visible to client)..."
              rows={6}
              className="resize-none"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setNoteContent(notes || "");
                }}
                disabled={isLoading}
              >
                <X className="h-3 w-3" />
                Cancel
              </Button>
            </div>
          </div>
        ) : notes ? (
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {notes}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            No internal notes yet. Add notes for internal tracking.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
