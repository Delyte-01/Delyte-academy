"use client";

import Link from "next/link";
import { ChevronRight, Home, Clock, Save, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentEditor } from "./content-editor";
import { ContentSidebar } from "./content-sidebar";
import { cn } from "@/lib/utils";
import { TopicContentFormData, TopicStatus } from "@/types/topic";

type Status = "draft" | "published";
type Difficulty = "beginner" | "intermediate" | "advanced";

interface ContentTabProps {
  data: TopicContentFormData;

  onChange: <K extends keyof TopicContentFormData>(
    field: K,
    value: TopicContentFormData[K]
  ) => void;

  addListItem: (field: "objectives" | "prerequisites") => void;

  updateListItem: (
    field: "objectives" | "prerequisites",
    index: number,
    value: string
  ) => void;

  removeListItem: (
    field: "objectives" | "prerequisites",
    index: number
  ) => void;

  onSave: (status: TopicStatus) => void;
  topicTitle: string;
  topicId: string;
  description: string;
  status: Status;
  difficulty: Difficulty;
  lastUpdated: string;
  createdAt: string;
  readingTime: number;
  courseSlug: string;
  courseName: string;
}
const statusStyles: Record<Status, string> = {
  published: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700",
  draft: "border-amber-500/30 bg-amber-500/15 text-amber-700",
};

const difficultyStyles: Record<Difficulty, string> = {
  beginner: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700",
  intermediate: "border-amber-500/30 bg-amber-500/15 text-amber-700",
  advanced: "border-rose-500/30 bg-rose-500/15 text-rose-700",
};

export function ContentTab({
  data,
  onChange,
  onSave,
  addListItem,
  removeListItem,
  updateListItem,
  courseName,
  courseSlug,
  topicTitle,
  topicId,
  description,
  status,
  difficulty,
  readingTime,
  lastUpdated,
  createdAt,
}: ContentTabProps) {
  const handleSaveDraft = () => onSave("draft");

  const handlePublish = () => onSave("published");

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="space-y-4">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 text-sm">
          <Link
            href="/admin"
            className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          <Link
            href="/admin/courses"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Courses
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          <Link
            href={`/admin/courses/${courseSlug}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {courseName}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          <Link
            href={`/admin/courses/${courseSlug}/topics/${topicId}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {topicTitle}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          <span className="font-medium text-foreground">Content</span>
        </nav>

        {/* Title row */}
        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                {topicTitle}
              </h1>
              <Badge
                variant="outline"
                className={cn("text-xs", statusStyles[status])}
              >
                {status}
              </Badge>
              <Badge
                variant="outline"
                className={cn("text-xs", difficultyStyles[difficulty])}
              >
                {difficulty}
              </Badge>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {readingTime} read
            </div>
          </div>

          {/* Header actions */}
          <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveDraft}>
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Save Draft
            </Button>
            <Button variant="secondary" size="sm" onClick={handlePublish}>
              <UploadCloud className="mr-1.5 h-3.5 w-3.5" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Two-column layout ~70/30 */}
      <div className="grid gap-6 lg:grid-cols-10">
        <div className="lg:col-span-7">
          <ContentEditor
            data={data}
            onChange={onChange}
            addListItem={addListItem}
            updateListItem={updateListItem}
            removeListItem={removeListItem}
          />
        </div>
        <div className="lg:col-span-3">
          <ContentSidebar
            status={status}
            lastUpdated={lastUpdated}
            createdAt={createdAt}
            readingTime={readingTime}
            difficulty={difficulty}
          />
        </div>
      </div>
    </div>
  );
}
