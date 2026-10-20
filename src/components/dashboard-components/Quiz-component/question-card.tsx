"use client";

import { Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MathRenderer } from "@/components/common/math-renderer";
import { QuizPlayerQuestion } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: QuizPlayerQuestion;
  marked: boolean;
  onToggleMark: () => void;
}

const difficultyStyles: Record<string, string> = {
  Easy: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Medium:
    "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Hard: "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-400",
};

export function QuestionCard({
  question,
  marked,
  onToggleMark,
}: QuestionCardProps) {
  return (
    <section aria-labelledby="current-question" className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
          <Badge
            variant="outline"
            className={difficultyStyles[question.difficulty]}
          >
            {question.difficulty}
          </Badge>
          <span>
            {question.points} {question.points === 1 ? "point" : "points"}
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-pressed={marked}
          onClick={onToggleMark}
          className={cn(
            "-mr-2 shrink-0",
            marked && "text-amber-700 dark:text-amber-400",
          )}
        >
          <Bookmark
            className={cn(
              "mr-1.5 size-4",
              marked && "fill-amber-400 text-amber-500",
            )}
          />
          {marked ? "Marked for review" : "Mark for review"}
        </Button>
      </div>

      <h2
        id="current-question"
        className="text-xl font-semibold leading-snug tracking-tight sm:text-2xl"
      >
        <MathRenderer text={question.text} />
      </h2>
    </section>
  );
}
