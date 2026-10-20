"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Topic } from "@/types/topic";

interface TopicNavigationProps {
  topic: Topic;
  previousTopic: Topic | null;
  nextTopic: Topic | null;
  hasQuiz?: boolean;
  isCompleted: boolean;
  completing: boolean;
  onComplete: () => void;
}

export function TopicNavigation({
  topic,
  previousTopic,
  nextTopic,
  hasQuiz = true,
  isCompleted,
  completing,
  onComplete,
}: TopicNavigationProps) {
  return (
    <div className="space-y-5 border-t border-border/60 pt-8">
      <section className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full transition-colors",
              isCompleted
                ? "bg-emerald-500 text-white"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Check className="size-5" strokeWidth={2.5} />
          </span>
          <div className="space-y-0.5">
            <h2 className="font-semibold">
              {isCompleted ? "Topic completed" : "Finished this topic?"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isCompleted
                ? "Nice work. Your course progress is up to date."
                : "Mark it complete to update your course progress."}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {hasQuiz && (
            <Button variant="outline" asChild>
              <Link href={`/dashboard/topics/${topic.id}/quiz`}>
                <ClipboardCheck className="mr-2 size-4" />
                Take quiz
              </Link>
            </Button>
          )}
          {!isCompleted && (
            <Button
              onClick={onComplete}
              disabled={completing}
              className="bg-emerald-600 text-white hover:bg-emerald-500"
            >
              {completing ? "Saving…" : "Mark as complete"}
            </Button>
          )}
        </div>
      </section>

      <nav aria-label="Topic navigation" className="grid gap-3 sm:grid-cols-2">
        {previousTopic && (
          <NavCard
            href={`/dashboard/topics/${previousTopic.id}`}
            label="Previous topic"
            title={previousTopic.title}
            dir="prev"
          />
        )}
        {nextTopic ? (
          <NavCard
            href={`/dashboard/topics/${nextTopic.id}`}
            label="Next topic"
            title={nextTopic.title}
            dir="next"
            className="sm:col-start-2"
          />
        ) : (
          <NavCard
            href={`/dashboard/courses/${topic.course_id}`}
            label="You've reached the end"
            title="Back to course"
            dir="end"
            className="sm:col-start-2"
          />
        )}
      </nav>
    </div>
  );
}

function NavCard({
  href,
  label,
  title,
  dir,
  className,
}: {
  href: string;
  label: string;
  title: string;
  dir: "prev" | "next" | "end";
  className?: string;
}) {
  const Icon =
    dir === "prev" ? ArrowLeft : dir === "next" ? ArrowRight : BookOpen;
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:border-emerald-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
        dir !== "prev" && "flex-row-reverse text-right",
        className,
      )}
    >
      <Icon className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-emerald-600" />
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-muted-foreground">{label}</span>
        <span className="block truncate text-sm font-semibold capitalize">
          {title}
        </span>
      </span>
    </Link>
  );
}
