"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusSelect } from "@/components/admin/record-controls";
import {
  updateApplicationStatus,
  assignCaseOwner,
} from "@/lib/actions/application.actions";
import { APPLICATION_STATUSES } from "@/lib/actions/core";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, UserCircle, Loader2 } from "lucide-react";

type ApplicationStatusManagerProps = {
  applicationId: string;
  currentStatus: string;
  staff: Array<{ id: string; name: string | null; role: string }>;
  caseOwnerId: string | null;
};

export function ApplicationStatusManager({
  applicationId,
  currentStatus,
  staff,
  caseOwnerId,
}: ApplicationStatusManagerProps) {
  const [owner, setOwner] = React.useState<string>(caseOwnerId || "");
  const [assigning, setAssigning] = React.useState(false);

  async function handleOwnerChange(newOwnerId: string) {
    setOwner(newOwnerId);
    setAssigning(true);

    const result = await assignCaseOwner({
      id: applicationId,
      caseOwnerId: newOwnerId || null,
    });

    if (!result.ok) {
      setOwner(caseOwnerId || "");
      alert(result.error);
    }

    setAssigning(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Settings className="h-4 w-4" />
          Application status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Current status
          </label>
          <StatusSelect
            id={applicationId}
            value={currentStatus}
            options={APPLICATION_STATUSES}
            action={updateApplicationStatus}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Status changes create timeline entries automatically
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Case owner
          </label>
          <div className="relative">
            <Select
              value={owner}
              onValueChange={handleOwnerChange}
              disabled={assigning}
            >
              <SelectTrigger>
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  <span className="text-muted-foreground">Unassigned</span>
                </SelectItem>
                {staff.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-3 w-3" />
                      {member.name}
                      <span className="text-xs text-muted-foreground">
                        ({member.role})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {assigning && (
              <Loader2 className="absolute right-8 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
