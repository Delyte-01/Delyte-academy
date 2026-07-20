import { useEffect, useState } from "react";
import { Course } from "@/types/course";
import { courseService } from "@/services/course";

export function useCourse(courseId: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseId) return;

    async function loadCourse() {
      try {
        setLoading(true);

        const data = await courseService.getCourseById(courseId);

        setCourse(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [courseId]);

  return {
    course,
    loading,
    error,
    refresh: async () => {
      const data = await courseService.getCourseById(courseId);
      setCourse(data);
    },
  };
}
