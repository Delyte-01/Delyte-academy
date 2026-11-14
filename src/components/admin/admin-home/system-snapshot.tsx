"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";
import type { SystemMetric } from "@/hooks/useSystemSnapShot";
import type { StatTone } from "@/components/ui/stat-card";

const TONE: Record<StatTone, string> = {
  brand: "bg-primary-soft text-primary-soft-foreground",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
  neutral: "bg-muted text-foreground",
};

export function SystemSnapshot({ metrics }: { metrics: SystemMetric[] }) {
  if (metrics.length === 0) return null;
  return (
    <section aria-labelledby="snapshot">
      <SectionHeader title="Platform snapshot" description="Live totals across the academy" />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <li key={m.id} className="rounded-xl border bg-card p-4 shadow-card">
              <div className="flex items-center gap-3">
                <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", TONE[m.tone])}>
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] text-muted-foreground">{m.label}</p>
                  <p className="font-heading text-xl font-extrabold tabular-nums text-foreground">{m.value}</p>
                </div>
              </div>
              {m.progress !== undefined && <ProgressBar value={m.progress} label={m.label} className="mt-3" />}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
