import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/motion/count-up";
import { ProgressBar } from "@/components/ui/progress-bar";

const TONES = {
  brand: "bg-primary-soft text-primary-soft-foreground",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
  neutral: "bg-muted text-foreground",
} as const;

export type StatTone = keyof typeof TONES;

interface StatCardProps {
  label: string;
  /** Numbers count up on scroll-in; strings render as-is. */
  value: number | string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon: LucideIcon;
  tone?: StatTone;
  /** Small supporting line, e.g. "3 in progress". Real data only. */
  hint?: string;
  /** Optional trend pill. Real data only. */
  trend?: { label: string; up: boolean };
  /** Optional 0–100 progress under the number. */
  progress?: number;
  className?: string;
}

/** Shared KPI tile for student and admin dashboards. */
export function StatCard({
  label,
  value,
  prefix,
  suffix,
  decimals,
  icon: Icon,
  tone = "brand",
  hint,
  trend,
  progress,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "hover-lift relative flex h-full flex-col gap-4 rounded-xl border bg-card p-5 shadow-card",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <span className={cn("flex size-10 items-center justify-center rounded-xl", TONES[tone])}>
          <Icon className="size-5" aria-hidden />
        </span>
      </div>

      <p className="font-heading text-[34px] font-extrabold leading-none tracking-tight tabular-nums text-foreground">
        {typeof value === "number" ? (
          <CountUp value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
        ) : (
          value
        )}
      </p>

      {progress !== undefined && <ProgressBar value={progress} label={label} />}

      {(hint || trend) && (
        <div className="mt-auto flex flex-wrap items-center gap-2">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold",
                trend.up ? "bg-success-soft text-success" : "bg-destructive/10 text-destructive",
              )}
            >
              {trend.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {trend.label}
            </span>
          )}
          {hint && <span className="text-[13px] text-muted-foreground">{hint}</span>}
        </div>
      )}
    </div>
  );
}
