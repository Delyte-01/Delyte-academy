"use client";

import { useEffect, useRef } from "react";

/** Thin bar pinned to the top of the viewport that fills as the lesson is read. */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const el = document.getElementById(targetId);
      if (!el || !bar.current) return;
      const rect = el.getBoundingClientRect();
      const denom = Math.max(rect.height - window.innerHeight * 0.6, 1);
      const p = Math.min(
        1,
        Math.max(0, (window.innerHeight * 0.2 - rect.top) / denom),
      );
      bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targetId]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5"
    >
      <div ref={bar} className="h-full origin-left scale-x-0 bg-emerald-500" />
    </div>
  );
}
