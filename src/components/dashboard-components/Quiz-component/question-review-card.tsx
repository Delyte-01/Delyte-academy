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
        "rounded-xl border bg-card shadow-soft",
        item.isCorrect ? "border-border" : "border-destructive/30",
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-3 rounded-xl p-4 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 sm:p-5"
      >
        <span
          className={cn(
            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-primary-foreground",
            item.isCorrect ? "bg-success" : "bg-destructive",
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
          className="space-y-3 border-t border-border p-4 sm:p-5"
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
                      ? "border-success/30 bg-success-soft"
                      : wrongPick
                        ? "border-destructive/30 bg-destructive/10"
                        : "border-border text-muted-foreground",
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
                          ? "text-success "
                          : "text-destructive ",
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
            <div className="flex items-start gap-2.5 rounded-xl bg-warning-soft p-3.5">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-warning" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-warning">
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
