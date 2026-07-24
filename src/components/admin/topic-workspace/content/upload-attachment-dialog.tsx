"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UploadCloud,
  File as FileIcon,
  X,
  Loader2,
  FileText,
  FileArchive,
  Presentation,
  FileSpreadsheet,
  FileCode2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResourceCategory, UploadAttachmentForm } from "@/types/attachment";

interface UploadAttachmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uploading: boolean;

  onUpload: (data: UploadAttachmentForm) => Promise<void>;
}

const categories = [
  "Lecture Notes",
  "Slides",
  "Assignment",
  "Worksheet",
  "Source Code",
  "Cheat Sheet",
  "Reference Material",
  "Other",
];

const supportedTypes = [
  "PDF",
  "DOC",
  "DOCX",
  "PPT",
  "PPTX",
  "XLS",
  "XLSX",
  "ZIP",
  "RAR",
  "TXT",
];
const MAX_SIZE_BYTES = 100 * 1024 * 1024;

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["pdf", "txt", "doc", "docx"].includes(ext)) return FileText;
  if (["zip", "rar"].includes(ext)) return FileArchive;
  if (["ppt", "pptx"].includes(ext)) return Presentation;
  if (["xls", "xlsx"].includes(ext)) return FileSpreadsheet;
  if (["js", "ts", "py", "java", "cpp", "html", "css"].includes(ext))
    return FileCode2;
  return FileIcon;
}




export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UploadedFile {
  file: File;
  progress: number;
}

export function UploadAttachmentDialog({
  open,
  onOpenChange,
  onUpload,
  uploading,
}: UploadAttachmentDialogProps) {
  const [title, setTitle] = useState("");
 const [category, setCategory] = useState<ResourceCategory | "">("");
  const [description, setDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  // const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const dropzoneRef = useRef<HTMLLabelElement>(null);
  const dropIconRef = useRef<HTMLDivElement>(null);
  const fileCardRef = useRef<HTMLDivElement>(null);
  // const successRef = useRef<HTMLParagraphElement>(null);
  // const progressTween = useRef({ value: 0 });

  const canSubmit =
    title.trim() !== "" && category !== "" && uploadedFile !== null;

  // Spring the dropzone + its icon when a file is dragged over it
  useEffect(() => {
    if (!dropzoneRef.current) return;
    gsap.to(dropzoneRef.current, {
      scale: isDragOver ? 1.012 : 1,
      duration: 0.2,
      ease: "power2.out",
    });
    gsap.to(dropIconRef.current, {
      scale: isDragOver ? 1.12 : 1,
      rotate: isDragOver ? -6 : 0,
      duration: 0.25,
      ease: "back.out(2)",
    });
  }, [isDragOver]);

  // Reveal the file card when a file lands
  useEffect(() => {
    if (uploadedFile && fileCardRef.current) {
      gsap.fromTo(
        fileCardRef.current,
        { opacity: 0, y: 8, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [uploadedFile?.file]);

  // Pop the "Upload complete" state in
  // useEffect(() => {
  //   if (uploadedFile?.progress === 100 && !uploading && successRef.current) {
  //     gsap.fromTo(
  //       successRef.current,
  //       { opacity: 0, scale: 0.85 },
  //       { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.5)" }
  //     );
  //   }
  // }, [uploadedFile?.progress, uploading]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    if (file.size > MAX_SIZE_BYTES) {
      setFileError(`"${file.name}" is over the 100 MB limit.`);
      return;
    }

    setFileError(null);

    setUploadedFile({
      file,
      progress: 100,
    });
  };

  const removeFile = () => {
    // gsap.killTweensOf(progressTween.current);
    setUploadedFile(null);
    // setIsUploading(false);
    setFileError(null);
  };

  const resetForm = () => {
    // gsap.killTweensOf(progressTween.current);
    setTitle("");
    setCategory("");
    setDescription("");
    setUploadedFile(null);
    // setIsUploading(false);
    setFileError(null);
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
  if (!uploadedFile || !category) return;

    await onUpload({
      title,
      category,
      description,
      file: uploadedFile.file,
    });

    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 rounded-2xl p-0 sm:max-w-xl">
        {/* Header */}
        <DialogHeader className="space-y-1 border-b border-border/60 px-6 pb-4 pt-6">
          <DialogTitle className="text-lg font-bold tracking-tight">
            Upload Resource
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            Upload PDFs, documents, presentations, spreadsheets, source code or
            other learning resources for this topic.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
          {/* Resource Title */}
          <div className="space-y-2">
            <Label htmlFor="resource-title" className="text-sm font-semibold">
              Resource Title
            </Label>
            <Input
              id="resource-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Week 1 Lecture Slides"
              className="h-10 transition-shadow"
            />
          </div>

          {/* Resource Category */}
          <div className="space-y-2">
            <Label
              htmlFor="resource-category"
              className="text-sm font-semibold"
            >
              Resource Category
            </Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as ResourceCategory)}
            >
              <SelectTrigger id="resource-category" className="h-10 rounded-xl">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload Area */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">File</Label>
            {!uploadedFile ? (
              <>
                <label
                  ref={dropzoneRef}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    handleFileSelect(e.dataTransfer.files);
                  }}
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-200",
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
                  )}
                  style={{ willChange: "transform" }}
                >
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.txt"
                  />
                  <div
                    ref={dropIconRef}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                  >
                    <UploadCloud className="h-7 w-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      Drag &amp; Drop files here
                    </p>
                    <p className="text-xs text-muted-foreground">or</p>
                    <span className="inline-block text-sm font-medium text-primary underline-offset-2 hover:underline">
                      Browse Files
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center justify-center gap-1">
                    {supportedTypes.map((type) => (
                      <span
                        key={type}
                        className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Maximum size: 100 MB
                  </p>
                </label>

                {fileError && (
                  <p className="flex items-center gap-1.5 text-xs text-destructive duration-200 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {fileError}
                  </p>
                )}
              </>
            ) : (
              <div
                ref={fileCardRef}
                className="space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {(() => {
                      const Icon = getFileIcon(uploadedFile.file.name);
                      return <Icon className="h-5 w-5" />;
                    })()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatSize(uploadedFile.file.size)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={removeFile}
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {/* {uploadedFile.progress < 100 && (
                  <div className="space-y-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-500"
                        style={{ width: `${uploadedFile.progress}%` }}
                      />
                    </div>
                    <p className="text-right text-[11px] tabular-nums text-muted-foreground">
                      {uploadedFile.progress}%
                    </p>
                  </div>
                )} */}
                {/* {uploadedFile.progress === 100 && !uploading && (
                  <p
                    ref={successRef}
                    className="flex items-center gap-1.5 text-xs font-medium text-emerald-600"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Upload complete
                  </p>
                )} */}
              </div>
            )}
          </div>

          {/* Optional Description */}
          <div className="space-y-2">
            <Label
              htmlFor="resource-description"
              className="text-sm font-semibold"
            >
              Description{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Textarea
              id="resource-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of this resource..."
              className="min-h-[80px] resize-y"
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex-col gap-3 border-t border-border/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="hidden text-xs text-muted-foreground sm:block">
            {!canSubmit && !uploading
              ? "Add a title, category, and file to continue"
              : "\u00A0"}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={uploading || !canSubmit}
              className="rounded-xl shadow-sm shadow-primary/20 transition-shadow hover:shadow-md hover:shadow-primary/30"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload Resource
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
