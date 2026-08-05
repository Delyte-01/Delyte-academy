/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/constants/database";

export interface EnrollmentTrendItem {
  day: string;
  enrollments: number;
}

export interface StudentActivity {
  id: string;
  type: "enrolled" | "quiz" | "topic" | "finished";
  name: string;
  initials: string;
  action: string;
  course: string;
  time: string;
}

function formatRelative(date: string) {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return then.toLocaleDateString();
}

export function useAdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [enrollmentTrend, setEnrollmentTrend] = useState<EnrollmentTrendItem[]>(
    [],
  );
  const [recentActivity, setRecentActivity] = useState<StudentActivity[]>([]);

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      try {
        setLoading(true);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        const { data: enrollments, error } = await supabase
          .from(TABLES.ENROLLMENTS)
          .select(
            `
          id,
          enrolled_at,
          student_id,
          course:courses!enrollments_course_id_fkey(title)
        `,
          )
          .gte("enrolled_at", sevenDaysAgo.toISOString())
          .order("enrolled_at", { ascending: true });

        if (error) throw error;

        const dayMap = new Map<string, number>();

        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          dayMap.set(d.toLocaleDateString("en-US", { weekday: "short" }), 0);
        }

        (enrollments ?? []).forEach((e: any) => {
          const day = new Date(e.enrolled_at).toLocaleDateString("en-US", {
            weekday: "short",
          });

          dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
        });

        setEnrollmentTrend(
          Array.from(dayMap.entries()).map(([day, count]) => ({
            day,
            enrollments: count,
          })),
        );

        const studentIds = [
          ...new Set((enrollments ?? []).map((e: any) => e.student_id)),
        ];

        let profileMap = new Map<
          string,
          { full_name: string | null; email: string | null }
        >();

        if (studentIds.length > 0) {
          const { data: profiles } = await supabase
            .from(TABLES.Profiles)
            .select("id, full_name, email")
            .in("id", studentIds);

          profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
        }

        setRecentActivity(
          (enrollments ?? [])
            .slice()
            .reverse()
            .slice(0, 10)
            .map((e: any) => {
              const student = profileMap.get(e.student_id);

              const name =
                student?.full_name ||
                student?.email?.split("@")[0] ||
                "Student";

              const initials = name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return {
                id: e.id,
                type: "enrolled" as const,
                name,
                initials,
                action: "Enrolled in a course",
                course: e.course?.title || "Course",
                time: formatRelative(e.enrolled_at),
              };
            }),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { enrollmentTrend, recentActivity, loading };
}
