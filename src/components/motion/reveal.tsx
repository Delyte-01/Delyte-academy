"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DURATION, EASE, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

interface RevealProps {
  children: ReactNode;
  /** Element to render. Defaults to `div`. */
  as?: ElementType;
  className?: string;
  /**
   * CSS selector of descendants to animate in sequence (e.g. "[data-reveal]").
   * When omitted the wrapper itself fades up.
   */
  selector?: string;
  /** Pixels the element travels while fading in. */
  y?: number;
  delay?: number;
  duration?: number;
  /** Seconds between each matched descendant (only with `selector`). */
  stagger?: number;
  /** Play when scrolled into view (default) or immediately on mount. */
  on?: "scroll" | "mount";
}

/**
 * Fade-up entrance driven by GSAP + ScrollTrigger.
 * Plays once, clears its inline styles afterwards (so hover transforms still work),
 * and does nothing under `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  selector,
  y = 18,
  delay = 0,
  duration = DURATION.base,
  stagger = 0.07,
  on = "scroll",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;

      const targets = selector ? root.querySelectorAll(selector) : root;
      if (selector && (targets as NodeListOf<Element>).length === 0) return;

      gsap.from(targets, {
        opacity: 0,
        y,
        duration,
        delay,
        ease: EASE.out,
        stagger: selector ? stagger : 0,
        clearProps: "opacity,transform",
        scrollTrigger:
          on === "scroll"
            ? { trigger: root, start: "top 90%", once: true }
            : undefined,
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
