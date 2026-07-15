"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { UploadCloud, ImageIcon, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  label: string;
  description?: string;
  recommendedSize?: string;
  value?: string;
  onChange: (file: File | null, preview: string) => void;
  aspect?: "banner" | "thumbnail";
}

export function ImageUploader({
  label,
  description,
  recommendedSize,
  value,
  onChange,
  aspect = "banner",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      const url = URL.createObjectURL(file);
      setUploading(true);
      setProgress(0);

      let pct = 0;
      const interval = setInterval(() => {
        pct = Math.min(100, pct + Math.random() * 30 + 15);
        setProgress(pct);
        if (pct >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploading(false);
            onChange(file, url);
          }, 150);
        }
      }, 120);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      handleFile(e.dataTransfer.files?.[0]);
    },
    [handleFile]
  );

  // Reveal the image with a soft scale-in once the "upload" completes
  useEffect(() => {
    if (value && imageWrapRef.current) {
      gsap.fromTo(
        imageWrapRef.current,
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [value]);

  // Subtle lift while a file is dragged over the dropzone
  useEffect(() => {
    if (!dropRef.current) return;
    gsap.to(dropRef.current, {
      scale: dragging ? 1.015 : 1,
      duration: 0.2,
      ease: "power2.out",
    });
  }, [dragging]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground">{label}</label>
        {recommendedSize && (
          <span className="text-xs text-muted-foreground">
            Recommended: {recommendedSize}
          </span>
        )}
      </div>

      {uploading ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-primary/5",
            aspect === "banner" ? "aspect-[2/1]" : "aspect-square max-w-[200px]"
          )}
        >
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <div className="w-2/3 space-y-1.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-500 transition-[width] duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Uploading…
            </p>
          </div>
        </div>
      ) : value ? (
        <div
          ref={imageWrapRef}
          className={cn(
            "group relative overflow-hidden rounded-2xl border border-border/60",
            aspect === "banner" ? "aspect-[2/1]" : "aspect-square max-w-[200px]"
          )}
        >
          <img src={value} alt={label} className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              <UploadCloud className="mr-1.5 h-3.5 w-3.5" />
              Replace
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.value = "";
                }

                setProgress(0);
                setUploading(false);

                onChange(null, "");
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          ref={dropRef}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-colors",
            aspect === "banner"
              ? "aspect-[2/1]"
              : "aspect-square max-w-[200px]",
            dragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          )}
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
              dragging ? "bg-primary/10" : "bg-muted"
            )}
          >
            {aspect === "thumbnail" ? (
              <ImageIcon
                className={cn(
                  "h-5 w-5",
                  dragging ? "text-primary" : "text-muted-foreground"
                )}
              />
            ) : (
              <UploadCloud
                className={cn(
                  "h-5 w-5",
                  dragging ? "text-primary" : "text-muted-foreground"
                )}
              />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              <span className="text-primary">Click to upload</span> or drag and
              drop
            </p>
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
