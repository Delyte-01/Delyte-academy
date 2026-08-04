"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import gsap from "gsap";
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

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function OptionCard({
  option,
  letter,
  selected,
  onSelect,
}: OptionCardProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Tiny confirmation bounce when this option becomes the selected one.
  useEffect(() => {
    if (!selected || !buttonRef.current || prefersReducedMotion()) return;

    gsap.fromTo(
      buttonRef.current,
      { scale: 0.98 },
      { scale: 1, duration: 0.25, ease: "back.out(3)" },
    );
  }, [selected]);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border-2 p-3.5 text-left transition-all duration-200 active:scale-[0.98] sm:p-4",
        selected
          ? "border-emerald-500 bg-emerald-500/5 shadow-sm"
          : "border-border bg-card hover:border-emerald-500/40 hover:bg-muted/30",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors sm:h-9 sm:w-9 sm:text-sm",
          selected
            ? "bg-emerald-500 text-white"
            : "bg-muted text-muted-foreground",
        )}
      >
        {selected ? <Check className="h-4 w-4" /> : letter}
      </span>
      <span
        className={cn(
          "flex-1 break-words text-sm leading-relaxed sm:text-[15px]",
          selected ? "font-semibold text-foreground" : "text-muted-foreground",
        )}
      >
        <MathRenderer text={option.text} />
      </span>
    </button>
  );
}
