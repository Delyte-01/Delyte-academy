"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";


export interface KpiStat {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  sublabel: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export function useAdminDashboardStats() {
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState(0);
  const [enrollments, setEnrollments] = useState(0);
  const [publishedCourses, setPublishedCourses] = useState(0);
  const [quizzesCompleted, setQuizzesCompleted] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase.rpc("admin_dashboard_stats");

        if (error) throw error;

        setStudents(data?.students ?? 0);
        setEnrollments(data?.enrollments ?? 0);
        setPublishedCourses(data?.published_courses ?? 0);
        setQuizzesCompleted(data?.quiz_attempts ?? 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats: KpiStat[] = useMemo(
    () => [
      {
        id: "students",
        label: "Total Students",
        value: students.toLocaleString(),
        change: "Live",
        trend: "up",
        sublabel: "Registered learners",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-500/10",
      },
      {
        id: "enrollments",
        label: "Active Enrollments",
        value: enrollments.toLocaleString(),
        change: "Live",
        trend: "up",
        sublabel: "Across all courses",
        icon: GraduationCap,
        color: "text-emerald-600",
        bgColor: "bg-emerald-500/10",
      },
      {
        id: "courses",
        label: "Published Courses",
        value: publishedCourses.toLocaleString(),
        change: "Live",
        trend: "up",
        sublabel: "Visible to students",
        icon: BookOpen,
        color: "text-violet-600",
        bgColor: "bg-violet-500/10",
      },
      {
        id: "quizzes",
        label: "Quizzes Completed",
        value: quizzesCompleted.toLocaleString(),
        change: "Live",
        trend: "up",
        sublabel: "Total quiz attempts",
        icon: ClipboardCheck,
        color: "text-amber-600",
        bgColor: "bg-amber-500/10",
      },
    ],
    [students, enrollments, publishedCourses, quizzesCompleted],
  );
  console.log("stats", stats, students);

  return { stats, loading };
}
