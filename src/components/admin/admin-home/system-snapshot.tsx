"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SystemMetric } from "./dashboard-data";

interface SystemSnapshotProps {
  metrics: SystemMetric[];
}

export function SystemSnapshot({ metrics }: SystemSnapshotProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold">System Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.id} className="rounded-2xl border p-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${metric.bgColor}`}
                >
                  <Icon className={`h-4.5 w-4.5 ${metric.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {metric.value}
                  </p>
                </div>
              </div>
              {metric.progress !== undefined && (
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                    style={{ width: `${metric.progress}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
