// utils/file-icon.ts
import {
  File,
  FileText,
  FileArchive,
  FileImage,
  FileVideo,
  FileSpreadsheet,
  Presentation,
  FileCode2,
} from "lucide-react";

export function getAttachmentMeta(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "pdf":
      return {
        Icon: FileText,
        color: "text-red-600",
        bg: "bg-red-500/10",
      };

    case "ppt":
    case "pptx":
      return {
        Icon: Presentation,
        color: "text-orange-600",
        bg: "bg-orange-500/10",
      };

    case "zip":
    case "rar":
      return {
        Icon: FileArchive,
        color: "text-yellow-600",
        bg: "bg-yellow-500/10",
      };

    default:
      return {
        Icon: File,
        color: "text-muted-foreground",
        bg: "bg-muted",
      };
  }
}
