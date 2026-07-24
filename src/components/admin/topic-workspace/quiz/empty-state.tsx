"use client";

import { Plus, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddQuestion: () => void;
}

export function EmptyState({ onAddQuestion }: EmptyStateProps) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 p-8 text-center">
      <div className="relative">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <HelpCircle className="h-8 w-8" />
        </div>
        <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
          <Plus className="h-3.5 w-3.5" />
        </div>
      </div>
      <h3 className="mt-5 text-lg font-bold text-foreground">
        No Questions Yet
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Create your first question to start building this quiz.
      </p>
      <Button className="mt-5" onClick={onAddQuestion}>
        <Plus className="mr-1.5 h-4 w-4" />
        Add Question
      </Button>
    </div>
  );
}
