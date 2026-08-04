import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import { useEnrollment } from "@/hooks/useEnrollment";
import { courseService } from "@/services/course";
import type { Course } from "@/types/course";
import { getUpcomingQuizzesForStudent } from "@/services/dashboard";

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  averageProgress: number;
}

type UpcomingQuiz =
  Awaited<ReturnType<typeof getUpcomingQuizzesForStudent>> extends Array<
    infer U
  >
    ? U
    : never;

export function useDashboard() {
  const { user } = useAuth();
  const { enrollments, loading: enrollmentLoading } = useEnrollment();

  const [courses, setCourses] = useState<Course[]>([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState<UpcomingQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const published = await courseService.getPublishedCourses();
        setCourses(published);
        if (user?.id) {
          const quizzes = await getUpcomingQuizzesForStudent(user.id);
          setUpcomingQuizzes(quizzes);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const enrolledCourses = courses.filter((course) =>
    enrollments.some((e) => e.course_id === course.id),
  );

  const stats: DashboardStats = {
    totalCourses: enrolledCourses.length,
    completedCourses: enrollments.filter((e) => e.progress === 100).length,
    averageProgress:
      enrollments.length > 0
        ? Math.round(
            enrollments.reduce((sum, e) => sum + e.progress, 0) /
              enrollments.length,
          )
        : 0,
  };

  const continueLearning = enrolledCourses[0] ?? null;

  return {
    loading: loading || enrollmentLoading,
    enrolledCourses,
    continueLearning,
    stats,
    upcomingQuizzes,
  };
}
