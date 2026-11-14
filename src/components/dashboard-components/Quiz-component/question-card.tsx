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

const DIFFICULTY_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  easy: "success",
  medium: "warning",
  hard: "danger",
};

export function QuestionCard({ question, marked, onToggleMark }: QuestionCardProps) {
  const variant = DIFFICULTY_VARIANT[String(question.difficulty).toLowerCase()] ?? "muted";

  return (
    <section aria-labelledby="current-question" className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Question {question.number}
          </span>
          <Badge variant={variant} size="sm" className="capitalize">
            {question.difficulty}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {question.points} {question.points === 1 ? "point" : "points"}
          </span>
        </div>

        <Button
          type="button"
          variant={marked ? "soft" : "ghost"}
          size="sm"
          aria-pressed={marked}
          onClick={onToggleMark}
          className={cn("-mr-2 shrink-0", marked && "bg-warning-soft text-warning hover:bg-warning-soft/70")}
        >
          <Bookmark className={cn(marked && "fill-current")} />
          <span className="hidden sm:inline">{marked ? "Marked for review" : "Mark for review"}</span>
          <span className="sm:hidden">{marked ? "Marked" : "Mark"}</span>
        </Button>
      </div>

      <h2
        id="current-question"
        className="font-heading text-[22px] font-bold leading-snug tracking-tight sm:text-[28px]"
      >
        <MathRenderer text={question.text} />
      </h2>
    </section>
  );
}
