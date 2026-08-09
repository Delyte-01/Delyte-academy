/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/constants/database";
import { CourseStatus } from "@/types/course";

const supabase = createClient();

export interface FeaturedCourse {
  id: string;
  title: string;
  status:CourseStatus;
  description: string | null;
  thumbnail: string | null;
  topicsCount: number;
  quizzesCount: number;
  enrollmentsCount: number;
}

export function useFeaturedCourses(limit = 6) {
  const [courses, setCourses] = useState<FeaturedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from(TABLES.COURSES)
          .select(
            `
            id,
            title,
            description,
            thumbnail,
            topics(count),
           enrollments:enrollments!enrollments_course_id_fkey(id)
          `,
          )
          .eq("status", "published")
          .limit(limit);
        
        console.log("COURSES:", data);
        console.log("COURSES ERROR:", error);

        if (error) throw error;

        const mapped: FeaturedCourse[] = (data ?? []).map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail,
          status: course.status,
          topicsCount: course.topics?.[0]?.count ?? 0,
          quizzesCount: 0, // we'll compute separately below
          enrollmentsCount: course.enrollments?.length ?? 0,
        }));

        // Get quiz counts grouped by course
        const { data: quizzes } = await supabase
          .from(TABLES.QUIZZES)
          .select("id, topic_id, topics(course_id)");

        const quizMap = new Map<string, number>();

        (quizzes ?? []).forEach((q: any) => {
          const courseId = q.topics?.course_id;
          if (!courseId) return;
          quizMap.set(courseId, (quizMap.get(courseId) ?? 0) + 1);
        });

        setCourses(
          mapped.map((course) => ({
            ...course,
            quizzesCount: quizMap.get(course.id) ?? 0,
          })),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [limit]);

  return { courses, loading };
}
