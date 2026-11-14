"use client";

import { Sparkles } from "lucide-react";

import { CountUp } from "@/components/motion/count-up";
import { ProgressRing } from "@/components/motion/progress-ring";
import { WeeklyGoalData } from "@/types/progress";
import { Panel } from "./panel";

export function WeeklyGoalCard({ goal }: { goal: WeeklyGoalData }) {
  const percent = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
  const done = goal.current >= goal.target;

  return (
    <Panel title="Weekly goal" description="Topics completed in the last 7 days" className="h-full">
      <div className="flex items-center gap-5">
        <ProgressRing value={percent} size={104} stroke={9} tone={done ? "success" : "brand"} label="Weekly goal">
          <span className="font-heading text-xl font-extrabold tabular-nums">
            <CountUp value={percent} suffix="%" />
          </span>
        </ProgressRing>
        <div>
          <p className="font-heading text-3xl font-extrabold leading-none tabular-nums tracking-tight">
            {goal.current}
            <span className="text-lg font-bold text-muted-foreground"> / {goal.target}</span>
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">{done ? "Goal achieved" : "topics this week"}</p>
        </div>
      </div>

      <p className="mt-5 flex items-start gap-2.5 rounded-lg bg-primary-soft p-3 text-sm text-primary-soft-foreground">
        <Sparkles className="mt-0.5 size-4 shrink-0" aria-hidden />
        {goal.message}
      </p>
    </Panel>
  );
}
