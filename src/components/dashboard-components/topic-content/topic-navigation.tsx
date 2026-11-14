"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, ClipboardCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnimatedCheck } from "@/components/motion/animated-check";
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

/** End of lesson: one clear completion moment, then previous / next. */
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
    <div className="space-y-6 border-t pt-10">
      <section
        aria-labelledby="complete-heading"
        className="bg-brand-wash flex flex-col gap-5 rounded-2xl border bg-card p-6 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-7"
      >
        <div className="flex items-center gap-4">
          <AnimatedCheck done={isCompleted} size={52} />
          <div className="space-y-0.5" aria-live="polite">
            <h2 id="complete-heading" className="font-heading text-lg font-extrabold tracking-tight">
              {isCompleted ? "Topic completed" : "Finished this topic?"}
            </h2>
            <p className="text-[15px] text-muted-foreground">
              {isCompleted
                ? "Nice work. Your course progress is up to date."
                : "Mark it complete to update your course progress."}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {hasQuiz && (
            <Button variant={isCompleted ? "default" : "outline"} size="lg" asChild>
              <Link href={`/dashboard/topics/${topic.id}/quiz`}>
                <ClipboardCheck />
                Take quiz
              </Link>
            </Button>
          )}
          {!isCompleted && (
            <Button variant="brand" size="lg" onClick={onComplete} disabled={completing}>
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
  const Icon = dir === "prev" ? ArrowLeft : dir === "next" ? ArrowRight : BookOpen;
  return (
    <Link
      href={href}
      className={cn(
        "hover-lift group flex min-h-[72px] items-center gap-3 rounded-xl border bg-card p-4 shadow-soft outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
        dir !== "prev" && "flex-row-reverse text-right",
        className,
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground transition-transform group-hover:scale-105 motion-reduce:transition-none">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-muted-foreground">{label}</span>
        <span className="block truncate text-[15px] font-bold capitalize">{title}</span>
      </span>
    </Link>
  );
}
