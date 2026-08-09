/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { TABLES } from "@/constants/database";
import { formatRelative, StudentActivity } from "./useAdminAnalytics";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function useCourseActivity(courseId: string) {
  const [activity, setActivity] = useState<StudentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      try {
        setLoading(true);

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
          .eq("course_id", courseId)
          .order("enrolled_at", { ascending: false })
          .limit(10);

        if (error) throw error;

        const studentIds = [
          ...new Set((enrollments ?? []).map((e: any) => e.student_id)),
        ];

        let profileMap = new Map();

        if (studentIds.length) {
          const { data: profiles } = await supabase
            .from(TABLES.Profiles)
            .select("id, full_name, email, avatar_url")
            .in("id", studentIds);

          profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
        }

        setActivity(
          (enrollments ?? []).map((e: any) => {
            const student = profileMap.get(e.student_id);

            const name =
              student?.full_name || student?.email?.split("@")[0] || "Student";

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
              action: "Enrolled in this course",
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

    if (courseId) load();
  }, [courseId]);

  return { activity, loading };
}
