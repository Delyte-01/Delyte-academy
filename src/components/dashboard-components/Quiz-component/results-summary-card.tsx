"use client";

import { Target, Clock, Signal, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultsSummaryCardProps {
  accuracy: number;
  timeSpent: string;
  difficulty: string;
  attemptNumber: number;
}

export function ResultsSummaryCard({
  accuracy,
  timeSpent,
  difficulty,
  attemptNumber,
}: ResultsSummaryCardProps) {
  const stats = [
    {
      label: "Accuracy",
      value: `${accuracy}%`,
      icon: Target,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
      ringColor: "ring-emerald-500/15",
    },
    {
      label: "Time Spent",
      value: timeSpent,
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
      ringColor: "ring-blue-500/15",
    },
    {
      label: "Difficulty",
      value: difficulty,
      icon: Signal,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
      ringColor: "ring-amber-500/15",
    },
    {
      label: "Attempt",
      value: `#${attemptNumber}`,
      icon: Hash,
      color: "text-violet-600 dark:text-violet-400",
      bgColor: "bg-violet-500/10",
      ringColor: "ring-violet-500/15",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold">
          Performance Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group rounded-2xl border border-border/70 p-3.5 transition-all duration-200 hover:border-foreground/15 hover:bg-muted/30 hover:shadow-sm sm:p-4"
              >
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset transition-transform duration-200 group-hover:scale-105 ${stat.bgColor} ${stat.ringColor}`}
                >
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
