import type { LucideIcon } from "lucide-react";
import { CountUp } from "@/components/motion/count-up";
import { cn } from "@/lib/utils";
import type { StatTone } from "@/components/ui/stat-card";

const TONES: Record<StatTone, string> = {
  brand: "bg-primary-soft text-primary-soft-foreground",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
  neutral: "bg-muted text-foreground",
};

export interface StatStripItem {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: StatTone;
}

/**
 * One card, divided cells. Quieter than a row of StatCards, so the tabs below
 * stay the focus of a workspace page. Real numbers only.
 */
export function StatStrip({ items, className }: { items: StatStripItem[]; className?: string }) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 divide-x divide-y rounded-xl border bg-card shadow-card sm:divide-y-0",
        items.length === 3 && "sm:grid-cols-3",
        items.length === 4 && "sm:grid-cols-4",
        className,
      )}
    >
      {items.map(({ label, value, icon: Icon, tone = "brand" }) => (
        <div key={label} className="flex items-center gap-3 p-4 sm:p-5">
          <span
            className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", TONES[tone])}
          >
            <Icon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <dt className="truncate text-[13px] font-semibold text-muted-foreground">{label}</dt>
            <dd className="font-heading text-2xl font-extrabold leading-tight tabular-nums text-foreground">
              {typeof value === "number" ? <CountUp value={value} /> : value}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
