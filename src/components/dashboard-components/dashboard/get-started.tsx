"use client";

import Link from "next/link";
import { ArrowRight, Bell, BookOpen, ClipboardCheck, Compass, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-states";
import { CourseCardView } from "@/components/dashboard-components/courses/course-card";
import { useStudentCourses } from "@/hooks/useStudentCourses";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: Compass,
    title: "Choose a course",
    text: "Browse what is published and open one that fits what you are studying.",
  },
  {
    icon: BookOpen,
    title: "Study your first topic",
    text: "Work through lessons at your own pace. Your progress is saved as you go.",
  },
  {
    icon: ClipboardCheck,
    title: "Try a practice quiz",
    text: "Timed, CBT-style and scored automatically, so exam day feels familiar.",
  },
] as const;

/**
 * Replaces the row of zero-value stat cards for a student with no enrollments:
 * three clear first steps, with the first one actionable.
 */
export function GetStartedChecklist() {
  return (
    <section aria-labelledby="get-started" className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
      <h2 id="get-started" className="font-heading text-xl font-extrabold tracking-tight text-foreground">
        Your first three steps
      </h2>
      <ol className="mt-5 grid gap-3 md:grid-cols-3 md:gap-4">
        {STEPS.map(({ icon: Icon, title, text }, i) => {
          const current = i === 0;
          return (
            <li
              key={title}
              aria-current={current ? "step" : undefined}
              className={cn(
                "flex gap-4 rounded-xl border p-4 md:flex-col md:gap-3",
                current ? "border-primary/40 bg-primary-soft/50" : "bg-background",
              )}
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground">
                  <span className="tabular-nums text-muted-foreground">{i + 1}. </span>
                  {title}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <Button asChild variant="brand" size="lg" className="mt-5 w-full sm:w-auto">
        <Link href="/dashboard/courses">
          Browse courses
          <ArrowRight aria-hidden />
        </Link>
      </Button>
    </section>
  );
}

/** Up to three real published courses, so a new student can start in one tap. */
export function SuggestedCourses() {
  const { courses, loading } = useStudentCourses();

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3" aria-busy>
        {[0, 1, 2].map((n) => (
          <Skeleton key={n} className="h-72 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="No courses are published yet"
        description="You'll get a notification here as soon as a new course goes live."
        action={
          <Button asChild variant="outline">
            <Link href="/dashboard/courses">
              <GraduationCap />
              Check the catalogue
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
      {courses.slice(0, 3).map((course) => (
        <CourseCardView key={course.id} {...course} />
      ))}
    </div>
  );
}
