"use client";

import { AlertCircle, FileText, Loader2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionBarProps {
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  savingMessage: string;
  saving?: boolean;
  /** Number of fields currently failing validation (after a submit attempt). */
  errorCount?: number;
  publishLabel?: string;
}

/** Sticky save bar for admin forms: cancel on the left, draft + primary publish on the right. */
export function ActionBar({
  onCancel,
  onSaveDraft,
  onPublish,
  saving,
  savingMessage,
  errorCount = 0,
  publishLabel = "Publish course",
}: ActionBarProps) {
  return (
    <div className="sticky bottom-4 z-30 mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card/95 p-3 shadow-float backdrop-blur-md sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={saving}>
            <X className="size-4" />
            Cancel
          </Button>
          <p
            role="status"
            aria-live="polite"
            className="hidden min-w-0 items-center gap-1.5 truncate text-sm font-semibold sm:flex"
          >
            {saving ? (
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                {savingMessage || "Saving…"}
              </span>
            ) : errorCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-destructive">
                <AlertCircle className="size-4" aria-hidden />
                {errorCount} {errorCount === 1 ? "field needs" : "fields need"} attention
              </span>
            ) : null}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onSaveDraft} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
            Save draft
          </Button>
          <Button variant="brand" onClick={onPublish} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
            {publishLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
