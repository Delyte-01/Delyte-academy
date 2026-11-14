"use client";

import { useRef } from "react";
import { Check } from "lucide-react";

import { MathRenderer } from "@/components/common/math-renderer";
import { EASE, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

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

/** One answer choice. The letter doubles as the keyboard shortcut hint. */
export function OptionCard({ option, letter, selected, onSelect }: OptionCardProps) {
  const badge = useRef<HTMLSpanElement>(null);
  const wasSelected = useRef(selected);

  // Gentle confirmation when an answer is picked (transform only; skipped on first paint).
  useGSAP(
    () => {
      const before = wasSelected.current;
      wasSelected.current = selected;
      if (!selected || before || prefersReducedMotion() || !badge.current) return;
      gsap.fromTo(
        badge.current,
        { scale: 0.78 },
        { scale: 1, duration: 0.5, ease: EASE.spring, clearProps: "transform" },
      );
    },
    { dependencies: [selected], scope: badge },
  );

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "group flex min-h-16 w-full items-center gap-4 rounded-xl border p-3.5 text-left outline-none transition-[border-color,background-color,box-shadow] duration-150 motion-reduce:transition-none sm:p-4",
        "focus-visible:ring-[3px] focus-visible:ring-ring/40",
        selected
          ? "border-primary bg-primary-soft shadow-card"
          : "bg-card shadow-soft hover:border-primary/40 hover:bg-primary-soft/40 active:bg-primary-soft/60",
      )}
    >
      <span
        ref={badge}
        aria-hidden
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold transition-colors",
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground group-hover:bg-primary-soft group-hover:text-primary-soft-foreground",
        )}
      >
        {selected ? <Check className="size-4" strokeWidth={3} /> : letter}
      </span>
      <span className="min-w-0 flex-1 break-words text-[16px] leading-relaxed">
        <MathRenderer text={option.text} />
      </span>
    </button>
  );
}
