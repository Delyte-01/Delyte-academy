"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DifficultyLevel, Topic } from "@/types/topic";

const difficultyStyles: Record<DifficultyLevel, string> = {
  beginner:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  intermediate:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  advanced:
    "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400",
};

interface TopicHeaderProps {
  topic: Topic;
  courseName: string;
  topicNumber: number;
  totalTopics: number;
  isCompleted: boolean;
}

export function TopicHeader({
  topic,
  courseName,
  topicNumber,
  totalTopics,
  isCompleted,
}: TopicHeaderProps) {
  const courseHref = `/dashboard/courses/${topic.course_id}`;

  return (
    <header className="space-y-5 border-b border-border/60 pb-8">
      {/* Mobile: one back link. Desktop: full breadcrumb. */}
      <Link
        href={courseHref}
        className="inline-flex max-w-full items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:hidden"
      >
        <ArrowLeft className="size-4 shrink-0" />
        <span className="truncate">{courseName || "Back to course"}</span>
      </Link>
      <nav aria-label="Breadcrumb" className="hidden sm:block">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link
              href="/dashboard"
              className="font-medium hover:text-foreground"
            >
              Dashboard
            </Link>
          </li>
          <ChevronRight className="size-3.5 shrink-0" aria-hidden />
          <li>
            <Link
              href="/dashboard/courses"
              className="font-medium hover:text-foreground"
            >
              My courses
            </Link>
          </li>
          <ChevronRight className="size-3.5 shrink-0" aria-hidden />
          <li className="min-w-0 truncate">
            <Link
              href={courseHref}
              className="font-medium hover:text-foreground"
            >
              {courseName}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            Topic {topicNumber} of {totalTopics}
          </span>
          <Badge
            variant="outline"
            className={cn("capitalize", difficultyStyles[topic.difficulty])}
          >
            {topic.difficulty}
          </Badge>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {topic.estimated_time} min read
          </span>
          {isCompleted && (
            <span className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
              Completed
            </span>
          )}
        </div>

        <h1 className="max-w-3xl text-balance text-3xl font-semibold capitalize leading-tight tracking-tight sm:text-4xl">
          {topic.title}
        </h1>
        {topic.description && (
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {topic.description}
          </p>
        )}
      </div>
    </header>
  );
}
