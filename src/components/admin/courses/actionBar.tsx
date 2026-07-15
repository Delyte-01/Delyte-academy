"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { X, FileText, UploadCloud, Loader2 } from "lucide-react";

interface ActionBarProps {
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  savingMessage: string;
  saving?: boolean;
}

export function ActionBar({
  onCancel,
  onSaveDraft,
  onPublish,
  saving,
  savingMessage
}: ActionBarProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;
    gsap.fromTo(
      barRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", delay: 0.15 }
    );
  }, []);

  return (
    <div
      ref={barRef}
      className="sticky bottom-0 z-30 -mx-4 border-t border-border/60 bg-background/85 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)] backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={saving}
          className="text-muted-foreground"
        >
          <X className="mr-1.5 h-4 w-4" />
          Cancel
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onSaveDraft} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                {savingMessage}
              </>
            ) : (
              <FileText className="mr-1.5 h-4 w-4" />
            )}
            Save Draft
          </Button>
          <Button
            onClick={onPublish}
            disabled={saving}
            className="bg-emerald-600 shadow-sm shadow-emerald-600/20 transition-shadow hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-600/30"
          >
            {saving ? (
              <>
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              {savingMessage}
              </>
            ) : (
              <UploadCloud className="mr-1.5 h-4 w-4" />
            )}
            Publish Course
          </Button>
        </div>
      </div>
    </div>
  );
}
