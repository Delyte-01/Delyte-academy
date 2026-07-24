"use client";

import { Eye, Save, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

interface QuizHeaderProps {
  onPreview: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  saving:boolean
}

export function QuizHeader({
  onPreview,
  onSaveDraft,
  onPublish,
  saving
}: QuizHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="min-w-0 space-y-1">
          <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            Quiz &amp; Practice
          </h1>
          <p className="text-sm text-muted-foreground">
            Create assessments for this topic.
          </p>
        </div>
      </div>
      <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreview}
          disabled={saving}
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          Preview Quiz
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onSaveDraft}
          disabled={saving}
        >
          <Save className="mr-1.5 h-3.5 w-3.5" />
          {saving ? "Saving Draft..." : "Draft"}
        </Button>
        <Button size="sm" onClick={onPublish}>
          <UploadCloud className="mr-1.5 h-3.5 w-3.5" />
          {saving ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </div>
  );
}
