"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/constants/database";

export interface CourseTableRow {
  id: string;
  title: string;
  status: "Published" | "Draft" | "Archived";
  students: number;
  topics: number;
  quizzes: number;
  updated: string;
}

function formatRelative(date: string) {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return then.toLocaleDateString();
}

export function useAdminCourses() {
  const [courses, setCourses] = useState<CourseTableRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      try {
        setLoading(true);

        const { data: coursesData, error } = await supabase
          .from(TABLES.COURSES)
          .select("id, title, status, updated_at")
          .order("updated_at", { ascending: false })
          .limit(8);

        if (error) throw error;

        const mapped = await Promise.all(
          (coursesData ?? []).map(async (course) => {
            // Count topics
            const { data: topicsData, count: topicsCount } = await supabase
              .from(TABLES.TOPICS)
              .select("id", { count: "exact" })
              .eq("course_id", course.id);

            // Count enrollments
            const { count: enrollmentCount } = await supabase
              .from(TABLES.ENROLLMENTS)
              .select("id", { count: "exact", head: true })
              .eq("course_id", course.id);

            // Count quizzes through topics
            let quizCount = 0;

            if (topicsData && topicsData.length > 0) {
              const topicIds = topicsData.map((t) => t.id);

              const { count } = await supabase
                .from(TABLES.QUIZZES)
                .select("id", { count: "exact", head: true })
                .in("topic_id", topicIds);

              quizCount = count ?? 0;
            }
            const normalizedStatus: CourseTableRow["status"] =
              course.status === "published"
                ? "Published"
                : course.status === "archived"
                  ? "Archived"
                  : "Draft";
            return {
              id: course.id,
              title: course.title,
              status: normalizedStatus,
              students: enrollmentCount ?? 0,
              topics: topicsCount ?? 0,
              quizzes: quizCount,
              updated: formatRelative(course.updated_at),
            };
          }),
        );

        setCourses(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { courses, loading };
}
