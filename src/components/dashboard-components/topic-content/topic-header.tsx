"use client";

import Link from "next/link";
import {
  ChevronRight,
  Clock,
  Signal,
  CheckCircle2,
  Circle,
  Play,
  ClipboardCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DifficultyLevel, Topic } from "@/types/topic";

const difficultyStyles: Record<DifficultyLevel, string> = {
  beginner: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  intermediate: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  advanced: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
};

interface TopicHeaderProps {
  topic: Topic;
  courseName: string;
}

export function TopicHeader({ topic, courseName }: TopicHeaderProps) {
  // const StatusIcon = statusConfig[topic.status].icon;

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-emerald-900 text-white shadow-xl">
      <CardContent className="relative p-6 lg:p-8">
        <div className="flex flex-col gap-5">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-sm text-emerald-200 overflow-x-auto whitespace-nowrap scrollbar-hide -mx-1 px-1">
            <Link
              href="/dashboard"
              className="hidden sm:inline font-medium transition-colors hover:text-white shrink-0"
            >
              Dashboard
            </Link>
            <ChevronRight className="hidden sm:inline h-3.5 w-3.5 shrink-0" />

            <Link
              href="/dashboard/courses"
              className="font-medium transition-colors hover:text-white shrink-0"
            >
              My Courses
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />

            <Link
              href={`/dashboard/courses/${topic.course_id}`}
              className="font-medium transition-colors hover:text-white shrink-0 max-w-[120px] sm:max-w-none truncate"
            >
              {courseName}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />

            <span className="font-medium text-white capitalize truncate max-w-[140px] sm:max-w-none shrink-0">
              {topic.title}
            </span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold leading-relaxed tracking-wide lg:text-3xl uppercase">
                {topic.title}
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-emerald-100">
                {topic.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge
                  variant="outline"
                  className="border-white/20 bg-white/10 text-white"
                >
                  <Clock className="mr-1 h-3 w-3" />
                  {topic.estimated_time} min read
                </Badge>

                <Badge
                  variant="outline"
                  className={`border ${difficultyStyles[topic.difficulty]}`}
                >
                  {/* <StatusIcon className="mr-1 h-3 w-3" /> */}
                  {topic.difficulty.charAt(0).toUpperCase() +
                    topic.difficulty.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row">
              {/* <Button
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <Play className="mr-1.5 h-4 w-4" />
                Continue Learning
              </Button> */}
              {/* {topic.status !== "completed" && (
                <Button
                  variant="outline"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  <CheckCircle2 className="mr-1.5 h-4 w-4" />
                  Mark as Complete
                </Button>
              )}
              {topic.hasQuiz && (
                <Button className="bg-white text-emerald-700 hover:bg-emerald-50">
                  <ClipboardCheck className="mr-1.5 h-4 w-4" />
                  Take Quiz
                </Button>
              )} */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
