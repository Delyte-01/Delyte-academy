"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EASE, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

interface ProgressRingProps {
  /** 0–100 */
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  /** Arc colour. Brand uses the gradient; others use a solid status token. */
  tone?: "brand" | "success" | "warning";
  /** Content in the middle, e.g. the percentage. */
  children?: ReactNode;
  className?: string;
}

/** Circular progress whose arc draws in when scrolled into view. */
export function ProgressRing({
  value,
  size = 96,
  stroke = 8,
  label = "Progress",
  tone = "brand",
  children,
  className,
}: ProgressRingProps) {
  const arc = useRef<SVGCircleElement>(null);
  const pct = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const target = c * (1 - pct / 100);

  useGSAP(
    () => {
      const el = arc.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        el.style.strokeDashoffset = String(target);
        return;
      }
      gsap.fromTo(
        el,
        { strokeDashoffset: c },
        {
          strokeDashoffset: target,
          duration: 1.1,
          ease: EASE.out,
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
        },
      );
    },
    { dependencies: [pct, c, target], scope: arc },
  );

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id="delyte-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand-from)" />
            <stop offset="100%" stopColor="var(--brand-to)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
        <circle
          ref={arc}
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone === "brand" ? "url(#delyte-ring)" : `var(--${tone})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={target}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">{children}</div>
    </div>
  );
}
