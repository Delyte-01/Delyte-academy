"use client";

import { Clock, Hash, Target } from "lucide-react";

interface ResultsSummaryCardProps {
  timeSpent: string;
  attemptNumber: number;
  passingScore: number;
}

export function ResultsSummaryCard({
  timeSpent,
  attemptNumber,
  passingScore,
}: ResultsSummaryCardProps) {
  const stats = [
    { label: "Time spent", value: timeSpent, icon: Clock },
    { label: "Attempt", value: `#${attemptNumber}`, icon: Hash },
    { label: "Pass mark", value: `${passingScore}%`, icon: Target },
  ];

  return (
    <dl className="grid grid-cols-3 divide-x divide-border/60 rounded-2xl border border-border/60 bg-card">
      {stats.map(({ label, value, icon: Icon }) => (
        <div key={label} className="space-y-1 p-3.5 text-center sm:p-4">
          <dt className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Icon className="size-3.5" />
            {label}
          </dt>
          <dd className="text-lg font-semibold tabular-nums sm:text-xl">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
