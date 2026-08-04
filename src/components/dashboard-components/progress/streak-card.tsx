"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Flame, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { StreakData } from "@/types/progress";


interface StreakCardProps {
  data: StreakData;
}

export function StreakCard({ data }: StreakCardProps) {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 text-white shadow-lg">
      <CardContent className="relative p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Current streak */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-500/20 backdrop-blur-sm">
              <Flame className="h-8 w-8 text-orange-400" />
            </div>
            <div>
              <p className="text-3xl font-extrabold tracking-tight">
                {data.current} days
              </p>
              <p className="text-sm text-orange-200">Current Learning Streak</p>
            </div>
          </div>

          {/* Longest streak */}
          <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 backdrop-blur-sm">
            <Award className="h-5 w-5 text-amber-300" />
            <div>
              <p className="text-xs text-orange-200">Longest Streak</p>
              <p className="text-lg font-bold">{data.longest} days</p>
            </div>
          </div>
        </div>

        {/* Week activity */}
        <div className="mt-5">
          <p className="mb-3 text-xs font-medium text-orange-200">
            This Week&apos;s Activity
          </p>
          <div className="flex justify-between gap-2">
            {data.weekActivity.map((day) => (
              <div
                key={day.day}
                className="flex flex-1 flex-col items-center gap-1.5"
              >
                <div
                  className={cn(
                    "flex h-10 w-full items-center justify-center rounded-xl text-xs font-bold transition-all",
                    day.active
                      ? "bg-gradient-to-b from-orange-400 to-orange-600 text-white"
                      : "bg-white/5 text-white/30",
                  )}
                >
                  {day.sessions > 0 ? day.sessions : "·"}
                </div>
                <span className="text-[10px] text-orange-200">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational message */}
        <div className="mt-5 flex items-center gap-2 rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
          <Flame className="h-4 w-4 flex-shrink-0 text-orange-400" />
          <p className="text-xs text-orange-100">{data.message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
