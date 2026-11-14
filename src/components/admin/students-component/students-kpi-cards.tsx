"use client";

import { useMemo } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Activity, TrendingUp, UserPlus, Users } from "lucide-react";
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
      { id: "total", label: "Total students", value: totalStudents, icon: Users, tone: "brand" as const },
      { id: "active", label: "Active this week", value: activeThisWeek, icon: Activity, tone: "info" as const },
      { id: "new", label: "New this month", value: newThisMonth, icon: UserPlus, tone: "success" as const },
      { id: "progress", label: "Avg. course progress", value: avgProgress, suffix: "%", icon: TrendingUp, tone: "warning" as const },
    ];
  }, [students]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => (
        <StatCard key={c.id} label={c.label} value={c.value} suffix={c.suffix} icon={c.icon} tone={c.tone} />
      ))}
    </div>
  );
}
