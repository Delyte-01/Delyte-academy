"use client";

import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";

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
      {/* Mobile: compact back-link, avoids a wrapping/overflowing trail on small screens */}
      <Link
        href={`/dashboard/topics/${topicId}`}
        className="flex items-center gap-1.5 font-medium transition-colors hover:text-foreground sm:hidden"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="truncate">{topicTitle}</span>
      </Link>

      {/* Desktop / tablet: full breadcrumb, scrolls horizontally instead of wrapping if it's tight */}
      <div className="hidden items-center gap-2 overflow-x-auto whitespace-nowrap sm:flex [&::-webkit-scrollbar]:hidden">
        <Link
          href="/dashboard"
          className="flex-shrink-0 font-medium transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
        <Link
          href="/dashboard/courses"
          className="flex-shrink-0 font-medium transition-colors hover:text-foreground"
        >
          My Courses
        </Link>
        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
        <Link
          href={`/dashboard/courses/${courseId}`}
          className="max-w-[10rem] flex-shrink-0 truncate font-medium transition-colors hover:text-foreground lg:max-w-none"
        >
          {courseName}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
        <Link
          href={`/dashboard/topics/${topicId}`}
          className="max-w-[10rem] flex-shrink-0 truncate font-medium transition-colors hover:text-foreground lg:max-w-none"
        >
          {topicTitle}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="flex-shrink-0 truncate font-medium text-foreground">
          {quizTitle}
        </span>
      </div>
    </div>
  );
}
