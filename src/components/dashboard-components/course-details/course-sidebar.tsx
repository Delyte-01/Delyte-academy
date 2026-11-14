"use client";

import Image from "next/image";
import { ClipboardCheck, Clock, Layers } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { CountUp } from "@/components/motion/count-up";
import { ProgressRing } from "@/components/motion/progress-ring";
import { Course } from "@/types/course";
import { Topic } from "@/types/topic";
import { formatDuration, useCourseAction } from "../../../actions/use-course";

interface Props {
  course: Course;
  topics: Topic[];
  completedTopics: string[];
  totalMinutes: number;
}

/* Desktop: sticky right rail (enroll / progress) */
export function CourseSidebar({ course, topics, completedTopics, totalMinutes }: Props) {
  const a = useCourseAction(course, topics, completedTopics);
  const done = topics.length > 0 && a.completedCount === topics.length;

  return (
    <aside aria-label="Course enrollment" className="hidden lg:block">
      <div className="sticky top-24 overflow-hidden rounded-2xl border bg-card shadow-card">
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
              <ProgressRing value={a.progress} size={84} stroke={8} label="Course progress">
                <CountUp
                  value={a.progress}
                  suffix="%"
                  className="font-heading text-lg font-extrabold tabular-nums text-foreground"
                />
              </ProgressRing>
              <div className="min-w-0 space-y-0.5">
                <p className="text-[15px] font-bold text-foreground">
                  {a.completedCount} of {topics.length} topics done
                </p>
                {a.nextTopic && !done && (
                  <p className="truncate text-sm capitalize text-muted-foreground">
                    Up next: {a.nextTopic.title}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              Enroll to unlock every topic and quiz, and track your progress.
            </p>
          )}

          <Button
            size="lg"
            variant="brand"
            className="w-full"
            onClick={a.onCta}
            disabled={a.saving}
          >
            {a.ctaLabel}
          </Button>

          <ul className="space-y-3 border-t pt-4 text-[15px] text-muted-foreground">
            <li className="flex items-center gap-3">
              <Layers className="size-4 text-primary" aria-hidden />
              {topics.length} {topics.length === 1 ? "topic" : "topics"}
            </li>
            <li className="flex items-center gap-3">
              <Clock className="size-4 text-primary" aria-hidden />
              {formatDuration(totalMinutes)} of reading
            </li>
            <li className="flex items-center gap-3">
              <ClipboardCheck className="size-4 text-primary" aria-hidden />A quiz with every topic
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
    <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-4">
        <div className="min-w-0 flex-1">
          {a.isEnrolled ? (
            <>
              <p className="text-[13px] font-semibold tabular-nums text-muted-foreground">
                {a.progress}% complete
              </p>
              <ProgressBar value={a.progress} size="sm" label="Course progress" className="mt-1.5" />
            </>
          ) : (
            <>
              <p className="truncate text-[15px] font-bold capitalize text-foreground">{course.title}</p>
              <p className="text-[13px] text-muted-foreground">
                {topics.length} {topics.length === 1 ? "topic" : "topics"}
              </p>
            </>
          )}
        </div>
        <Button size="lg" variant="brand" className="shrink-0" onClick={a.onCta} disabled={a.saving}>
          {a.ctaLabel}
        </Button>
      </div>
    </div>
  );
}
