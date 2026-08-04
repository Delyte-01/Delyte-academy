"use client";

import { FilePreviewItem } from "./file-preview";



interface UploadedFileListProps {
  files: UploadedFile[];
  loading: boolean;
  onRemove: (id: string) => void;
}

export function UploadedFileList({
  files,
  loading,
  onRemove,
}: UploadedFileListProps) {
  return (
    <div className="space-y-2">
      {files.map((uploadedFile) => (
        <FilePreviewItem
          key={uploadedFile.id}
          uploadedFile={uploadedFile}
          loading={loading}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
