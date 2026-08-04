"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
// import type { CourseProgressItem } from "./progress-data";
import Image from "next/image";
import { CourseProgressItem } from "@/types/progress";

interface CourseProgressSectionProps {
  courses: CourseProgressItem[];
}

export function CourseProgressSection({ courses }: CourseProgressSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold">Course Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col gap-4 rounded-2xl border p-4 transition-all hover:shadow-sm sm:flex-row sm:items-center"
          >
            {/* Thumbnail */}
            <div className="h-16 w-full flex-shrink-0 overflow-hidden rounded-xl sm:w-24">
              {course.thumbnail ? (
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  width={96}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-foreground">
                  {course.title}
                </h3>
                <span className="flex-shrink-0 text-sm font-extrabold text-emerald-600">
                  {course.progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>
                  {course.completedTopics} / {course.totalTopics} topics
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last studied {course.lastStudied}
                </span>
              </div>
            </div>

            {/* Continue button */}
            <Button
              variant="outline"
              size="sm"
              className="flex-shrink-0"
              asChild
            >
              <Link href={`/dashboard/courses/${course.id}`}>
                Continue
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
