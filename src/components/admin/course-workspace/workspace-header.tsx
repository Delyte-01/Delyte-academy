"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Check, Copy, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  WorkspaceHero,
  WorkspaceMedia,
} from "@/components/admin/workspace/workspace-hero";

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
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable — nothing to recover, the code is still visible.
    }
  };

  return (
    <WorkspaceHero
      backHref="/admin/courses"
      backLabel="All courses"
      cover={banner}
      media={
        <WorkspaceMedia>
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnail} alt="" className="size-full object-cover" />
          ) : (
            <BookOpen className="size-8" aria-hidden />
          )}
        </WorkspaceMedia>
      }
      title={title}
      badges={<StatusBadge status={status} />}
      meta={
        <button
          type="button"
          onClick={handleCopyCode}
          aria-label={`Copy course code ${code}`}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-muted px-2.5 font-mono text-xs font-bold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {code}
          {copied ? (
            <Check className="size-3.5 text-success" aria-hidden />
          ) : (
            <Copy className="size-3.5" aria-hidden />
          )}
        </button>
      }
      actions={
        <Button variant="outline" asChild>
          <Link href={`/admin/courses/${courseSlug}/edit`}>
            <Pencil className="size-4" />
            Edit course
          </Link>
        </Button>
      }
    />
  );
}
