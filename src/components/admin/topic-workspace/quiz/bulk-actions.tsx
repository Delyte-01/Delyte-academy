"use client";

import { Trash2, Copy, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onDuplicate: () => void;
  onExport: () => void;
  onClear: () => void;
}

export function BulkActions({
  selectedCount,
  onDelete,
  onDuplicate,
  onExport,
  onClear,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border bg-primary/5 px-4 py-2.5">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
          {selectedCount}
        </span>
        <span className="text-sm font-medium text-foreground">selected</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={onClear}
        >
          <X className="mr-1 h-3 w-3" />
          Clear
        </Button>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={onDuplicate}
        >
          <Copy className="mr-1.5 h-3.5 w-3.5" />
          Duplicate
        </Button>
        <Button variant="outline" size="sm" className="h-8" onClick={onExport}>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-destructive/30 text-destructive hover:bg-destructive/10"
          onClick={onDelete}
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}
