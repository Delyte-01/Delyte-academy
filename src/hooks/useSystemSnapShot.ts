/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  ListChecks,
  ClipboardCheck,
  Users,
  TrendingUp,
  Award,
  LucideIcon,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/constants/database";

export interface SystemMetric {
  id: string;
  label: string;
  value: string;
  progress?: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export function useSystemSnapshot() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      try {
        const [dashboard, courses, topics, quizzes, progress, attempts] =
          await Promise.all([
            supabase.rpc("admin_dashboard_stats"),
            supabase
              .from(TABLES.COURSES)
              .select("id", { count: "exact", head: true }),
            supabase
              .from(TABLES.TOPICS)
              .select("id", { count: "exact", head: true }),
            supabase
              .from(TABLES.QUIZZES)
              .select("id", { count: "exact", head: true }),
            supabase.from(TABLES.TOPIC_PROGRESS).select("completed"),
            supabase.from(TABLES.QUIZ_ATTEMPTS).select("score"),
          ]);

        const completed = (progress.data ?? []).filter(
          (p: any) => p.completed,
        ).length;
        const totalProgress = progress.data?.length ?? 0;
        const completionRate =
          totalProgress > 0 ? Math.round((completed / totalProgress) * 100) : 0;

        const avgScore =
          attempts.data && attempts.data.length > 0
            ? Math.round(
                attempts.data.reduce(
                  (sum: number, a: any) => sum + a.score,
                  0,
                ) / attempts.data.length,
              )
            : 0;

        setMetrics([
          {
            id: "courses",
            label: "Total Courses",
            value: String(courses.count ?? 0),
            icon: BookOpen,
            color: "text-blue-600",
            bgColor: "bg-blue-500/10",
          },
          {
            id: "topics",
            label: "Learning Topics",
            value: String(topics.count ?? 0),
            icon: ListChecks,
            color: "text-emerald-600",
            bgColor: "bg-emerald-500/10",
          },
          {
            id: "quizzes",
            label: "Quizzes",
            value: String(quizzes.count ?? 0),
            icon: ClipboardCheck,
            color: "text-violet-600",
            bgColor: "bg-violet-500/10",
          },
          {
            id: "students",
            label: "Students",
            value: String(dashboard.data?.students ?? 0),
            icon: Users,
            color: "text-amber-600",
            bgColor: "bg-amber-500/10",
          },
          {
            id: "completion",
            label: "Completion Rate",
            value: `${completionRate}%`,
            progress: completionRate,
            icon: TrendingUp,
            color: "text-emerald-600",
            bgColor: "bg-emerald-500/10",
          },
          {
            id: "score",
            label: "Average Quiz Score",
            value: `${avgScore}%`,
            progress: avgScore,
            icon: Award,
            color: "text-violet-600",
            bgColor: "bg-violet-500/10",
          },
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  return { metrics };
}
