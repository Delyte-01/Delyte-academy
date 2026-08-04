'use client';

import { FileText, FileArchive, FileSpreadsheet, Presentation, X, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


export interface UploadedFile {
  file: File;
  id: string;
}

interface FilePreviewItemProps {
  uploadedFile: UploadedFile;
  loading: boolean;
  onRemove: (id: string) => void;
}

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['pdf'].includes(ext)) return FileText;
  if (['zip', 'rar'].includes(ext)) return FileArchive;
  if (['csv', 'xls', 'xlsx'].includes(ext)) return FileSpreadsheet;
  if (['ppt', 'pptx'].includes(ext)) return Presentation;
  return FileText;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FilePreviewItem({ uploadedFile, loading, onRemove }: FilePreviewItemProps) {
  const { file, id } = uploadedFile;
  const Icon = getFileIcon(file.name);
  const ext = file.name.split('.').pop()?.toUpperCase() ?? '';

  return (
    <div className="group flex items-center gap-3 rounded-xl border bg-card p-3 transition-all duration-200 hover:shadow-sm">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {/* <Icon className="h-5 w-5" /> */}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">{file.name}</p>
          <Badge variant="outline" className="flex-shrink-0 text-[10px]">
            {ext}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
      </div>

      {loading ? (
        <div className="flex flex-shrink-0 items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground">Preparing...</span>
        </div>
      ) : (
        <div className="flex flex-shrink-0 items-center gap-1">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
