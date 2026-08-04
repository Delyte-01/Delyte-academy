"use client";

import { Card, CardContent } from "@/components/ui/card";
import { OverviewStat } from "@/types/progress";


interface OverviewStatsProps {
  stats: OverviewStat[];
}

export function OverviewStats({ stats }: OverviewStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.id} className="transition-all hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-5">
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${stat.bgColor}`}
              >
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-extrabold tracking-tight text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs font-medium text-foreground">
                  {stat.label}
                </p>
                <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
