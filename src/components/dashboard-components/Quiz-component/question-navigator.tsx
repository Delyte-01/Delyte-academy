"use client";

import { Bookmark, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type QuestionState = "current" | "answered" | "marked" | "unanswered";

interface QuestionNavigatorProps {
  total: number;
  states: QuestionState[];
  current: number;
  onSelect: (index: number) => void;
  showLegend?: boolean;

}

const LEGEND_ITEMS: { state: QuestionState; label: string }[] = [
  { state: "current", label: "Current" },
  { state: "answered", label: "Answered" },
  { state: "marked", label: "Marked" },
  { state: "unanswered", label: "Unanswered" },
];

export function QuestionNavigator({
  total,
  states,
  current,
  onSelect,
  showLegend = true,
  
}: QuestionNavigatorProps) {
  return (
    <div className="space-y-4 p-4 md:p-0">
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(2.75rem, 1fr))",
        }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const state = states[i] || "unanswered";
          const isCurrent = i === current || state === "current";
          const isAnswered = state === "answered" && !isCurrent;
          const isMarked = state === "marked" && !isCurrent;
          const isUnanswered = !isCurrent && !isAnswered && !isMarked;

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`Question ${i + 1}, ${isCurrent ? "current" : state}`}
              className={cn(
                "group relative flex aspect-square min-h-11 items-center justify-center rounded-xl border text-sm font-semibold",
                "transition-all duration-200 ease-out motion-reduce:transition-none",
                "hover:-translate-y-0.5 active:translate-y-0 active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isCurrent &&
                  "border-transparent bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/40",
                isAnswered &&
                  "border-emerald-500/25 bg-emerald-500/[0.07] text-emerald-700 hover:border-emerald-500/40 hover:bg-emerald-500/[0.12] dark:text-emerald-400",
                isMarked &&
                  "border-amber-500/30 bg-amber-500/[0.08] text-amber-700 hover:border-amber-500/45 hover:bg-amber-500/[0.14] dark:text-amber-400",
                isUnanswered &&
                  "border-border/80 bg-card text-muted-foreground hover:border-foreground/20 hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <span className={cn(isCurrent && "drop-shadow-sm")}>{i + 1}</span>

              {isAnswered && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm ring-2 ring-card">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
              )}

              {isMarked && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm ring-2 ring-card">
                  <Bookmark className="h-2.5 w-2.5 fill-current" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {showLegend && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border/60 p-3 text-xs text-muted-foreground">
          {LEGEND_ITEMS.map(({ state, label }) => (
            <div key={state} className="flex items-center gap-1.5 ">
              <span
                className={cn(
                  "h-2.5 w-2.5 shrink-0 rounded-full",
                  state === "current" &&
                    "bg-gradient-to-br from-emerald-500 to-emerald-600",
                  state === "answered" && "bg-emerald-500/60",
                  state === "marked" && "bg-amber-500/70",
                  state === "unanswered" &&
                    "border border-border bg-transparent",
                )}
              />
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
