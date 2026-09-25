"use client";

import { useState, useTransition, useOptimistic } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateLeadStage } from "@/lib/actions/lead.actions";
import { LeadStage } from "@prisma/client";

type LeadStageSelectorProps = {
  leadId: string;
  currentStage: LeadStage;
  onUpdate?: () => void;
};

const STAGE_LABELS: Record<LeadStage, string> = {
  NEW: "New Lead",
  CONTACTED: "Contacted",
  CONSULTATION_SCHEDULED: "Consultation Scheduled",
  CONSULTATION_COMPLETED: "Consultation Completed",
  INTERESTED: "Interested",
  DOCUMENTS_PENDING: "Documents Pending",
  CONVERTED: "Converted",
  NOT_INTERESTED: "Not Interested",
  LOST: "Lost",
};

export function LeadStageSelector({
  leadId,
  currentStage,
  onUpdate,
}: LeadStageSelectorProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticStage, setOptimisticStage] = useOptimistic(currentStage);
  const { toast } = useToast();

  const handleStageChange = (newStage: LeadStage) => {
    // Optimistic update
    setOptimisticStage(newStage);

    startTransition(async () => {
      const result = await updateLeadStage({
        leadId,
        stage: newStage,
      });

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        onUpdate?.();
      } else {
        // Rollback optimistic update
        setOptimisticStage(currentStage);
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Select
      value={optimisticStage}
      onValueChange={(value) => handleStageChange(value as LeadStage)}
      disabled={isPending}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(STAGE_LABELS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
