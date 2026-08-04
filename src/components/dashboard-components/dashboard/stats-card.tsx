"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

interface StatCardProps {
  label: string;
  value: number | string;
  subtitle: string;
  trend: string;
  trendUp: boolean;
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
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
  trend,
  trendUp,
  icon: Icon,
  gradient,
  iconColor,
}: StatCardProps) {
  const valueRef = useRef<HTMLParagraphElement>(null);

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
        if (el) el.textContent = formatCounted(counter.val, parsed);
      },
    });

    return () => {
      tween.kill();
    };
  }, [value]);

  return (
    <Card className="group relative overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 p-2">
      <div
        className={cn(
          "relative overflow-hidden bg-gradient-to-br p-5 shadow-lg shadow-black/5 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-xl group-hover:shadow-black/10 rounded-2xl",
          gradient,
        )}
      >
        {/* Decorative glass glow behind the icon — subtle, not literal blur-panel overkill */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/40 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60 dark:bg-white/10"
        />

        <CardContent className="relative z-10 p-0">
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/40 bg-white/30 shadow-inner backdrop-blur-sm dark:border-white/10">
              <Icon className={cn("h-5 w-5", iconColor)} />
            </div>
            <span
              className={cn(
                "flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-semibold",
                trendUp
                  ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                  : "bg-rose-500/20 text-rose-700 dark:text-rose-400",
              )}
            >
              {trendUp ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend}
            </span>
          </div>
          <p
            ref={valueRef}
            className="mt-4 text-2xl font-extrabold tabular-nums tracking-tight text-foreground sm:text-3xl"
          >
            {value}
          </p>
          <p className="mt-0.5 text-sm font-medium text-foreground">{label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </CardContent>
      </div>
    </Card>
  );
}
