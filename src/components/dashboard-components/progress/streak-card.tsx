"use client";

import { Award, Flame } from "lucide-react";

import { CountUp } from "@/components/motion/count-up";
import { cn } from "@/lib/utils";
import { StreakData } from "@/types/progress";

export function StreakCard({ data }: { data: StreakData }) {
  return (
    <section className="rounded-xl border bg-card p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-warning-soft">
            <Flame className="size-8 text-warning" aria-hidden />
          </span>
          <div>
            <p className="font-heading text-4xl font-extrabold leading-none tabular-nums tracking-tight">
              <CountUp value={data.current} />
              <span className="ml-1.5 text-lg font-bold text-muted-foreground">
                {data.current === 1 ? "day" : "days"}
              </span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Current learning streak</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-muted/60 px-4 py-2.5">
          <Award className="size-5 text-warning" aria-hidden />
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Longest streak</p>
            <p className="font-heading text-lg font-extrabold tabular-nums">
              {data.longest} {data.longest === 1 ? "day" : "days"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">This week</p>
        <ul className="grid grid-cols-7 gap-2">
          {data.weekActivity.map((day) => (
            <li key={day.day} className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex h-11 w-full items-center justify-center rounded-lg text-sm font-bold tabular-nums",
                  day.active ? "bg-warning text-background" : "bg-muted text-muted-foreground/60",
                )}
              >
                {day.sessions > 0 ? day.sessions : "·"}
                <span className="sr-only">
                  {day.day}: {day.sessions} {day.sessions === 1 ? "topic" : "topics"} completed
                </span>
              </span>
              <span aria-hidden className="text-[11px] font-semibold text-muted-foreground">
                {day.day}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-5 flex items-center gap-2.5 rounded-lg bg-muted/60 p-3 text-sm">
        <Flame className="size-4 shrink-0 text-warning" aria-hidden />
        {data.message}
      </p>
    </section>
  );
}
