"use client";

import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

/** A question can be answered AND marked, so the two are tracked separately. */
export interface NavItem {
  answered: boolean;
  marked: boolean;
}

interface QuestionNavigatorProps {
  items: NavItem[];
  current: number;
  onSelect: (index: number) => void;
}

export function QuestionNavigator({
  items,
  current,
  onSelect,
}: QuestionNavigatorProps) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-7 lg:grid-cols-5">
      {items.map((item, i) => {
        const isCurrent = i === current;
        const status = item.answered ? "answered" : "not answered";
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            aria-current={isCurrent ? "step" : undefined}
            aria-label={`Question ${i + 1}, ${status}${item.marked ? ", marked for review" : ""}`}
            className={cn(
              "relative flex aspect-square min-h-11 items-center justify-center rounded-xl border text-sm font-semibold tabular-nums transition-colors motion-reduce:transition-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isCurrent
                ? "border-emerald-600 bg-emerald-600 text-white"
                : item.answered
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400"
                  : "border-border bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {i + 1}
            {item.marked && (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-amber-500 text-white ring-2 ring-background">
                <Bookmark className="size-2.5 fill-current" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
