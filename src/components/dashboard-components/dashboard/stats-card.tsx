"use client";

import { useEffect, useRef } from "react";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * Tailwind needs full class names at build time, so each tone is spelled out.
 */
const TONES = {
  blue: {
    chip: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    bar: "bg-blue-500",
  },
  emerald: {
    chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
  },
  amber: {
    chip: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    bar: "bg-amber-500",
  },
  violet: {
    chip: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    bar: "bg-violet-500",
  },
} as const;

export type StatTone = keyof typeof TONES;

interface StatCardProps {
  label: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  /** Accent colour for the icon chip and progress bar. */
  tone?: StatTone;
  /** Optional 0–100 value; renders a thin progress bar under the number. */
  progress?: number;
  /** Optional trend pill. Only pass real data. */
  trend?: string;
  trendUp?: boolean;
  /** Overrides the icon colour (kept so older usages keep compiling). */
  iconColor?: string;
  /** @deprecated No longer used by the new design; accepted so old call sites still compile. */
  gradient?: string;
}

interface ParsedValue {
  prefix: string;
  number: number;
  suffix: string;
  decimals: number;
}

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Splits "82%", "1,204", or 42 into an animatable numeric part + static prefix/suffix. */
function parseValue(value: number | string): ParsedValue | null {
  if (typeof value === "number") {
    return { prefix: "", number: value, suffix: "", decimals: 0 };
  }

  const match = value.match(/^(\D*)([\d,]+(?:\.\d+)?)(\D*)$/);
  if (!match) return null;

  const [, prefix, numStr, suffix] = match;
  const cleaned = numStr.replace(/,/g, "");
  const number = Number.parseFloat(cleaned);
  if (Number.isNaN(number)) return null;

  const decimals = cleaned.includes(".") ? cleaned.split(".")[1].length : 0;

  return { prefix, number, suffix, decimals };
}

function formatCounted(val: number, parsed: ParsedValue): string {
  const rounded =
    parsed.decimals > 0
      ? val.toFixed(parsed.decimals)
      : Math.round(val).toLocaleString();
  return `${parsed.prefix}${rounded}${parsed.suffix}`;
}

export function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  tone = "emerald",
  progress,
  trend,
  trendUp = true,
  iconColor,
}: StatCardProps) {
  const valueRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const palette = TONES[tone];
  const clampedProgress =
    progress === undefined ? null : Math.max(0, Math.min(100, progress));

  // Count-up for the headline number.
  useEffect(() => {
    const parsed = parseValue(value);
    const el = valueRef.current;
    if (!parsed || !el) return;

    if (prefersReducedMotion()) {
      el.textContent = formatCounted(parsed.number, parsed);
      return;
    }

    const counter = { val: 0 };
    const tween: gsap.core.Tween = gsap.to(counter, {
      val: parsed.number,
      duration: 0.9,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = formatCounted(counter.val, parsed);
      },
    });

    return () => {
      tween.kill();
    };
  }, [value]);

  // Fill animation for the optional progress bar.
  useEffect(() => {
    const bar = barRef.current;
    if (clampedProgress === null || !bar) return;

    if (prefersReducedMotion()) {
      bar.style.width = `${clampedProgress}%`;
      return;
    }

    const tween: gsap.core.Tween = gsap.fromTo(
      bar,
      { width: "0%" },
      { width: `${clampedProgress}%`, duration: 0.9, ease: "power2.out" },
    );

    return () => {
      tween.kill();
    };
  }, [clampedProgress]);

  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
            palette.chip,
          )}
        >
          <Icon className={cn("h-[18px] w-[18px]", iconColor)} />
        </div>
      </div>

      <p
        ref={valueRef}
        className="mt-3 text-3xl font-bold tabular-nums tracking-tight text-foreground"
      >
        {value}
      </p>

      {clampedProgress !== null && (
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${clampedProgress}%`}
        >
          <div
            ref={barRef}
            className={cn("h-full rounded-full", palette.bar)}
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
      )}

      {(subtitle || trend) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                trendUp
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-700 dark:text-rose-400",
              )}
            >
              {trendUp ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend}
            </span>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
}
