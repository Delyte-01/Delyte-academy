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
              "relative flex aspect-square min-h-11 items-center justify-center rounded-xl border text-sm font-bold tabular-nums transition-colors motion-reduce:transition-none",
              "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
              isCurrent
                ? "border-primary bg-primary text-primary-foreground shadow-brand"
                : item.answered
                  ? "border-primary/25 bg-primary-soft text-primary-soft-foreground hover:border-primary/50"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {i + 1}
            {item.marked && (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-warning text-background ring-2 ring-background">
                <Bookmark className="size-2.5 fill-current" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
