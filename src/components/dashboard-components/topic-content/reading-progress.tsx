"use client";

import { useRef } from "react";
import { ScrollTrigger, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/**
 * Thin brand bar pinned to the top of the viewport. Its fill is scrubbed to the
 * scroll position through the lesson body (GSAP ScrollTrigger, transform only).
 * Under reduced motion the bar still tracks scroll exactly, just without easing.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const target = document.getElementById(targetId);
      const el = bar.current;
      if (!target || !el) return;

      gsap.set(el, { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.to(el, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: target,
          start: "top 25%",
          end: "bottom 70%",
          scrub: prefersReducedMotion() ? true : 0.35,
        },
      });

      // Images, maths and embeds change the lesson height after first paint.
      let raf = 0;
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      });
      ro.observe(target);

      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
      };
    },
    { dependencies: [targetId], scope: bar },
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]">
      <div ref={bar} className="bg-brand-gradient h-full w-full origin-left scale-x-0" />
    </div>
  );
}
