"use client";

import { useRef, useState } from "react";
import { Check, Clock, RotateCcw, X } from "lucide-react";
import { EASE, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * A small, honest product preview: one sample question laid out like the real
 * CBT quiz player (question navigator, options, instant feedback). It carries
 * no data or statistics; the visitor can pick an answer, then try again.
 */
const QUESTION = {
  text: "Solve for x: 2x + 6 = 14",
  options: ["3", "4", "5", "8"],
  correct: 1,
};

const LETTERS = ["A", "B", "C", "D"];
const TOTAL = 8;
const CURRENT = 3; // 1-based position shown in the navigator

export function QuizPreview() {
  const [picked, setPicked] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-nav-cell]", {
        scale: 0.5,
        opacity: 0,
        duration: 0.5,
        delay: 0.9,
        stagger: 0.05,
        ease: EASE.out,
        clearProps: "transform,opacity",
      });
    },
    { scope: rootRef },
  );

  const choose = contextSafe((index: number, badge: HTMLElement | null) => {
    if (picked !== null) return;
    setPicked(index);
    if (badge && !prefersReducedMotion()) {
      gsap.fromTo(
        badge,
        { scale: 0.7 },
        { scale: 1, duration: 0.6, ease: EASE.spring, clearProps: "transform" },
      );
    }
  });

  const answered = picked !== null;
  const isCorrect = picked === QUESTION.correct;

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label="Sample quiz question"
      className="w-full overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_40px_80px_-32px_oklch(0.25_0.08_281/0.45),0_8px_24px_-12px_oklch(0.25_0.08_281/0.2)]"
    >
      {/* quiz bar */}
      <div className="flex items-center justify-between gap-3 border-b bg-muted/60 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="size-2 rounded-full bg-success" />
          <span className="text-sm font-bold text-foreground">Sample quiz</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-xs font-bold tabular-nums text-muted-foreground">
          <Clock className="size-3.5" aria-hidden />
          Timed
        </span>
      </div>

      <div className="p-5 sm:p-6">
        {/* question navigator, illustrative only */}
        <div className="flex items-center gap-1.5" aria-hidden>
          {Array.from({ length: TOTAL }, (_, i) => i + 1).map((n) => {
            const isCurrent = n === CURRENT;
            const done = n < CURRENT || (isCurrent && answered);
            return (
              <span
                key={n}
                data-nav-cell
                className={cn(
                  "flex h-8 flex-1 items-center justify-center rounded-md text-xs font-bold tabular-nums transition-colors duration-200",
                  isCurrent
                    ? "bg-primary text-primary-foreground shadow-brand"
                    : done
                      ? "bg-primary-soft text-primary-soft-foreground"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {n}
              </span>
            );
          })}
        </div>

        <p className="mt-6 text-sm font-semibold text-muted-foreground">
          Question {CURRENT} of {TOTAL}
        </p>
        <p className="mt-1.5 font-headline text-2xl font-bold tracking-[-0.02em] text-foreground">
          {QUESTION.text}
        </p>

        <div className="mt-5 space-y-2.5">
          {QUESTION.options.map((option, i) => {
            const isPicked = picked === i;
            const showCorrect = answered && i === QUESTION.correct;
            const showWrong = isPicked && i !== QUESTION.correct;
            return (
              <button
                key={option}
                type="button"
                disabled={answered}
                onClick={(e) =>
                  choose(i, e.currentTarget.querySelector<HTMLElement>("[data-badge]"))
                }
                className={cn(
                  "flex min-h-12 w-full items-center gap-3 rounded-xl border bg-background px-3.5 py-2.5 text-left text-[15px] font-semibold text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/40 motion-reduce:transition-none",
                  !answered &&
                    "hover:border-primary/50 hover:bg-primary-soft/60 hover:shadow-soft",
                  showCorrect && "border-success bg-success-soft",
                  showWrong && "border-destructive bg-destructive/10",
                  answered && !showCorrect && !showWrong && "opacity-55",
                )}
              >
                <span
                  data-badge
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                    showCorrect
                      ? "bg-success text-background"
                      : showWrong
                        ? "bg-destructive text-background"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {showCorrect ? (
                    <Check className="size-4" aria-hidden />
                  ) : showWrong ? (
                    <X className="size-4" aria-hidden />
                  ) : (
                    LETTERS[i]
                  )}
                </span>
                <span className="tabular-nums">{option}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex min-h-9 items-center justify-between gap-3">
          <p
            aria-live="polite"
            className={cn(
              "text-sm font-semibold",
              !answered
                ? "text-muted-foreground"
                : isCorrect
                  ? "text-success"
                  : "text-destructive",
            )}
          >
            {!answered
              ? "Pick an answer to see how feedback works."
              : isCorrect
                ? "Correct. Real quizzes score automatically."
                : "Not quite. 2x = 8, so x = 4."}
          </p>
          {answered && (
            <button
              type="button"
              onClick={() => setPicked(null)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-bold text-primary outline-none transition-colors hover:bg-primary-soft focus-visible:ring-[3px] focus-visible:ring-ring/40"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
