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
  PDF: "bg-rose-500/10 text-rose-600",
  DOC: "bg-blue-500/10 text-blue-600",
  DOCX: "bg-blue-500/10 text-blue-600",
  ZIP: "bg-amber-500/10 text-amber-600",
  PNG: "bg-violet-500/10 text-violet-600",
  JPG: "bg-violet-500/10 text-violet-600",
  JPEG: "bg-violet-500/10 text-violet-600",
  XLSX: "bg-emerald-500/10 text-emerald-600",
  XLS: "bg-emerald-500/10 text-emerald-600",
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
                className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3.5 transition-colors hover:border-emerald-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 sm:p-4"
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
                <Download className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-emerald-600" />
                <span className="sr-only">Download</span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
