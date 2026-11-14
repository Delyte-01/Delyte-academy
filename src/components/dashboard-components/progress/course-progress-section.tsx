"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Compass, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { EmptyState } from "@/components/empty-states";
import { CourseProgressItem } from "@/types/progress";
import { Panel } from "./panel";

export function CourseProgressSection({ courses }: { courses: CourseProgressItem[] }) {
  return (
    <Panel
      title="Your courses"
      description="Progress and where to pick up next"
      action={
        courses.length > 0 ? (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/courses">
              All courses <ArrowRight />
            </Link>
          </Button>
        ) : undefined
      }
    >
      {courses.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No courses yet"
          description="Enroll in a course and your progress will show up here."
          className="py-10"
          action={
            <Button asChild>
              <Link href="/dashboard/courses">
                <Compass /> Browse courses
              </Link>
            </Button>
          }
        />
      ) : (
        <ul className="divide-y">
          {courses.map((course) => (
            <li key={course.id} className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
              <div className="h-16 w-full shrink-0 overflow-hidden rounded-xl bg-primary-soft sm:w-28">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt=""
                    width={112}
                    height={64}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="bg-brand-gradient flex size-full items-center justify-center">
                    <GraduationCap className="size-6 opacity-80" aria-hidden />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="truncate text-[15px] font-bold">{course.title}</h3>
                  <span className="shrink-0 text-sm font-extrabold tabular-nums text-primary">
                    {course.progress}%
                  </span>
                </div>
                <ProgressBar value={course.progress} label={`${course.title} progress`} />
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
                  <span className="tabular-nums">
                    {course.completedTopics} / {course.totalTopics} topics
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" aria-hidden />
                    Last studied {course.lastStudied}
                  </span>
                </div>
              </div>

              <Button variant="soft" size="sm" className="shrink-0" asChild>
                <Link href={`/dashboard/courses/${course.id}`}>
                  {course.progress >= 100 ? "Review" : "Continue"}
                  <ArrowRight />
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
