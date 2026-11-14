"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Panel } from "./panel";

interface ConsistencyHeatmapProps {
  /** ISO timestamps of completed topics (real rows only). */
  completedAt: string[];
}

const WEEKS = 5;
const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const LEVELS = ["bg-muted", "bg-primary/25", "bg-primary/50", "bg-primary/75", "bg-primary"];

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Last five Monday-first weeks. Each square is a day; darker = more topics completed. */
export function ConsistencyHeatmap({ completedAt }: ConsistencyHeatmapProps) {
  const { cells, activeDays } = useMemo(() => {
    const counts = new Map<string, number>();
    for (const iso of completedAt) {
      const k = dayKey(new Date(iso));
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    const start = new Date(thisMonday);
    start.setDate(thisMonday.getDate() - (WEEKS - 1) * 7);

    let active = 0;
    const out = Array.from({ length: WEEKS * 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const future = d > today;
      const n = future ? 0 : (counts.get(dayKey(d)) ?? 0);
      if (n > 0) active++;
      return {
        key: dayKey(d),
        n,
        future,
        isToday: d.getTime() === today.getTime(),
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      };
    });
    return { cells: out, activeDays: active };
  }, [completedAt]);

  return (
    <Panel title="Consistency" description="Topics completed over the last five weeks">
      <div role="img" aria-label={`${activeDays} active days in the last ${WEEKS} weeks`} className="space-y-4">
        <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold text-muted-foreground">
          {DAY_LABELS.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((c) => (
            <div
              key={c.key}
              title={c.future ? undefined : `${c.label}: ${c.n} ${c.n === 1 ? "topic" : "topics"}`}
              className={cn(
                "aspect-square rounded-md",
                c.future ? "bg-transparent ring-1 ring-inset ring-border/60" : LEVELS[Math.min(c.n, 4)],
                c.isToday && "ring-2 ring-ring",
              )}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          <span className="font-bold text-foreground tabular-nums">{activeDays}</span> active{" "}
          {activeDays === 1 ? "day" : "days"}
        </span>
        <span className="flex items-center gap-1.5">
          Less
          {LEVELS.map((l) => (
            <span key={l} className={cn("size-3 rounded-[4px]", l)} />
          ))}
          More
        </span>
      </div>
    </Panel>
  );
}
