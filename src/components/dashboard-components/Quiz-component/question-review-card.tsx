"use client";

import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { MathRenderer } from "@/components/common/math-renderer";

interface QuizQuestion {
  number: number;
  text: string;
  correctAnswer: string;
  explanation: string | null;
}

interface QuestionReviewCardProps {
  question: QuizQuestion;
  userAnswer: string;
  isCorrect: boolean;
}

export function QuestionReviewCard({
  question,
  userAnswer,
  isCorrect,
}: QuestionReviewCardProps) {
  return (
    <Card
      className={`border-l-4 transition-shadow duration-200 hover:shadow-md ${
        isCorrect
          ? "border-l-emerald-500 border-y-border/70 border-r-border/70"
          : "border-l-rose-500 border-y-border/70 border-r-border/70"
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <CardTitle className="text-sm font-bold leading-snug text-foreground">
            <span className="mr-2 text-muted-foreground">
              Q{question.number}.
            </span>
            <MathRenderer text={question.text} />
          </CardTitle>
          <Badge
            variant="outline"
            className={`flex-shrink-0 gap-1 ${
              isCorrect
                ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                : "border-rose-500/30 bg-rose-500/15 text-rose-700 dark:text-rose-400"
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <XCircle className="h-3.5 w-3.5" />
            )}
            {isCorrect ? "Correct" : "Incorrect"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* User's answer */}
        <div
          className={`flex flex-col gap-1 rounded-xl border p-3 sm:flex-row sm:items-center sm:gap-2 ${
            isCorrect
              ? "border-emerald-500/20 bg-emerald-500/5"
              : "border-rose-500/20 bg-rose-500/5"
          }`}
        >
          <span className="flex-shrink-0 text-xs font-bold text-muted-foreground">
            Your Answer :
          </span>
          <span
            className={`text-sm ${
              isCorrect
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-rose-700 dark:text-rose-400"
            }`}
          >
            <MathRenderer text={userAnswer} />
          </span>
        </div>

        {/* Correct answer */}
        {!isCorrect && (
          <div className="flex flex-col gap-1 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 sm:flex-row sm:items-center sm:gap-2">
            <span className="flex-shrink-0 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              Correct Answer :
            </span>
            <span className="text-sm text-emerald-700 dark:text-emerald-400">
              <MathRenderer text={question.correctAnswer} />
            </span>
          </div>
        )}

        {/* Explanation */}
        <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
          <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-500" />
          <div>
            <p className="text-xs mb-3 font-bold text-amber-700 dark:text-amber-500">
              Explanation :
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              <MathRenderer text={question.explanation ?? ""} />
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
