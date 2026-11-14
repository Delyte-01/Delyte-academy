"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { gsap, hasFinePointer, prefersReducedMotion, useGSAP } from "@/lib/gsap";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Card with a soft brand glow that tracks the cursor (mouse only).
 * Renders as a normal card on touch / reduced motion.
 */
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const card = ref.current;
      const g = glow.current;
      if (!card || !g || !contextSafe || prefersReducedMotion() || !hasFinePointer()) return;

      const xTo = gsap.quickTo(g, "x", { duration: 0.45, ease: "power3.out" });
      const yTo = gsap.quickTo(g, "y", { duration: 0.45, ease: "power3.out" });

      const onMove = contextSafe((e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        xTo(e.clientX - r.left - 160);
        yTo(e.clientY - r.top - 160);
      });
      const onEnter = contextSafe(() => gsap.to(g, { opacity: 1, duration: 0.3 }));
      const onLeave = contextSafe(() => gsap.to(g, { opacity: 0, duration: 0.4 }));

      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointerleave", onLeave);
      return () => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-card",
        className,
      )}
    >
      <div
        ref={glow}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 size-80 rounded-full opacity-0"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--brand-from) 16%, transparent), transparent)",
        }}
      />
      <div className="relative flex flex-1 flex-col">{children}</div>
    </div>
  );
}
