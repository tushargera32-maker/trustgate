"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatusSelect } from "@/components/admin/record-controls";
import {
  updateApplicationStatus,
  assignCaseOwner
} from "@/lib/actions/application.actions";
import { APPLICATION_STATUSES } from "@/lib/actions/core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, UserCircle, FileText, Clock } from "lucide-react";
import Link from "next/link";

type ApplicationRowProps = {
  application: {
    id: string;
    reference: string;
    status: string;
    client: {
      user: { name: string | null; email: string };
    };
    visaType: { name: string } | null;
    country: { name: string } | null;
    caseOwner: { id: string; name: string | null } | null;
    _count: {
      documents: number;
      timelineEntries: number;
      payments: number;
    };
  };
  staff: Array<{ id: string; name: string | null; role: string }>;
};

export function ApplicationRow({ application, staff }: ApplicationRowProps) {
  const [assigningOwner, setAssigningOwner] = React.useState(false);

  async function handleAssignOwner(ownerId: string | null) {
    setAssigningOwner(true);
    const result = await assignCaseOwner({
      id: application.id,
      caseOwnerId: ownerId
    });
    setAssigningOwner(false);

    if (!result.ok) {
      alert(result.error);
    }
  }

  return (
    <tr className="transition-colors hover:bg-secondary/20">
      <td className="px-4 py-3 font-mono text-xs font-medium">
        {application.reference}
      </td>
      <td className="px-4 py-3">
        <div className="font-medium">{application.client.user.name}</div>
        <div className="text-xs text-muted-foreground">
          {application.client.user.email}
        </div>
      </td>
      <td className="px-4 py-3">{application.visaType?.name || "-"}</td>
      <td className="px-4 py-3">{application.country?.name || "-"}</td>
      <td className="px-4 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              disabled={assigningOwner}
            >
              <UserCircle className="h-3 w-3" />
              {application.caseOwner?.name || "Unassigned"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Assign case owner</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleAssignOwner(null)}>
              <span className="text-muted-foreground">Unassign</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {staff.map((member) => (
              <DropdownMenuItem
                key={member.id}
                onClick={() => handleAssignOwner(member.id)}
              >
                {member.name}
                <span className="ml-2 text-xs text-muted-foreground">
                  {member.role}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
      <td className="px-4 py-3">
        <StatusSelect
          id={application.id}
          value={application.status}
          options={APPLICATION_STATUSES}
          action={updateApplicationStatus}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {application._count.documents}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {application._count.timelineEntries}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/applications/${application.id}`}>
                <Eye className="h-4 w-4" />
                View details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/applications/${application.id}/documents`}>
                <FileText className="h-4 w-4" />
                Manage documents
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/applications/${application.id}/timeline`}>
                <Clock className="h-4 w-4" />
                View timeline
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
