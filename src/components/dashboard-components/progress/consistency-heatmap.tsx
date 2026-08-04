"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Deterministic pseudo-random intensity for 30 days (5 weeks x 7 days)
// 0 = no activity, 1-4 = increasing intensity
const heatmapData: number[][] = [
  [2, 3, 1, 0, 4, 2, 3],
  [1, 2, 4, 3, 0, 2, 1],
  [3, 0, 2, 4, 3, 1, 2],
  [2, 4, 3, 1, 2, 0, 3],
  [3, 2, 1, 4, 2, 3, 0],
];

const intensityColors = [
  "bg-muted",
  "bg-emerald-500/30",
  "bg-emerald-500/50",
  "bg-emerald-500/75",
  "bg-emerald-500",
];

const dayLabels = ["Mon", "Wed", "Fri"];

export function ConsistencyHeatmap() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold">
          Learning Consistency
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {/* Day labels */}
            <div className="flex flex-col justify-between py-1 text-[10px] text-muted-foreground">
              {dayLabels.map((day) => (
                <span key={day} className="h-3 leading-3">
                  {day}
                </span>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex gap-1.5">
              {heatmapData.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1.5">
                  {week.map((intensity, dayIdx) => (
                    <div
                      key={dayIdx}
                      className={cn(
                        "h-3.5 w-3.5 rounded-[3px] transition-all hover:ring-1 hover:ring-emerald-500/50",
                        intensityColors[intensity],
                      )}
                      title={`${intensity > 0 ? `${intensity * 2} sessions` : "No activity"}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 text-[10px] text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              {intensityColors.map((color, i) => (
                <div key={i} className={cn("h-3 w-3 rounded-[3px]", color)} />
              ))}
            </div>
            <span>More</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-xs">
            <span className="text-muted-foreground">
              Active days this month
            </span>
            <span className="font-bold text-foreground">26 / 30</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
