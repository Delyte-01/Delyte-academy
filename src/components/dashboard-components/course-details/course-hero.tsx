"use client";

import Image from "next/image";
import { BookOpen, CheckCircle2, Clock, Layers } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/course";
import { formatDuration } from "@/actions/use-course";

interface CourseHeroProps {
  course: Course;
  topicCount?: number;
  totalMinutes?: number;
  /** Real enrollment state; omit to hide the status chip. */
  enrolled?: boolean;
  progress?: number;
}

/** Cover + title block. Only real data: no ratings or student counts. */
export function CourseHero({
  course,
  topicCount,
  totalMinutes,
  enrolled,
  progress = 0,
}: CourseHeroProps) {
  const completed = enrolled && progress >= 100;

  const meta = [
    !!topicCount && {
      icon: <Layers className="size-4" aria-hidden />,
      label: `${topicCount} ${topicCount === 1 ? "topic" : "topics"}`,
    },
    !!totalMinutes && {
      icon: <Clock className="size-4" aria-hidden />,
      label: formatDuration(totalMinutes),
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string }[];

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-card">
      {/* Cover */}
      <div className="bg-brand-gradient relative h-40 overflow-hidden sm:h-56 lg:h-64">
        {course.banner ? (
          <Image
            src={course.banner}
            alt=""
            fill
            priority
            sizes="(min-width: 1280px) 900px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
            <BookOpen className="size-16 text-primary-foreground/30 sm:size-20" strokeWidth={1.4} />
          </div>
        )}
        {/* Fades the cover into the card below */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card to-transparent"
        />
      </div>

      {/* Title block */}
      <div className="relative -mt-10 space-y-4 px-5 pb-6 sm:-mt-14 sm:px-8 sm:pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand">{course.course_code}</Badge>
          {completed ? (
            <Badge variant="success">
              <CheckCircle2 className="size-3.5" aria-hidden /> Completed
            </Badge>
          ) : enrolled ? (
            <Badge variant="info">Enrolled</Badge>
          ) : null}
        </div>

        <h1 className="max-w-3xl text-balance font-heading text-[28px] font-extrabold capitalize leading-tight tracking-tight text-foreground sm:text-[40px]">
          {course.title}
        </h1>

        {course.description && (
          <p className="line-clamp-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {course.description}
          </p>
        )}

        {meta.length > 0 && (
          <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-sm font-medium text-muted-foreground">
            {meta.map((m, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-primary">{m.icon}</span>
                {m.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
