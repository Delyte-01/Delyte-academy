"use client";

import Link from "next/link";
import { ArrowRight, Compass, PartyPopper, Play, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/motion/count-up";
import { ProgressRing } from "@/components/motion/progress-ring";

interface ContinueLearningCourse {
  id: string;
  title: string;
  course_code?: string | null;
}

interface ContinueLearningEnrollment {
  progress: number;
  course?: ContinueLearningCourse | null;
}

interface ContinueLearningHeroProps {
  enrollment: ContinueLearningEnrollment;
  /** Real next topic of the course (first one not yet completed), when known. */
  nextTopic?: { id: string; title: string } | null;
  /** Completed / total topics, when known. */
  topicStats?: { done: number; total: number } | null;
}

const shell =
  "bg-brand-wash relative overflow-hidden rounded-2xl border bg-card shadow-card";

/** The one answer to "what should I do next?" for a student with a course in progress. */
export function ContinueLearningHero({
  enrollment,
  nextTopic,
  topicStats,
}: ContinueLearningHeroProps) {
  const progress = Math.max(0, Math.min(100, Math.round(enrollment.progress)));
  const course = enrollment.course;
  const courseHref = `/dashboard/courses/${course?.id ?? ""}`;
  const resumeHref = nextTopic ? `/dashboard/topics/${nextTopic.id}` : courseHref;

  return (
    <section aria-label="Continue learning" className={shell}>
      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-10">
        <div className="min-w-0 space-y-5">
          <div className="space-y-3">
            <p className="inline-flex items-center rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-soft-foreground">
              Continue learning
            </p>
            <h2 className="line-clamp-2 font-heading text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-[32px]">
              {course?.title ?? "Untitled course"}
            </h2>
            {nextTopic ? (
              <p className="text-[15px] text-muted-foreground">
                Up next:{" "}
                <span className="font-semibold capitalize text-foreground">{nextTopic.title}</span>
              </p>
            ) : (
              course?.course_code && (
                <p className="text-[15px] text-muted-foreground">{course.course_code}</p>
              )
            )}
            {topicStats && topicStats.total > 0 && (
              <p className="text-sm tabular-nums text-muted-foreground">
                {topicStats.done} of {topicStats.total} topics completed
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="brand" size="lg" className="w-full sm:w-auto">
              <Link href={resumeHref}>
                <Play className="fill-current" />
                {progress > 0 ? "Resume learning" : "Start learning"}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href={courseHref}>
                Course overview
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex justify-start md:justify-end">
          <ProgressRing value={progress} size={136} stroke={11} label="Course progress">
            <span className="flex flex-col items-center leading-none">
              <CountUp
                value={progress}
                suffix="%"
                className="font-heading text-[28px] font-extrabold tabular-nums text-foreground"
              />
              <span className="mt-1 text-[13px] font-medium text-muted-foreground">complete</span>
            </span>
          </ProgressRing>
        </div>
      </div>
    </section>
  );
}

/** Shown when the student has no course in progress. */
export function StartLearningHero({ hasCompleted }: { hasCompleted: boolean }) {
  return (
    <section aria-label="Find your next course" className={shell}>
      <div className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-3">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-soft-foreground">
            {hasCompleted ? <PartyPopper className="size-3.5" /> : <Sparkles className="size-3.5" />}
            {hasCompleted ? "All caught up" : "Get started"}
          </p>
          <h2 className="font-heading text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-[32px]">
            {hasCompleted ? "Ready for your next course?" : "Start your first course"}
          </h2>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            {hasCompleted
              ? "You've finished everything you enrolled in. Browse the catalogue and keep the momentum going."
              : "Browse the catalogue, pick a course and your progress will show up right here."}
          </p>
        </div>
        <Button asChild variant="brand" size="lg" className="w-full md:w-auto">
          <Link href="/dashboard/courses">
            <Compass />
            Browse courses
          </Link>
        </Button>
      </div>
    </section>
  );
}
