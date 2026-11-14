"use client";

import {
  Download,
  File,
  FileArchive,
  FileImage,
  FileText,
  FileType,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TopicAttachment } from "@/types/attachment";

const icons: Record<string, LucideIcon> = {
  PDF: FileText,
  DOC: File,
  DOCX: File,
  ZIP: FileArchive,
  PNG: FileImage,
  JPG: FileImage,
  JPEG: FileImage,
  XLSX: FileType,
  XLS: FileType,
};

const tones: Record<string, string> = {
  PDF: "bg-destructive/10 text-destructive",
  DOC: "bg-info-soft text-info",
  DOCX: "bg-info-soft text-info",
  ZIP: "bg-warning-soft text-warning",
  PNG: "bg-primary-soft text-primary-soft-foreground",
  JPG: "bg-primary-soft text-primary-soft-foreground",
  JPEG: "bg-primary-soft text-primary-soft-foreground",
  XLSX: "bg-success-soft text-success",
  XLS: "bg-success-soft text-success",
};

function formatSize(bytes: number) {
  if (!bytes) return "";
  const mb = bytes / 1024 / 1024;
  return mb >= 1
    ? `${mb.toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function ResourcesSection({
  attachments,
}: {
  attachments: TopicAttachment[];
}) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        Resources
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {attachments.length}
        </span>
      </h2>

      <ul className="space-y-2">
        {attachments.map((file) => {
          const type = file.file_type?.toUpperCase() ?? "";
          const Icon = icons[type] ?? File;
          return (
            <li key={file.id}>
              <a
                href={file.file_url}
                download={file.file_name || file.title}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 transition-colors hover:border-success/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-4"
              >
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${tones[type] ?? "bg-muted text-muted-foreground"}`}
                >
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {file.title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {[file.file_type, formatSize(file.file_size)]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
                <Download className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-success" />
                <span className="sr-only">Download</span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
