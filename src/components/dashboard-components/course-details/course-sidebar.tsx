"use client";

import Image from "next/image";
import { ClipboardCheck, Clock, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import { Topic } from "@/types/topic";
import { formatDuration, useCourseAction } from "../../../actions/use-course";

interface Props {
  course: Course;
  topics: Topic[];
  completedTopics: string[];
  totalMinutes: number;
}

function ProgressRing({
  value,
  size = 64,
  stroke = 6,
}: {
  value: number;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Course progress"
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (value / 100) * c}
          className="stroke-emerald-500 transition-[stroke-dashoffset] duration-700 motion-reduce:transition-none"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums">
        {value}%
      </span>
    </div>
  );
}

const ctaClass =
  "w-full bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:ring-emerald-500/50";

/* Desktop: sticky enrollment panel */
export function CourseSidebar({
  course,
  topics,
  completedTopics,
  totalMinutes,
}: Props) {
  const a = useCourseAction(course, topics, completedTopics);

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-6 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        {course.thumbnail && (
          <div className="relative aspect-video w-full bg-muted">
            <Image
              src={course.thumbnail}
              alt={course.title ?? ""}
              fill
              sizes="380px"
              className="object-cover"
            />
          </div>
        )}

        <div className="space-y-5 p-5">
          {a.isEnrolled ? (
            <div className="flex items-center gap-4">
              <ProgressRing value={a.progress} />
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-semibold">
                  {a.completedCount} of {topics.length} topics done
                </p>
                {a.nextTopic && a.completedCount < topics.length && (
                  <p className="truncate text-sm capitalize text-muted-foreground">
                    Up next: {a.nextTopic.title}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enroll to unlock every topic and quiz, and track your progress.
            </p>
          )}

          <Button
            size="lg"
            className={ctaClass}
            onClick={a.onCta}
            disabled={a.saving}
          >
            {a.ctaLabel}
          </Button>

          <ul className="space-y-3 border-t border-border/60 pt-4 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <Layers className="size-4 text-foreground/70" />
              {topics.length} {topics.length === 1 ? "topic" : "topics"}
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="size-4 text-foreground/70" />
              {formatDuration(totalMinutes)} of reading
            </li>
            <li className="flex items-center gap-2.5">
              <ClipboardCheck className="size-4 text-foreground/70" />A quiz
              with every topic
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

/* Mobile: sticky bottom bar, thumb-reachable CTA */
export function MobileEnrollBar({
  course,
  topics,
  completedTopics,
}: Omit<Props, "totalMinutes">) {
  const a = useCourseAction(course, topics, completedTopics);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-4">
        <div className="min-w-0 flex-1">
          {a.isEnrolled ? (
            <>
              <p className="text-xs font-medium text-muted-foreground">
                {a.progress}% complete
              </p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-[width] duration-700 motion-reduce:transition-none"
                  style={{ width: `${a.progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <p className="truncate text-sm font-semibold">{course.title}</p>
              <p className="text-xs text-muted-foreground">
                {topics.length} {topics.length === 1 ? "topic" : "topics"}
              </p>
            </>
          )}
        </div>
        <Button
          size="lg"
          className="shrink-0 bg-emerald-600 text-white hover:bg-emerald-500"
          onClick={a.onCta}
          disabled={a.saving}
        >
          {a.ctaLabel}
        </Button>
      </div>
    </div>
  );
}
