"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ClipboardCheck, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Topic } from "@/types/topic";

interface TopicNavigationProps {
  topic: Topic;
  previousTopic: Topic | null;
  nextTopic: Topic | null;
  hasQuiz?: boolean;
}

export function TopicNavigation({
  topic,
  previousTopic,
  nextTopic,
  hasQuiz = true,
}: TopicNavigationProps) {
  return (
    <div className="mb-3 flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
      {/* Prev / Next — 2-up grid on mobile, inline on desktop */}
      <div className="order-1 grid grid-cols-2 gap-2 sm:order-none sm:flex sm:w-auto sm:gap-3">
        {previousTopic ? (
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href={`/dashboard/topics/${previousTopic.id}`}>
              <ArrowLeft className="mr-1.5 h-4 w-4 flex-shrink-0" />
              <span className="truncate">Previous</span>
            </Link>
          </Button>
        ) : (
          <Button variant="outline" className="w-full sm:w-auto" disabled>
            <ArrowLeft className="mr-1.5 h-4 w-4 flex-shrink-0" />
            Previous
          </Button>
        )}

        {nextTopic ? (
          <Button variant="outline" className="w-full sm:hidden" asChild>
            <Link href={`/dashboard/topics/${nextTopic.id}`}>
              <span className="truncate">Next</span>
              <ArrowRight className="ml-1.5 h-4 w-4 flex-shrink-0" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" className="w-full sm:hidden" disabled>
            Next
            <ArrowRight className="ml-1.5 h-4 w-4 flex-shrink-0" />
          </Button>
        )}
      </div>

      {/* Center actions */}
      <div className="order-3 flex flex-col gap-2 sm:order-none sm:flex-row">
        <Button variant="ghost" className="w-full sm:w-auto" asChild>
          <Link href={`/dashboard/courses/${topic.course_id}`}>
            <BookOpen className="mr-1.5 h-4 w-4" />
            Back to Course
          </Link>
        </Button>
        {hasQuiz && (
          <Button
            size="lg"
            className="w-full shadow-sm transition-transform hover:scale-[1.02] sm:w-auto"
            asChild
          >
            <Link
              href={`/dashboard/topics/${topic.id}/quiz`}
              className="flex items-center justify-center gap-2"
            >
              <ClipboardCheck className="h-4 w-4" />
              Take Quiz
            </Link>
          </Button>
        )}
      </div>

      {/* Next — desktop only (mobile version lives in the grid above) */}
      <div className="order-2 hidden sm:order-none sm:block">
        {nextTopic ? (
          <Button variant="outline" asChild>
            <Link href={`/dashboard/topics/${nextTopic.id}`}>
              Next Topic
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            Next Topic
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
