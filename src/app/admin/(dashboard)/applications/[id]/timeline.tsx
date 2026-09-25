"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type TimelineEntry = {
  id: string;
  status: string;
  note: string | null;
  occurredAt: Date;
};

interface ApplicationTimelineProps {
  applicationId: string;
  entries: TimelineEntry[];
  currentStatus: string;
}

export function ApplicationTimeline({
  entries,
  currentStatus,
}: ApplicationTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4" />
          Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No timeline entries yet</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className="relative flex gap-4 border-l-2 border-muted pb-4 pl-4 last:border-l-0 last:pb-0"
              >
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-background bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <StatusPill status={entry.status} />
                    <span className="font-mono text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(entry.occurredAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  {entry.note && (
                    <p className="text-sm text-muted-foreground">{entry.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
