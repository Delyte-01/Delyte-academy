"use client";

import { Check, PartyPopper, Target, X } from "lucide-react";

import { CountUp } from "@/components/motion/count-up";
import { ProgressRing } from "@/components/motion/progress-ring";
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

/** Score moment: ring draws in, number counts up. Tone follows the outcome. */
export function QuizResultsHero({ result }: { result: QuizResultData }) {
  const { passed } = result;

  return (
    <section
      aria-labelledby="result-heading"
      className={cn(
        "relative overflow-hidden rounded-2xl border p-6 shadow-card sm:p-9",
        passed ? "bg-brand-wash bg-card" : "border-warning/30 bg-warning-soft/50",
      )}
    >
      <div className="flex flex-col items-center gap-8 text-center md:flex-row md:gap-12 md:text-left">
        <ProgressRing
          value={result.score}
          size={176}
          stroke={12}
          tone={passed ? "brand" : "warning"}
          label="Quiz score"
          className="shrink-0"
        >
          <span className="flex flex-col items-center">
            <span className="font-heading text-5xl font-extrabold tabular-nums tracking-tight">
              <CountUp value={result.score} suffix="%" />
            </span>
            <span className="text-xs font-semibold text-muted-foreground">Your score</span>
          </span>
        </ProgressRing>

        <div className="w-full flex-1 space-y-6">
          <div className="space-y-2">
            <p
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider",
                passed ? "bg-success-soft text-success" : "bg-warning-soft text-warning",
              )}
            >
              {passed ? <PartyPopper className="size-3.5" aria-hidden /> : <Target className="size-3.5" aria-hidden />}
              {passed ? "Passed" : "Not passed yet"}
            </p>
            <h1
              id="result-heading"
              className="font-heading text-[30px] font-extrabold leading-tight tracking-tight sm:text-4xl"
            >
              {passed ? "Great work, you passed." : "Not quite there yet."}
            </h1>
            <p className="max-w-md text-[16px] text-muted-foreground">
              {passed
                ? `You cleared the ${result.passingScore}% pass mark.`
                : `You need ${result.passingScore}% to pass. Check the answers below, then try again.`}
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-background/80 p-3.5 ring-1 ring-border">
              <dt className="flex items-center justify-center gap-1 text-xs font-semibold text-muted-foreground md:justify-start">
                <Check className="size-3.5 text-success" aria-hidden /> Correct
              </dt>
              <dd className="mt-1 font-heading text-2xl font-extrabold tabular-nums">
                <CountUp value={result.correctAnswers} />
              </dd>
            </div>
            <div className="rounded-xl bg-background/80 p-3.5 ring-1 ring-border">
              <dt className="flex items-center justify-center gap-1 text-xs font-semibold text-muted-foreground md:justify-start">
                <X className="size-3.5 text-destructive" aria-hidden /> Incorrect
              </dt>
              <dd className="mt-1 font-heading text-2xl font-extrabold tabular-nums">
                <CountUp value={result.incorrectAnswers} />
              </dd>
            </div>
            <div className="rounded-xl bg-background/80 p-3.5 ring-1 ring-border">
              <dt className="text-xs font-semibold text-muted-foreground">Points</dt>
              <dd className="mt-1 font-heading text-2xl font-extrabold tabular-nums">
                <CountUp value={result.earnedPoints} />
                <span className="text-sm font-semibold text-muted-foreground">/{result.totalPoints}</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
