"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  ArrowLeft,
  Pencil,
  // UploadCloud,
  // Archive,
  BookOpen,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type CourseStatus = "draft" | "published";

interface CourseWorkspaceHeaderProps {
  title: string;
  code: string;
  status: CourseStatus;
  banner?: string;
  thumbnail?: string;
  courseSlug: string;
}

export function CourseWorkspaceHeader({
  title,
  code,
  status,
  banner,
  thumbnail,
  courseSlug,
}: CourseWorkspaceHeaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bannerImgRef = useRef<HTMLImageElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

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
        bannerImgRef.current,
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: "power2.out" },
        0
      )
      .fromTo(
        thumbRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" },
        0.25
      );
  }, []);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API unavailable — fail silently, nothing to recover here
    }
  };

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

      {/* Banner */}
      <div className="group/banner relative h-40 w-full overflow-hidden bg-muted sm:h-52 lg:h-60">
        {banner ? (
          <img
            ref={bannerImgRef}
            src={banner}
            alt="Course banner"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/banner:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/20 via-muted to-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />

        {/* Back link */}
        <Link
          href="/admin/courses"
          className="group absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-lg bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-background"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Courses
        </Link>
      </div>

      {/* Body */}
      <div className="px-4 pb-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            {/* Thumbnail */}
            <div ref={thumbRef} className="-mt-10 flex-shrink-0">
              <div className="h-20 w-20 overflow-hidden rounded-2xl border-4 border-card bg-muted shadow-md transition-transform duration-300 hover:scale-[1.03] sm:h-24 sm:w-24">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="Thumbnail"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Title block */}
            <div className="min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                  {title}
                </h1>
                <Badge
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1.5 text-xs",
                    status === "published"
                      ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-700"
                      : "border-amber-500/30 bg-amber-500/15 text-amber-700"
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
              <div className="mt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  title="Copy course code"
                  className="group/code inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {code}
                  {copied ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3 opacity-0 transition-opacity group-hover/code:opacity-100" />
                  )}
                </button>
                {/* <p className="hidden line-clamp-1 text-xs text-muted-foreground sm:block">
                  {description}
                </p> */}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" asChild className="group">
              <Link href={`/admin/courses/${courseSlug}/edit`}>
                <Pencil className="mr-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:-rotate-12" />
                Edit
              </Link>
            </Button>
            {/* <Button
              variant="secondary"
              size="sm"
              className="group bg-emerald-600/10 text-emerald-700 transition-colors hover:bg-emerald-600/20"
            >
              <UploadCloud className="mr-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
              Publish
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="group text-muted-foreground hover:text-destructive"
            >
              <Archive className="mr-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-6" />
              Archive
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
