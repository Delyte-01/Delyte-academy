"use client";

import { useState, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadCloud, AlertCircle, X } from "lucide-react";
import { UploadDropzone } from "./upload-dropzone";
import { UploadedFileList } from "./uploaded-file-list";
import { UploadFooterActions } from "./upload-footer-actions";
import { UploadGuideCard } from "./upoload-guide-card";
import { UploadedFile } from "./file-preview";


export interface UploadCenterProps {
  mode: "quiz" | "content";
  acceptedFormats: string[];
  maxFileSize?: number;
  multiple?: boolean;
  onUpload: (files: File[]) => void;
  loading?: boolean;
}

interface ValidationMessage {
  id: string;
  message: string;
}

export function UploadCenter({
  mode,
  acceptedFormats,
  maxFileSize = 100 * 1024 * 1024,
  multiple = true,
  onUpload,
  loading = false,
}: UploadCenterProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [validations, setValidations] = useState<ValidationMessage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const heading =
    mode === "quiz" ? "Import Quiz Questions" : "Import Learning Content";
  const subtitle =
    mode === "quiz"
      ? "Upload DOCX, CSV or PDF files to automatically create quiz questions."
      : "Upload DOCX or PDF files to generate lesson content.";

  const addValidation = useCallback((message: string) => {
    const id = `val-${Date.now()}-${Math.random()}`;
    setValidations((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setValidations((prev) => prev.filter((v) => v.id !== id));
    }, 4000);
  }, []);

  const validateFile = useCallback(
    (file: File): boolean => {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const accepted = acceptedFormats.map((f) => f.toLowerCase());

      if (!accepted.includes(ext)) {
        addValidation(
          `"${file.name}" — Unsupported file type. Accepted: ${acceptedFormats.join(", ")}`,
        );
        return false;
      }

      if (file.size > maxFileSize) {
        const maxMB = (maxFileSize / (1024 * 1024)).toFixed(0);
        addValidation(
          `"${file.name}" — File exceeds maximum size of ${maxMB} MB.`,
        );
        return false;
      }

      if (
        files.some(
          (f) => f.file.name === file.name && f.file.size === file.size,
        )
      ) {
        addValidation(`"${file.name}" — Duplicate file already uploaded.`);
        return false;
      }

      return true;
    },
    [acceptedFormats, maxFileSize, files, addValidation],
  );

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;

      const incoming = multiple ? Array.from(fileList) : [fileList[0]];
      const valid: UploadedFile[] = [];

      for (const file of incoming) {
        if (validateFile(file)) {
          valid.push({ file, id: `file-${Date.now()}-${Math.random()}` });
        }
      }

      if (valid.length > 0) {
        setFiles((prev) => (multiple ? [...prev, ...valid] : [valid[0]]));
      }
    },
    [multiple, validateFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleBrowse = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      e.target.value = "";
    },
    [handleFiles],
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleCancel = useCallback(() => {
    setFiles([]);
    setValidations([]);
  }, []);

  const handleImport = useCallback(() => {
    onUpload(files.map((f) => f.file));
  }, [files, onUpload]);

  return (
    <div className="space-y-6">
      {/* Hidden file input for browse */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple={multiple}
        accept={acceptedFormats.map((f) => `.${f}`).join(",")}
        onChange={handleInputChange}
      />

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <UploadCloud className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            {heading}
          </h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {/* Main layout: upload area + sidebar */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: Upload area + file list */}
        <div className="space-y-4 lg:col-span-3">
          <Card>
            <CardContent className="p-5">
              {files.length === 0 ? (
                <UploadDropzone
                  isDragOver={isDragOver}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onBrowse={handleBrowse}
                  acceptedFormats={acceptedFormats}
                  mode={mode}
                />
              ) : (
                <div className="space-y-3">
                  <UploadedFileList
                    files={files}
                    loading={loading}
                    onRemove={removeFile}
                  />
                  <button
                    onClick={handleBrowse}
                    className="w-full rounded-xl border border-dashed py-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    + Add more files
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Validation alerts */}
          {validations.length > 0 && (
            <div className="space-y-2">
              {validations.map((v) => (
                <Alert
                  key={v.id}
                  className="flex items-center gap-2 border-destructive/30 bg-destructive/5 py-2"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-destructive" />
                  <AlertDescription className="text-xs text-destructive">
                    {v.message}
                  </AlertDescription>
                  <button
                    onClick={() =>
                      setValidations((prev) =>
                        prev.filter((p) => p.id !== v.id),
                      )
                    }
                    className="ml-auto text-destructive/50 hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Alert>
              ))}
            </div>
          )}

          {/* Loading progress bar */}
          {loading && files.length > 0 && (
            <div className="space-y-2 rounded-xl border bg-muted/20 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  Preparing files...
                </p>
                <span className="text-xs text-muted-foreground">
                  Processing
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full w-1/3 animate-pulse rounded-full bg-primary"
                  style={{ animation: "shimmer 1.5s ease-in-out infinite" }}
                />
              </div>
            </div>
          )}

          {/* Footer actions */}
          <UploadFooterActions
            onCancel={handleCancel}
            onImport={handleImport}
            disabled={files.length === 0}
            loading={loading}
          />
        </div>

        {/* Right: Guide sidebar */}
        <div className="lg:col-span-2">
          <UploadGuideCard mode={mode} />
        </div>
      </div>
    </div>
  );
}
