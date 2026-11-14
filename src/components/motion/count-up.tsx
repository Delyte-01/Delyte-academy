"use client";

import { useRef } from "react";
import { DURATION, EASE, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

interface CountUpProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

// Fixed locale so server and client render identical text (no hydration mismatch).
const format = (n: number, decimals: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/**
 * Animated number. SSR renders the final value (no flash, no layout shift);
 * on the client it counts up once when scrolled into view and re-tweens when `value` changes.
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = DURATION.slow,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef<number | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const write = (n: number) => {
        el.textContent = `${prefix}${format(n, decimals)}${suffix}`;
      };

      if (prefersReducedMotion() || !Number.isFinite(value)) {
        write(value);
        shown.current = value;
        return;
      }

      const state = { n: shown.current ?? 0 };
      write(state.n);
      gsap.to(state, {
        n: value,
        duration,
        ease: EASE.out,
        onUpdate: () => {
          write(state.n);
          shown.current = state.n;
        },
        onComplete: () => write(value),
        scrollTrigger:
          shown.current === null
            ? { trigger: el, start: "top 95%", once: true }
            : undefined,
      });
    },
    { dependencies: [value, decimals, prefix, suffix], scope: ref },
  );

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${format(value, decimals)}${suffix}`}>
      {prefix}
      {format(value, decimals)}
      {suffix}
    </span>
  );
}
