"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeeklyGoalData } from "@/types/progress";
import { Target, Calendar, Sparkles } from "lucide-react";


interface WeeklyGoalCardProps {
  goal: WeeklyGoalData;
}

export function WeeklyGoalCard({ goal }: WeeklyGoalCardProps) {
  const percent = Math.round((goal.current / goal.target) * 100);
  const isClose = percent >= 60;

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <Target className="h-5 w-5 text-primary" />
          Weekly Goal Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Goal header */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-extrabold tracking-tight text-foreground">
              {goal.current} / {goal.target}
            </p>
            <p className="text-xs text-muted-foreground">
              Topics completed this week
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-primary">{percent}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Estimated completion */}
        <div className="flex items-center gap-2 rounded-xl bg-muted/40 p-3 text-xs">
          <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <span className="text-muted-foreground">Estimated completion:</span>
          <span className="font-semibold text-foreground">
            {goal.estimatedCompletion}
          </span>
        </div>

        {/* Encouraging message */}
        {isClose && (
          <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
            <Sparkles className="h-4 w-4 flex-shrink-0 text-primary" />
            <p className="text-xs text-foreground">{goal.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
