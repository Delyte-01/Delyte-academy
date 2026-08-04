"use client";

import { X, UploadCloud, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadFooterActionsProps {
  onCancel: () => void;
  onImport: () => void;
  disabled: boolean;
  loading: boolean;
}

export function UploadFooterActions({
  onCancel,
  onImport,
  disabled,
  loading,
}: UploadFooterActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2 border-t pt-4">
      <Button variant="outline" onClick={onCancel} disabled={loading}>
        <X className="mr-1.5 h-4 w-4" />
        Cancel
      </Button>
      <Button onClick={onImport} disabled={disabled || loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Importing...
          </>
        ) : (
          <>
            <UploadCloud className="mr-2 h-4 w-4" />
            Import Files
          </>
        )}
      </Button>
    </div>
  );
}
