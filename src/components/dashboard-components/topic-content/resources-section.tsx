"use client";

import {
  Paperclip,
  Download,
  FileText,
  File,
  FileArchive,
  FileImage,
  FileType,
  Inbox,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";
import { TopicAttachment } from "@/types/attachment";

const fileTypeIcons: Record<string, LucideIcon> = {
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

function getFileIcon(fileType: string): LucideIcon {
  return fileTypeIcons[fileType.toUpperCase()] || File;
}

const iconColors: Record<string, string> = {
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

export function ResourcesSection({
  attachments,
}: {
  attachments: TopicAttachment[];
}) {
  const handleDownload = (resource: TopicAttachment) => {
    const link = document.createElement("a");

    link.href = resource.file_url;
    link.download = resource.file_name || resource.title;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!attachments || attachments.length === 0) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Paperclip className="h-5 w-5 text-primary" />
            Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <Inbox className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              No resources available for this topic.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Paperclip className="h-4 w-4" />
          </span>
          Resources
          <Badge variant="outline" className="ml-auto font-normal">
            {attachments.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {attachments.map((attachment) => {
          const Icon = getFileIcon(attachment.file_type);
          const colorClass =
            iconColors[attachment.file_type.toUpperCase()] ||
            "bg-muted text-muted-foreground";

          return (
            <div
              key={attachment.id}
              className="group flex flex-col gap-3 rounded-xl border border-border/60 p-3 transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.03] hover:shadow-sm sm:flex-row sm:items-center sm:gap-4 sm:p-4"
            >
              <div className="flex items-start gap-3 sm:contents">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 sm:h-11 sm:w-11 ${colorClass}`}
                >
                  <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {attachment.title}
                  </p>
                  {attachment.description && (
                    <p className="truncate text-xs text-muted-foreground">
                      {attachment.description}
                    </p>
                  )}
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <Badge variant="outline" className="text-[10px]">
                      {attachment.category}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      {attachment.file_type}
                    </span>
                    <span className="text-[11px] text-muted-foreground">·</span>
                    <span className="text-[11px] text-muted-foreground">
                      {(attachment.file_size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full flex-shrink-0 transition-colors group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary sm:w-auto"
                onClick={() => handleDownload(attachment)}
              >
                <Download className="h-3.5 w-3.5 sm:mr-1.5" />
                <span>Download</span>
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
