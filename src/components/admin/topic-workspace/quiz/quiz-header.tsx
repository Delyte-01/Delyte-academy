"use client";

import { Eye, GraduationCap, Save, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

interface QuizHeaderProps {
  onPreview: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  saving: boolean;
  status?: "draft" | "published";
}

export function QuizHeader({ onPreview, onSaveDraft, onPublish, saving, status }: QuizHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3.5">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
          <GraduationCap className="size-6" aria-hidden />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
              Quiz &amp; practice
            </h2>
            {status && <StatusBadge status={status} />}
          </div>
          <p className="text-[15px] text-muted-foreground">Build the assessment for this topic.</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={onPreview} disabled={saving}>
          <Eye className="size-4" />
          Preview
        </Button>
        <Button variant="secondary" onClick={onSaveDraft} disabled={saving}>
          <Save className="size-4" />
          {saving ? "Saving…" : "Save draft"}
        </Button>
        <Button variant="brand" onClick={onPublish} disabled={saving}>
          <UploadCloud className="size-4" />
          {saving ? "Publishing…" : "Publish"}
        </Button>
      </div>
    </div>
  );
}
