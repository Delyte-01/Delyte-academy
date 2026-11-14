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
import type { StatTone } from "@/components/ui/stat-card";


export interface KpiStat {
  id: string;
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  tone: StatTone;
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
      { id: "students", label: "Total students", value: students, hint: "Registered learners", icon: Users, tone: "brand" },
      { id: "enrollments", label: "Active enrollments", value: enrollments, hint: "Across all courses", icon: GraduationCap, tone: "success" },
      { id: "courses", label: "Published courses", value: publishedCourses, hint: "Visible to students", icon: BookOpen, tone: "info" },
      { id: "quizzes", label: "Quiz attempts", value: quizzesCompleted, hint: "Submitted by students", icon: ClipboardCheck, tone: "warning" },
    ],
    [students, enrollments, publishedCourses, quizzesCompleted],
  );

  return { stats, loading };
}
