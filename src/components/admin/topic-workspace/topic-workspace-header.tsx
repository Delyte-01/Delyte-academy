"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  ArrowLeft,
  FolderTree,
  Pencil,
  UploadCloud,
  EyeOff,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { TopicStatus } from "../topics/topic-form";

type Status = "draft" | "published";
type Difficulty = "beginner" | "intermediate" | "advanced";

interface TopicWorkspaceHeaderProps {
  title: string;
  description: string;
  code?: string;
  difficulty: Difficulty;
  duration: number;
  status: Status;
  courseSlug: string;
  onChangeStatus: (id: string, status: TopicStatus) => void;
}

const difficultyStyles: Record<Difficulty, string> = {
  beginner: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700",
  intermediate: "border-amber-500/30 bg-amber-500/15 text-amber-700",
  advanced: "border-rose-500/30 bg-rose-500/15 text-rose-700",
};

const statusStyles: Record<Status, string> = {
  published: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700",
  draft: "border-amber-500/30 bg-amber-500/15 text-amber-700",
};

export function TopicWorkspaceHeader({
  title,
  description,
  difficulty,
  duration,
  status,
  courseSlug,
  onChangeStatus,
}: TopicWorkspaceHeaderProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const id = params.id as string;
  const courseId = id;
  const topicId = params.topicsId as string;

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      accentRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.6, ease: "power2.out", transformOrigin: "left" }
    )
      .fromTo(
        rootRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
        0
      )
      .fromTo(
        iconRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" },
        0.25
      );
  }, []);


  return (
    <div
      ref={rootRef}
      className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm ring-1 ring-black/[0.02] dark:ring-white/[0.03]"
    >
      {/* Top accent line */}
      <div
        ref={accentRef}
        className="h-[3px] w-full bg-gradient-to-r from-primary via-indigo-500 to-primary/40"
      />

      {/* Accent banner */}
      <div className="relative h-24 w-full overflow-hidden bg-gradient-to-br from-primary/15 via-muted to-muted sm:h-28">
        <Link
          href={`/admin/courses/${courseSlug}`}
          className="group absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-lg bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-background"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to course
        </Link>
      </div>

      {/* Body */}
      <div className="px-4 pb-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            {/* Icon badge */}
            <div ref={iconRef} className="-mt-8 flex-shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-card bg-primary/10 shadow-md transition-transform duration-300 hover:scale-[1.03] sm:h-20 sm:w-20">
                <FolderTree className="h-7 w-7 text-primary" />
              </div>
            </div>

            {/* Title block */}
            <div className="min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl first-letter:capitalize font-extrabold tracking-tight text-foreground sm:text-2xl">
                  {title}
                </h1>
                <Badge
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1.5 text-xs",
                    statusStyles[status]
                  )}
                >
                  {status === "published" && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                  )}
                  {status}
                </Badge>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn("text-xs", difficultyStyles[difficulty])}
                >
                  {difficulty}
                </Badge>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {duration}
                </span>
              </div>
              <p className="mt-2 hidden max-w-xl line-clamp-1 text-xs text-muted-foreground sm:block first-letter:capitalize">
                {description}
              </p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="group"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(
                  `/admin/courses/${courseId}/topics/${topicId}/edit`
                );
              }}
            >
              <Pencil className="mr-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:-rotate-12" />
              Edit
            </Button>
            {status === "published" ? (
              <Button
                variant="secondary"
                size="sm"
                className="group"
                onClick={() => onChangeStatus(topicId, "draft")}
              >
                <EyeOff className="mr-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-90" />
                Unpublish
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="group bg-emerald-600/10 text-emerald-700 transition-colors hover:bg-emerald-600/20"
                onClick={() => onChangeStatus(topicId, "published")}
              >
                <UploadCloud className="mr-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
                Publish
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
