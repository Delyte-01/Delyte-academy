"use client";

interface QuizProgressProps {
  current: number;
  total: number;
  answered: number;
}

/** Position on the left, answered share as the bar. */
export function QuizProgress({ current, total, answered }: QuizProgressProps) {
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">
          Question {current} of {total}
        </span>
        <span className="tabular-nums text-muted-foreground">
          {answered} answered
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Questions answered"
        aria-valuenow={answered}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className="h-full rounded-full bg-emerald-500 transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
