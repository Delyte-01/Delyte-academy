"use client";

import { cn } from "@/lib/utils";
import { MathRenderer } from "@/components/common/math-renderer";

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface OptionCardProps {
  option: QuizOption;
  letter: string;
  selected: boolean;
  onSelect: () => void;
}

export function OptionCard({
  option,
  letter,
  selected,
  onSelect,
}: OptionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex min-h-14 w-full items-center gap-3.5 rounded-2xl border p-3.5 text-left transition-colors sm:p-4",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500"
          : "border-border bg-card hover:border-foreground/25 hover:bg-muted/40 active:bg-muted/60",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
          selected
            ? "bg-emerald-600 text-white"
            : "bg-muted text-muted-foreground",
        )}
      >
        {letter}
      </span>
      <span className="min-w-0 flex-1 break-words text-[15px] leading-relaxed sm:text-base">
        <MathRenderer text={option.text} />
      </span>
    </button>
  );
}
