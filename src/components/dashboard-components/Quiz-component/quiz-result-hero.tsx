"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizResultData {
  score: number;
  passed: boolean;
  passingScore: number;
  correctAnswers: number;
  incorrectAnswers: number;
  earnedPoints: number;
  totalPoints: number;
}

const R = 70;
const C = 2 * Math.PI * R;

export function QuizResultsHero({ result }: { result: QuizResultData }) {
  // Start empty, then fill, so the ring draws itself once on arrival.
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(result.score)); // eslint-disable-line react-hooks/set-state-in-effect
    return () => cancelAnimationFrame(id);
  }, [result.score]);

  const { passed } = result;

  return (
    <section
      className={cn(
        "rounded-3xl border p-6 sm:p-8",
        passed
          ? "border-emerald-500/25 bg-emerald-500/5"
          : "border-amber-500/25 bg-amber-500/5",
      )}
    >
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:gap-10 sm:text-left">
        <div className="relative size-36 shrink-0 sm:size-40">
          <svg
            viewBox="0 0 160 160"
            className="size-full -rotate-90"
            aria-hidden
          >
            <circle
              cx="80"
              cy="80"
              r={R}
              fill="none"
              strokeWidth="10"
              className="stroke-foreground/10"
            />
            <circle
              cx="80"
              cy="80"
              r={R}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C - (shown / 100) * C}
              className={cn(
                "transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none",
                passed ? "stroke-emerald-500" : "stroke-amber-500",
              )}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-semibold tabular-nums tracking-tight">
              {result.score}%
            </span>
            <span className="text-xs text-muted-foreground">Your score</span>
          </div>
        </div>

        <div className="w-full flex-1 space-y-5">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {passed ? "You passed" : "Not quite there yet"}
            </h1>
            <p className="text-muted-foreground">
              {passed
                ? `You scored above the ${result.passingScore}% pass mark.`
                : `You need ${result.passingScore}% to pass. Check the answers below, then try again.`}
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-background/70 p-3 ring-1 ring-border/60">
              <dt className="flex items-center justify-center gap-1 text-xs text-muted-foreground sm:justify-start">
                <Check className="size-3.5 text-emerald-600" /> Correct
              </dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">
                {result.correctAnswers}
              </dd>
            </div>
            <div className="rounded-2xl bg-background/70 p-3 ring-1 ring-border/60">
              <dt className="flex items-center justify-center gap-1 text-xs text-muted-foreground sm:justify-start">
                <X className="size-3.5 text-rose-600" /> Incorrect
              </dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">
                {result.incorrectAnswers}
              </dd>
            </div>
            <div className="rounded-2xl bg-background/70 p-3 ring-1 ring-border/60">
              <dt className="text-xs text-muted-foreground">Points</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">
                {result.earnedPoints}
                <span className="text-sm font-normal text-muted-foreground">
                  /{result.totalPoints}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
