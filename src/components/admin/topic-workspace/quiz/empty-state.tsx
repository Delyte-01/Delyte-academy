"use client";

import { HelpCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState as SharedEmptyState } from "@/components/empty-states";

interface EmptyStateProps {
  onAddQuestion: () => void;
}

export function EmptyState({ onAddQuestion }: EmptyStateProps) {
  return (
    <SharedEmptyState
      icon={HelpCircle}
      title="No questions yet"
      description="Add your first question, or import a DOCX, CSV or PDF to build this quiz faster."
      action={
        <Button variant="brand" onClick={onAddQuestion}>
          <Plus className="size-4" />
          Add question
        </Button>
      }
    />
  );
}
