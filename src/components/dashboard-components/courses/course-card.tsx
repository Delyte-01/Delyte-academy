"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Course } from "@/types/course";
import { useEnrollment } from "@/context/enrollment-context";

/** Stable, on-brand fallback artwork per course (blend of the two brand tokens). */
function coverStyle(id: string | number): React.CSSProperties {
  const sum = Array.from(String(id)).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const mix = 20 + (sum % 6) * 12; // 20 … 80
  return {
    backgroundImage: `linear-gradient(135deg, color-mix(in oklab, var(--brand-from) ${100 - mix}%, var(--brand-to)), color-mix(in oklab, var(--brand-to) ${100 - mix}%, var(--brand-from)))`,
  };
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
 * Presentation-only course card with a cursor-tracking glow. Use directly when
 * the parent already has the learner's enrollments.
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
    <SpotlightCard className="group flex h-full flex-col transition-[border-color,box-shadow] duration-200 hover:border-primary/30 hover:shadow-float has-[a:focus-visible]:ring-[3px] has-[a:focus-visible]:ring-ring/40">
      {/* Cover */}
      <div
        className="relative aspect-[16/9] w-full shrink-0 overflow-hidden"
        style={thumbnail ? undefined : coverStyle(id)}
      >
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-foreground/15 ring-1 ring-primary-foreground/25">
              <BookOpen className="size-6 text-primary-foreground/90" aria-hidden />
            </span>
          </div>
        )}

        {code && (
          <span className="absolute left-3 top-3 rounded-lg bg-card/90 px-2.5 py-1 text-xs font-bold tracking-wide text-foreground shadow-soft backdrop-blur-sm">
            {code}
          </span>
        )}

        {isCompleted && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg bg-success-soft px-2.5 py-1 text-xs font-bold text-success shadow-soft">
            <CheckCircle2 className="size-3.5" aria-hidden />
            Completed
          </span>
        )}
        {inProgress && (
          <span className="absolute right-3 top-3 rounded-lg bg-card/90 px-2.5 py-1 text-xs font-bold text-primary-soft-foreground shadow-soft backdrop-blur-sm">
            In progress
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 font-heading text-lg font-bold capitalize tracking-tight text-foreground">
          {title}
        </h3>
        <p className="mt-1.5 line-clamp-2 min-h-[3rem] text-[15px] leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="mt-auto pt-5">
          {isEnrolled ? (
            <div>
              <div className="mb-2 flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-bold tabular-nums text-foreground">{progress}%</span>
              </div>
              <ProgressBar
                value={progress}
                label={`${title} progress`}
                tone={isCompleted ? "success" : "brand"}
              />
            </div>
          ) : (
            <div className="flex h-[26px] items-center text-[13px] text-muted-foreground">
              Not enrolled yet
            </div>
          )}

          {/* Stretched link: the whole card is one real, focusable link. */}
          <Button
            asChild
            variant={isEnrolled && !isCompleted ? "default" : "outline"}
            className="mt-4 w-full after:absolute after:inset-0"
          >
            <Link href={href}>
              {ctaLabel}
              <ArrowRight className="transition-transform motion-safe:group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </SpotlightCard>
  );
}

/**
 * Drop-in card that looks up its own enrollment from the shared enrollment
 * context. Prefer CourseCardView where enrollments are already loaded.
 */
export function CourseCard(course: Course) {
  const { enrollments } = useEnrollment();
  const enrollment = enrollments.find((e) => e.course_id === course.id);

  return (
    <CourseCardView
      {...course}
      progress={enrollment?.progress ?? 0}
      isEnrolled={Boolean(enrollment)}
    />
  );
}
