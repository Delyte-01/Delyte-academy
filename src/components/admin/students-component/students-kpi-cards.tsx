"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Activity,
  UserPlus,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { AdminStudent as Student } from "@/hooks/useAdminStudents";

interface StudentsKpiCardsProps {
  students: Student[];
}

export function StudentsKpiCards({ students }: StudentsKpiCardsProps) {
  const cards = useMemo(() => {
    const now = new Date();

    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    const monthAgo = new Date();
    monthAgo.setMonth(now.getMonth() - 1);

    const totalStudents = students.length;

    const activeThisWeek = students.filter(
      (s) => new Date(s.lastActive) >= weekAgo,
    ).length;

    const newThisMonth = students.filter(
      (s) => new Date(s.created_at) >= monthAgo,
    ).length;

    const avgProgress =
      totalStudents > 0
        ? Math.round(
            students.reduce((sum, s) => sum + s.progress, 0) / totalStudents,
          )
        : 0;

    return [
      {
        id: "total",
        label: "Total Students",
        value: totalStudents.toLocaleString(),
        trend: "up" as const,
        change: "+0%",
        icon: Users,
        color: "text-emerald-600",
        bgColor: "bg-emerald-500/10",
      },
      {
        id: "active",
        label: "Active This Week",
        value: activeThisWeek.toLocaleString(),
        trend: "up" as const,
        change: "+0%",
        icon: Activity,
        color: "text-blue-600",
        bgColor: "bg-blue-500/10",
      },
      {
        id: "new",
        label: "New This Month",
        value: newThisMonth.toLocaleString(),
        trend: "up" as const,
        change: "+0%",
        icon: UserPlus,
        color: "text-violet-600",
        bgColor: "bg-violet-500/10",
      },
      {
        id: "progress",
        label: "Avg. Course Progress",
        value: `${avgProgress}%`,
        trend: "up" as const,
        change: "+0%",
        icon: TrendingUp,
        color: "text-amber-600",
        bgColor: "bg-amber-500/10",
      },
    ];
  }, [students]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.id} className="transition-all hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.bgColor}`}
                >
                  <Icon className={`h-5 w-5 ${stat.color}`} />
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
