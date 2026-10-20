"use client";

import { useState } from "react";
import { Check, ChevronDown, Lightbulb, X } from "lucide-react";
import { MathRenderer } from "@/components/common/math-renderer";
import { cn } from "@/lib/utils";

export interface ReviewItem {
  id: string;
  number: number;
  text: string;
  explanation: string | null;
  isCorrect: boolean;
  selectedOptionId: string | null;
  options: { id: string; text: string; isCorrect: boolean }[];
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QuestionReviewCard({ item }: { item: ReviewItem }) {
  // Mistakes open by default, correct answers stay collapsed.
  const [open, setOpen] = useState(!item.isCorrect);
  const unanswered = item.selectedOptionId === null;
  const panelId = `review-${item.id}`;

  return (
    <article
      className={cn(
        "rounded-2xl border bg-card",
        item.isCorrect ? "border-border/60" : "border-rose-500/25",
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-3 rounded-2xl p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 sm:p-5"
      >
        <span
          className={cn(
            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-white",
            item.isCorrect ? "bg-emerald-500" : "bg-rose-500",
          )}
        >
          {item.isCorrect ? (
            <Check className="size-3.5" strokeWidth={3} />
          ) : (
            <X className="size-3.5" strokeWidth={3} />
          )}
          <span className="sr-only">
            {item.isCorrect ? "Correct" : "Incorrect"}
          </span>
        </span>
        <span className="min-w-0 flex-1 space-y-0.5">
          <span className="block text-xs text-muted-foreground">
            Question {item.number}
            {unanswered && ", not answered"}
          </span>
          <span className="block text-[15px] font-semibold leading-snug">
            <MathRenderer text={item.text} />
          </span>
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            "mt-1 size-5 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          id={panelId}
          className="space-y-3 border-t border-border/60 p-4 sm:p-5"
        >
          <ul className="space-y-2">
            {item.options.map((opt, i) => {
              const picked = opt.id === item.selectedOptionId;
              const wrongPick = picked && !opt.isCorrect;
              return (
                <li
                  key={opt.id}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3 text-sm",
                    opt.isCorrect
                      ? "border-emerald-500/40 bg-emerald-500/10"
                      : wrongPick
                        ? "border-rose-500/40 bg-rose-500/10"
                        : "border-border/60 text-muted-foreground",
                  )}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background text-xs font-semibold ring-1 ring-border/60">
                    {LETTERS[i]}
                  </span>
                  <span className="min-w-0 flex-1 break-words leading-relaxed">
                    <MathRenderer text={opt.text} />
                  </span>
                  {(picked || opt.isCorrect) && (
                    <span
                      className={cn(
                        "shrink-0 text-xs font-medium",
                        opt.isCorrect
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-rose-700 dark:text-rose-400",
                      )}
                    >
                      {picked && opt.isCorrect
                        ? "Your answer"
                        : picked
                          ? "Your answer"
                          : "Correct answer"}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          {unanswered && (
            <p className="text-sm text-muted-foreground">
              You didn&apos;t answer this question.
            </p>
          )}

          {item.explanation && item.explanation.trim() && (
            <div className="flex items-start gap-2.5 rounded-xl bg-amber-500/10 p-3.5">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-500" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-500">
                  Why
                </p>
                <p className="text-sm leading-relaxed text-foreground/80">
                  <MathRenderer text={item.explanation} />
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
