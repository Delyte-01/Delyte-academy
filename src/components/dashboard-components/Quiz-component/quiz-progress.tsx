"use client";

import { ProgressBar } from "@/components/ui/progress-bar";

interface QuizProgressProps {
  total: number;
  answered: number;
}

/** Flush, thin bar for the sticky quiz bar. Fill = share of questions answered. */
export function QuizProgress({ total, answered }: QuizProgressProps) {
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  return (
    <ProgressBar
      value={pct}
      size="sm"
      label={`${answered} of ${total} questions answered`}
      className="rounded-none"
    />
  );
}
