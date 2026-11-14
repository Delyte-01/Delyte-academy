"use client";

import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDashboardStats } from "@/hooks/useAdminDashboardStats";

export function KpiCards() {
  const { stats, loading } = useAdminDashboardStats();

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" role="status" aria-label="Loading statistics">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[148px] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s, i) => (
        <div key={s.id} className="animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
          <StatCard label={s.label} value={s.value} icon={s.icon} tone={s.tone} hint={s.hint} />
        </div>
      ))}
    </div>
  );
}
