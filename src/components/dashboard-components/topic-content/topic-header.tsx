"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, Clock, Maximize2, Minimize2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DifficultyLevel, Topic } from "@/types/topic";

const DIFFICULTY_VARIANT: Record<DifficultyLevel, "success" | "warning" | "danger"> = {
  beginner: "success",
  intermediate: "warning",
  advanced: "danger",
};

interface TopicHeaderProps {
  topic: Topic;
  courseName: string;
  topicNumber: number;
  totalTopics: number;
  isCompleted: boolean;
  focus: boolean;
  onToggleFocus: () => void;
}

export function TopicHeader({
  topic,
  courseName,
  topicNumber,
  totalTopics,
  isCompleted,
  focus,
  onToggleFocus,
}: TopicHeaderProps) {
  const courseHref = `/dashboard/courses/${topic.course_id}`;

  return (
    <header className="animate-fade-up space-y-6 pb-8">
      <div className="flex items-center justify-between gap-3">
        {/* Mobile: one back link. Desktop: breadcrumb. */}
        <Link
          href={courseHref}
          className="inline-flex min-h-11 max-w-full items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground sm:hidden"
        >
          <ArrowLeft className="size-4 shrink-0" />
          <span className="truncate">{courseName || "Back to course"}</span>
        </Link>
        <nav aria-label="Breadcrumb" className="hidden min-w-0 sm:block">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/dashboard/courses" className="font-semibold hover:text-foreground">
                My courses
              </Link>
            </li>
            <ChevronRight className="size-3.5 shrink-0" aria-hidden />
            <li className="min-w-0 truncate">
              <Link href={courseHref} className="font-semibold hover:text-foreground">
                {courseName}
              </Link>
            </li>
          </ol>
        </nav>

        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-pressed={focus}
          onClick={onToggleFocus}
          className="hidden shrink-0 xl:inline-flex"
        >
          {focus ? <Minimize2 /> : <Maximize2 />}
          {focus ? "Exit focus" : "Focus mode"}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="inline-flex items-center rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-soft-foreground">
            Topic {topicNumber} of {totalTopics}
          </span>
          <Badge variant={DIFFICULTY_VARIANT[topic.difficulty]} className="capitalize">
            {topic.difficulty}
          </Badge>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-3.5" aria-hidden />
            {topic.estimated_time} min read
          </span>
          {isCompleted && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-success">
              <CheckCircle2 className="size-4" aria-hidden />
              Completed
            </span>
          )}
        </div>

        <h1 className="max-w-3xl text-balance font-heading text-[32px] font-extrabold capitalize leading-[1.1] tracking-tight sm:text-[44px]">
          {topic.title}
        </h1>
        {topic.description && (
          <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
            {topic.description}
          </p>
        )}
      </div>
    </header>
  );
}
