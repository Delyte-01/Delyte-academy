"use client";

import { Copy, Download, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onDuplicate: () => void;
  onExport: () => void;
  onClear: () => void;
}

/** Floating selection bar — sticks to the bottom of the viewport while questions are selected. */
export function BulkActions({ selectedCount, onDelete, onDuplicate, onExport, onClear }: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      role="region"
      aria-label="Bulk actions"
      className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card px-3 py-2.5 shadow-float"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-primary px-1.5 text-sm font-bold tabular-nums text-primary-foreground">
          {selectedCount}
        </span>
        <span className="text-sm font-semibold text-foreground">selected</span>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="size-4" />
          Clear
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onDuplicate}>
          <Copy className="size-4" />
          Duplicate
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="size-4" />
          Export
        </Button>
        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={onDelete}>
          <Trash2 className="size-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
