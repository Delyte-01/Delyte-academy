"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Clock, EyeOff, FolderTree, Pencil, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  WorkspaceHero,
  WorkspaceMedia,
} from "@/components/admin/workspace/workspace-hero";
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

const DIFFICULTY_VARIANT = {
  beginner: "success",
  intermediate: "warning",
  advanced: "danger",
} as const;

export function TopicWorkspaceHeader({
  title,
  description,
  difficulty,
  duration,
  status,
  courseSlug,
  onChangeStatus,
}: TopicWorkspaceHeaderProps) {
  const params = useParams();
  const courseId = params.id as string;
  const topicId = params.topicsId as string;

  return (
    <WorkspaceHero
      backHref={`/admin/courses/${courseSlug}`}
      backLabel="Back to course"
      media={
        <WorkspaceMedia>
          <FolderTree className="size-8" aria-hidden />
        </WorkspaceMedia>
      }
      title={title}
      badges={<StatusBadge status={status} />}
      meta={
        <>
          <Badge variant={DIFFICULTY_VARIANT[difficulty]} className="capitalize">
            {difficulty}
          </Badge>
          <span className="inline-flex items-center gap-1.5 tabular-nums">
            <Clock className="size-4" aria-hidden />
            {duration} min
          </span>
        </>
      }
      description={description}
      actions={
        <>
          <Button variant="outline" asChild>
            <Link href={`/admin/courses/${courseId}/topics/${topicId}/edit`}>
              <Pencil className="size-4" />
              Edit
            </Link>
          </Button>
          {status === "published" ? (
            <Button variant="secondary" onClick={() => onChangeStatus(topicId, "draft")}>
              <EyeOff className="size-4" />
              Unpublish
            </Button>
          ) : (
            <Button variant="brand" onClick={() => onChangeStatus(topicId, "published")}>
              <UploadCloud className="size-4" />
              Publish
            </Button>
          )}
        </>
      }
    />
  );
}
