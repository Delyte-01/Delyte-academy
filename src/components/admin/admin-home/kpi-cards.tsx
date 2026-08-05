"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useAdminDashboardStats } from "@/hooks/useAdminDashboardStats";



export function KpiCards() {

    const { stats } = useAdminDashboardStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.id} className="transition-all hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.bgColor}`}
                >
                  <Icon className={`h-5.5 w-5.5 ${stat.color}`} />
                </div>
                <span
                  className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    stat.trend === "up"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-rose-500/10 text-rose-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="mt-4 text-2xl font-extrabold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="mt-0.5 text-sm font-medium text-foreground">
                {stat.label}
              </p>
              <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
