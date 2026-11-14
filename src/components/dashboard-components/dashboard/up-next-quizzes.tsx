"use client";

import Link from "next/link";
import { ClipboardCheck, Clock, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export interface UpNextQuiz {
  id: string;
  title: string;
  course: string;
  topicId: string;
  passingScore?: number | null;
  timeLimit?: number | null;
}

interface UpNextQuizzesProps {
  quizzes: UpNextQuiz[];
  loading?: boolean;
}

/** Real, available quizzes for the student's enrolled courses. */
export function UpNextQuizzes({ quizzes, loading = false }: UpNextQuizzesProps) {
  return (
    <section aria-labelledby="up-next-title" className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id="up-next-title" className="font-heading text-lg font-bold tracking-tight text-foreground">
          Up next
        </h2>
        {quizzes.length > 0 && (
          <Badge variant="brand" size="sm">
            {quizzes.length} {quizzes.length === 1 ? "quiz" : "quizzes"}
          </Badge>
        )}
      </div>

      {loading ? (
        <div className="space-y-3" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[68px] w-full rounded-xl" />
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl bg-muted/50 px-4 py-8 text-center">
          <span className="flex size-10 items-center justify-center rounded-xl bg-card text-muted-foreground shadow-soft">
            <ClipboardCheck className="size-5" aria-hidden />
          </span>
          <p className="text-[15px] font-semibold text-foreground">No quizzes waiting</p>
          <p className="text-sm text-muted-foreground">
            Quizzes from your courses will appear here.
          </p>
        </div>
      ) : (
        <ul className="-mx-2 divide-y divide-border/70">
          {quizzes.slice(0, 5).map((quiz) => (
            <li key={quiz.id} className="flex items-center gap-3 px-2 py-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                <ClipboardCheck className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-foreground">{quiz.title}</p>
                <p className="truncate text-[13px] text-muted-foreground">{quiz.course}</p>
                <p className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                  {quiz.passingScore != null && (
                    <span className="inline-flex items-center gap-1">
                      <Target className="size-3" aria-hidden /> Pass {quiz.passingScore}%
                    </span>
                  )}
                  {quiz.timeLimit != null && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" aria-hidden /> {quiz.timeLimit} min
                    </span>
                  )}
                </p>
              </div>
              <Button asChild size="sm" variant="soft" className="shrink-0">
                <Link href={`/dashboard/topics/${quiz.topicId}/quiz`}>Start</Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
