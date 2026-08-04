"use client";

import { Video, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface VideoSectionProps {
  videoUrl: string | null;
}

function getEmbedUrl(url?: string) {
  if (!url) return "";

  // https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  // https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  // Already an embed URL
  if (url.includes("/embed/")) return url;

  return url;
}

export function VideoSection({ videoUrl }: VideoSectionProps) {
  const embedUrl = getEmbedUrl(videoUrl ?? "");

  if (!videoUrl) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-muted-foreground/25 bg-muted/20 p-8 text-center sm:p-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
          <Video className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            No video available
          </p>
          <p className="text-xs text-muted-foreground">
            Check back later for a video walkthrough of this topic.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-0 p-0 shadow-md ring-1 ring-border/60 transition-shadow duration-300 hover:shadow-xl">
      {/* Ambient gradient frame */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/40 via-emerald-500/20 to-transparent opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
        <iframe
          src={embedUrl}
          className="absolute inset-0 h-full w-full"
          title="Topic video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="flex items-center gap-2 border-t border-border/60 bg-card px-4 py-3">
        <PlayCircle className="h-4 w-4 flex-shrink-0 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">
          Video lesson
        </span>
      </div>
    </Card>
  );
}
