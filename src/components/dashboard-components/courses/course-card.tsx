"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import { useEnrollment } from "@/hooks/useEnrollment";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

/** Fallback artwork for courses without a thumbnail. Picked by id so it stays stable. */
const PLACEHOLDER_GRADIENTS = [
  "from-emerald-700 to-teal-900",
  "from-teal-600 to-cyan-900",
  "from-slate-700 to-slate-900",
  "from-indigo-700 to-slate-900",
  "from-violet-700 to-slate-900",
] as const;

function gradientFor(id: string | number): string {
  const sum = Array.from(String(id)).reduce(
    (acc, ch) => acc + ch.charCodeAt(0),
    0,
  );
  return PLACEHOLDER_GRADIENTS[sum % PLACEHOLDER_GRADIENTS.length];
}

type CourseCardData = Pick<
  Course,
  "id" | "title" | "course_code" | "thumbnail" | "description"
>;

export interface CourseCardViewProps extends CourseCardData {
  /** 0–100. Ignored when the learner isn't enrolled. */
  progress?: number;
  isEnrolled?: boolean;
}

/**
 * Pure presentation. Use this directly when the parent already has the
 * learner's enrollments (e.g. the My Courses page) so the card doesn't need
 * to look them up itself.
 */
export function CourseCardView({
  id,
  title,
  course_code: code,
  thumbnail,
  description,
  progress: rawProgress = 0,
  isEnrolled = false,
}: CourseCardViewProps) {
  const progress = Math.max(0, Math.min(100, Math.round(rawProgress)));
  const isCompleted = isEnrolled && progress >= 100;
  const inProgress = isEnrolled && !isCompleted && progress > 0;
  const href = `/dashboard/courses/${id}`;

  const ctaLabel = !isEnrolled
    ? "View course"
    : isCompleted
      ? "Review course"
      : progress > 0
        ? "Continue learning"
        : "Start learning";

  return (
    <Card className="group relative flex h-full flex-col gap-0 overflow-hidden rounded-2xl border-border/60 py-0 shadow-sm transition-all duration-300 hover:border-border hover:shadow-xl hover:shadow-black/5 motion-safe:hover:-translate-y-1 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring">
      {/* Cover */}
      <div
        className={cn(
          "relative aspect-[16/9] w-full flex-shrink-0 overflow-hidden bg-gradient-to-br",
          gradientFor(id),
        )}
      >
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm">
              <BookOpen className="h-7 w-7 text-white/80" />
            </div>
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent"
        />

        {code && (
          <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white ring-1 ring-white/20 backdrop-blur-md">
            {code}
          </span>
        )}

        {isCompleted && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        )}
        {inProgress && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-900 shadow-sm">
            In progress
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-base font-semibold capitalize tracking-tight text-foreground">
          {title}
        </h3>
        <p className="mt-1.5 line-clamp-2 min-h-[2.85rem] text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="mt-auto pt-5">
          {isEnrolled ? (
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold tabular-nums text-foreground">
                  {progress}%
                </span>
              </div>
              <div
                className="h-1.5 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${title} progress: ${progress}%`}
              >
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    isCompleted ? "bg-emerald-500" : "bg-primary",
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex h-7 items-center text-xs text-muted-foreground">
              Not enrolled yet
            </div>
          )}

          {/* The link is stretched over the whole card, so the card is one
              real, keyboard-focusable link (middle-click and "open in new tab"
              work too). */}
          <Button
            asChild
            variant={isEnrolled && !isCompleted ? "default" : "outline"}
            className="mt-4 w-full rounded-full after:absolute after:inset-0"
          >
            <Link href={href}>
              {ctaLabel}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform motion-safe:group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

/**
 * Drop-in replacement for the old card: same props, looks up its own
 * enrollment. Prefer CourseCardView where enrollments are already loaded.
 */
export function CourseCard(course: Course) {
  const { user } = useAuth();
  const { enrollments } = useEnrollment(user?.id);
  const enrollment = enrollments.find((e) => e.course_id === course.id);

  return (
    <CourseCardView
      {...course}
      progress={enrollment?.progress ?? 0}
      isEnrolled={Boolean(enrollment)}
    />
  );
}
