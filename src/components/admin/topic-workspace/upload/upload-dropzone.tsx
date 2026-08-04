"use client";

import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onBrowse: () => void;
  acceptedFormats: string[];
  mode: "quiz" | "content";
}

export function UploadDropzone({
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onBrowse,
  acceptedFormats,
  mode,
}: UploadDropzoneProps) {
  return (
    <label
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200",
        isDragOver
          ? "scale-[1.01] border-primary bg-primary/5"
          : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40",
      )}
    >
      <input
        type="file"
        className="hidden"
        multiple
        onChange={() => {}}
        onClick={onBrowse}
      />

      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-200",
          isDragOver && "scale-110",
        )}
      >
        <UploadCloud className="h-7 w-7" />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">
          Drag &amp; Drop files here
        </p>
        <p className="text-xs text-muted-foreground">or</p>
        <button
          type="button"
          onClick={onBrowse}
          className="inline-block text-sm font-medium text-primary underline-offset-2 hover:underline"
        >
          Browse Files
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
        {acceptedFormats.map((fmt) => (
          <span
            key={fmt}
            className="rounded-md border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
          >
            {fmt}
          </span>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground">
        {mode === "quiz"
          ? "DOCX, CSV or PDF files to automatically create quiz questions."
          : "DOCX or PDF files to generate lesson content."}
      </p>
    </label>
  );
}
