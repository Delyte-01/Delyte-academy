"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EASE, gsap, hasFinePointer, prefersReducedMotion, useGSAP } from "@/lib/gsap";

interface MagneticProps {
  children: ReactNode;
  /** 0–1. How far the element follows the cursor. */
  strength?: number;
  className?: string;
}

/**
 * Wraps a CTA so it gently follows the cursor (mouse only).
 * No-op on touch devices and under reduced motion.
 */
export function Magnetic({ children, strength = 0.28, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe || prefersReducedMotion() || !hasFinePointer()) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: EASE.out });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: EASE.out });

      const onMove = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      });
      const onLeave = contextSafe(() => {
        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: EASE.spring });
      });

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("inline-block will-change-transform", className)}>
      {children}
    </div>
  );
}
