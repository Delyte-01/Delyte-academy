"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

interface QuizHeaderProps {
  courseName: string;
  courseId: string;
  topicTitle: string;
  topicId: string;
  quizTitle: string;
}

export function QuizHeader({
  courseName,
  courseId,
  topicTitle,
  topicId,
  quizTitle,
}: QuizHeaderProps) {
  return (
    <div className="text-sm text-muted-foreground">
      {/* Mobile: a single back link instead of a trail that wraps */}
      <Link
        href={`/dashboard/topics/${topicId}`}
        className="inline-flex max-w-full items-center gap-1.5 font-medium transition-colors hover:text-foreground sm:hidden"
      >
        <ArrowLeft className="size-4 shrink-0" />
        <span className="truncate capitalize">{topicTitle}</span>
      </Link>

      <nav aria-label="Breadcrumb" className="hidden sm:block">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              href="/dashboard"
              className="font-medium hover:text-foreground"
            >
              Dashboard
            </Link>
          </li>
          <ChevronRight className="size-3.5 shrink-0" aria-hidden />
          <li>
            <Link
              href="/dashboard/courses"
              className="font-medium hover:text-foreground"
            >
              My courses
            </Link>
          </li>
          <ChevronRight className="size-3.5 shrink-0" aria-hidden />
          <li className="min-w-0 max-w-[12rem] truncate">
            <Link
              href={`/dashboard/courses/${courseId}`}
              className="font-medium hover:text-foreground"
            >
              {courseName}
            </Link>
          </li>
          <ChevronRight className="size-3.5 shrink-0" aria-hidden />
          <li className="min-w-0 max-w-[12rem] truncate">
            <Link
              href={`/dashboard/topics/${topicId}`}
              className="font-medium capitalize hover:text-foreground"
            >
              {topicTitle}
            </Link>
          </li>
          <ChevronRight className="size-3.5 shrink-0" aria-hidden />
          <li
            className="min-w-0 truncate font-medium text-foreground"
            aria-current="page"
          >
            {quizTitle}
          </li>
        </ol>
      </nav>
    </div>
  );
}
