"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CourseStatus } from "@/types/course";

interface PreviewCardProps {
  title: string;
  code: string;
  description: string;
  status: CourseStatus;
  banner?: string;
  thumbnail?: string;
}

export function PreviewCard({
  title,
  code,
  description,
  status,
  banner,
  thumbnail,
}: PreviewCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  console.log({
    banner,
    thumbnail,
  });

  // Entrance on mount
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, x: 16 },
      { opacity: 1, x: 0, duration: 0.45, ease: "power2.out", delay: 0.1 }
    );
  }, []);

  // Gentle highlight flash whenever the underlying data changes, so the
  // "live" part of Live Preview actually reads as live.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { scale: 0.99 },
      {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      }
    );
  }, [title, code, description, status, banner, thumbnail]);

  return (
    <div className="space-y-3 lg:sticky lg:top-24">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        Live Preview
      </p>
      <Card
        ref={cardRef}
        className="overflow-hidden rounded-xl border-border/60 transition-shadow hover:shadow-lg"
      >
        {/* Banner */}
        <div className="relative aspect-[2/1] overflow-hidden bg-muted">
          {banner ? (
            <img
              src={banner}
              alt="Course banner"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
            </div>
          )}
          {thumbnail && (
            <img
              src={thumbnail}
              alt="Thumbnail"
              className="absolute bottom-3 left-3 h-12 w-12 rounded-xl border-2 border-background object-cover shadow-md"
            />
          )}
        </div>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
                  {code || "CSC101"}
                </span>
              </div>
              <h3 className="mt-2.5 line-clamp-1 text-sm font-bold text-foreground">
                {title || "Untitled Course"}
              </h3>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "flex-shrink-0 text-xs",
                status === "published"
                  ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-700"
                  : "border-amber-500/30 bg-amber-500/15 text-amber-700"
              )}
            >
              {status}
            </Badge>
          </div>
          <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">
            {description ||
              "Course description will appear here. Start typing to see the live preview update."}
          </p>
          <div className="mt-4 flex items-center gap-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            <span>0 students</span>
            <span>0 topics</span>
            <span>0 questions</span>
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-xs text-muted-foreground">
        This is how students will see the course card.
      </p>
    </div>
  );
}
