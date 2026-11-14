"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { EASE, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

interface AnimatedCheckProps {
  /** When this flips false → true the tick draws itself and the badge pops. */
  done: boolean;
  size?: number;
  className?: string;
}

/**
 * Completion badge. Idle state is a quiet outlined tick; on completion the
 * SVG path strokes in and the badge settles with a small spring.
 * Already-complete on first render is static (no replay on every visit).
 */
export function AnimatedCheck({ done, size = 44, className }: AnimatedCheckProps) {
  const root = useRef<HTMLSpanElement>(null);
  const tick = useRef<SVGPathElement>(null);
  const wasDone = useRef(done);

  useGSAP(
    () => {
      const before = wasDone.current;
      wasDone.current = done;
      if (!done || before || prefersReducedMotion()) return;
      if (!root.current || !tick.current) return;

      gsap.fromTo(
        root.current,
        { scale: 0.8 },
        { scale: 1, duration: 0.6, ease: EASE.spring, clearProps: "transform" },
      );
      gsap.fromTo(
        tick.current,
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.45, delay: 0.05, ease: EASE.out },
      );
    },
    { dependencies: [done], scope: root },
  );

  return (
    <span
      ref={root}
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-300",
        done ? "bg-primary text-primary-foreground shadow-brand" : "bg-muted text-muted-foreground",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path ref={tick} d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} strokeDasharray={1} strokeDashoffset={0} />
      </svg>
    </span>
  );
}
