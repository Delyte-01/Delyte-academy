"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface QuizProgressProps {
  current: number;
  total: number;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function QuizProgress({ current, total }: QuizProgressProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  const percentLabelRef = useRef<HTMLSpanElement>(null);
  const prevPercentRef = useRef(0);

  // Count the percentage up/down smoothly instead of jumping between values.
  useEffect(() => {
    const from = prevPercentRef.current;
    prevPercentRef.current = percent;

    if (!percentLabelRef.current) return;

    if (prefersReducedMotion()) {
      percentLabelRef.current.textContent = `${percent}% Complete`;
      return;
    }

    const obj = { val: from };
    const tween = gsap.to(obj, {
      val: percent,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        if (percentLabelRef.current) {
          percentLabelRef.current.textContent = `${Math.round(obj.val)}% Complete`;
        }
      },
    });

    return () => {
      tween.kill();
    };
  }, [percent]);

  return (
    <div className="space-y-1.5 sm:space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs sm:text-sm">
        <span className="font-semibold text-foreground">
          Question {current} of {total}
        </span>
        <span
          ref={percentLabelRef}
          className="tabular-nums text-muted-foreground"
        >
          {percent}% Complete
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted sm:h-2.5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
