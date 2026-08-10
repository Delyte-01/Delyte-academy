/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/constants/database";
import { formatRelative } from "./useAdminAnalytics";

export type StudentStatus = "active" | "inactive" | "suspended";

export interface AdminStudent {
  id: string;
  full_name: string;
  username: string;
  email: string;
  avatar_url: string | null;
  role: string;

  // UI fields expected by StudentsTable
  phone: string;
  country: string;
  bio: string;
  initials: string;

  status: StudentStatus;

  enrolledCourses: number;
  completedCourses: number;
  progress: number;
  averageScore: number;
  streak: number;
  lastLoginAt: string;
  lastActive: string;
  created_at: string;
}

export function useAdminStudents() {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [loading, setLoading] = useState(true);

  const updateStudentLocal = (id: string, updates: Partial<AdminStudent>) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, ...updates } : student,
      ),
    );
  };

  const removeStudentLocal = (id: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };



  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      try {
        setLoading(true);

        const { data: profiles, error: profilesError } = await supabase
          .from(TABLES.Profiles)
          .select(
            "id, full_name, username, email, avatar_url, role, created_at, updated_at",
          )
          .eq("role", "student");
        console.log("PROFILES:", profiles);
        console.log("PROFILES ERROR:", profilesError);

        if (profilesError) throw profilesError;

        const ids = (profiles ?? []).map((p) => p.id);

        let enrollmentMap = new Map<
          string,
          { enrolled: number; completed: number; progress: number }
        >();

        if (ids.length) {
          const { data: enrollments } = await supabase
            .from(TABLES.ENROLLMENTS)
            .select("student_id, progress")
            .in("student_id", ids);

          enrollmentMap = new Map();

          (enrollments ?? []).forEach((e: any) => {
            const current = enrollmentMap.get(e.student_id) ?? {
              enrolled: 0,
              completed: 0,
              progress: 0,
            };

            current.enrolled += 1;
            current.progress += e.progress ?? 0;

            if ((e.progress ?? 0) >= 100) {
              current.completed += 1;
            }

            enrollmentMap.set(e.student_id, current);
          });
        }

        let quizMap = new Map<string, number>();

        if (ids.length) {
          const { data: attempts } = await supabase
            .from(TABLES.QUIZ_ATTEMPTS)
            .select("student_id, score")
            .in("student_id", ids);

          const totals = new Map<string, { sum: number; count: number }>();

          (attempts ?? []).forEach((a: any) => {
            const t = totals.get(a.student_id) ?? { sum: 0, count: 0 };
            t.sum += a.score ?? 0;
            t.count += 1;
            totals.set(a.student_id, t);
          });

          quizMap = new Map(
            Array.from(totals.entries()).map(([id, t]) => [
              id,
              t.count ? Math.round(t.sum / t.count) : 0,
            ]),
          );
        }

      const rows: AdminStudent[] = (profiles ?? []).map((p: any) => {
        const enroll = enrollmentMap.get(p.id);

        const name = p.full_name || "Student";

        const initials = name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        return {
          id: p.id,
          full_name: name,
          username: p.username || "student",
          email: p.email || "",
          avatar_url: p.avatar_url,
          role: p.role,

          phone: p.phone || "",
          country: p.country || "",
          bio: p.bio || "",
          initials,

          status: "active",

          enrolledCourses: enroll?.enrolled ?? 0,
          completedCourses: enroll?.completed ?? 0,
          progress: enroll?.enrolled
            ? Math.round((enroll.progress ?? 0) / enroll.enrolled)
            : 0,
          averageScore: quizMap.get(p.id) ?? 0,
          streak: 0,

          lastActive: formatRelative(p.updated_at || p.created_at),
          lastLoginAt: p.updated_at || p.created_at,
          created_at: new Date(p.created_at).toLocaleDateString(),
        };
      });

        setStudents(rows);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { students, loading, updateStudentLocal, removeStudentLocal, };
}
