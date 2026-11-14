"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseThumbnailProps {
  src?: string | null;
  alt: string;
}

/** 16:9 cover with a shimmer while the image decodes and an on-brand fallback when there is none. */
export function CourseThumbnail({ src, alt }: CourseThumbnailProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
      {src ? (
        <>
          {!loaded && <div aria-hidden className="skeleton-shimmer absolute inset-0" />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            onLoad={() => setLoaded(true)}
            className={cn(
              "h-full w-full object-cover transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none group-hover:scale-[1.04]",
              loaded ? "opacity-100" : "opacity-0",
            )}
          />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-brand-wash">
          <span className="flex size-12 items-center justify-center rounded-2xl border bg-card text-primary shadow-card">
            <BookOpen className="size-5" aria-hidden />
          </span>
        </div>
      )}
    </div>
  );
}
