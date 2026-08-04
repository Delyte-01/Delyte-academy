"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// import type { QuizQuestion } from "./types";
import { MathRenderer } from "@/components/common/math-renderer";
import { QuizPlayerQuestion } from "@/types/quiz";


interface QuestionCardProps {
  question: QuizPlayerQuestion;
}

const difficultyStyles: Record<string, string> = {
  Easy: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Medium:
    "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Hard: "border-rose-500/30 bg-rose-500/15 text-rose-700 dark:text-rose-400",
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function QuestionCard({ question }: QuestionCardProps) {
  const badgeRef = useRef<HTMLDivElement>(null);

  // A tiny pop on the difficulty badge whenever a new question loads in.
  useEffect(() => {
    if (!badgeRef.current || prefersReducedMotion()) return;

    gsap.fromTo(
      badgeRef.current,
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2.5)" },
    );
  }, [question.number]);

  return (
    <Card className="border-border/70">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <CardTitle className="text-base font-bold leading-snug text-foreground sm:text-lg">
            <MathRenderer text={question.text} />
          </CardTitle>
          <div ref={badgeRef} className="sm:flex-shrink-0">
            <Badge
              variant="outline"
              className={difficultyStyles[question.difficulty]}
            >
              {question.difficulty}
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span>Question {question.number}</span>
          <span>·</span>
          <span>{question.points} points</span>
          <span>·</span>
          <span>{question.type}</span>
        </div>
      </CardHeader>
    </Card>
  );
}
