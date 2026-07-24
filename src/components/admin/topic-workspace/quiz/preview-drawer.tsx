"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  difficultyStyles,
  questionTypeStyles,
  Quiz,
  QuizQuestion,
} from "@/types/quiz";

interface PreviewDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: QuizQuestion[];
  quiz: Quiz | null;
}

export function PreviewDrawer({
  open,
  onOpenChange,
  questions,
  quiz,
}: PreviewDrawerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = questions[currentIdx];
  const total = questions.length;

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentIdx(0);
      setAnswers({});
    }
  }, [open]);

  const goPrev = () => setCurrentIdx((prev) => Math.max(0, prev - 1));
  const goNext = () => setCurrentIdx((prev) => Math.min(total - 1, prev + 1));

  const selectAnswer = (questionId: string, optionText: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionText }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-lg"
      >
        {/* Header */}
        <SheetHeader className="space-y-1 border-b px-6 pb-4 pt-6">
          <SheetTitle className="text-base font-bold">
            Student Preview
          </SheetTitle>
          <SheetDescription className="text-sm">
            This is how students will see this quiz.
          </SheetDescription>
        </SheetHeader>

        {total === 0 ? (
          <div className="flex flex-1 items-center justify-center p-8 text-center">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">
                No questions to preview
              </p>
              <p className="text-xs text-muted-foreground">
                Add questions first to see the preview.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Quiz info */}
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-bold text-foreground">
                {quiz?.title ?? "Untitled Quiz"}
              </h2>
              {quiz?.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {quiz?.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {total} questions
                </Badge>
                {(quiz?.time_limit ?? 0) > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {quiz?.time_limit} min
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  Pass: {quiz?.passing_score}%
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Max attempts: {quiz?.attempt_limit}
                </Badge>
              </div>
              {quiz?.instructions && (
                <div className="mt-3 rounded-xl border bg-muted/30 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Instructions
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">
                    {quiz?.instructions}
                  </p>
                </div>
              )}
            </div>

            {/* Question */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Question {currentIdx + 1} of {total}
                </span>
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      questionTypeStyles[currentQuestion.type]
                    )}
                  >
                    {currentQuestion.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      difficultyStyles[currentQuestion.difficulty]
                    )}
                  >
                    {currentQuestion.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {currentQuestion.points} pts
                  </Badge>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
                />
              </div>

              <p className="mb-4 text-base font-semibold leading-relaxed text-foreground">
                {currentQuestion.question}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {currentQuestion.options?.map((option) => {
                  const isSelected =
                    answers[currentQuestion.id] === option.option_text;
                  return (
                    <button
                      key={option.id}
                      onClick={() =>
                        selectAnswer(currentQuestion.id, option.option_text)
                      }
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-150",
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all",
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {isSelected && (
                          <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-sm",
                          isSelected
                            ? "font-medium text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {option.option_text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-2 border-t px-6 py-4">
              <Button
                variant="outline"
                onClick={goPrev}
                disabled={currentIdx === 0}
                className="rounded-xl"
              >
                <ChevronLeft className="mr-1.5 h-4 w-4" />
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                {currentIdx + 1} / {total}
              </span>
              {currentIdx === total - 1 ? (
                <Button disabled className="cursor-not-allowed">
                  <Send className="mr-2 h-4 w-4" />
                  Preview Only
                </Button>
              ) : (
                <Button onClick={goNext} className="rounded-xl">
                  Next
                  <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
