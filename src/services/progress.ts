import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function getProgressDashboard(studentId: string) {
  const [enrollmentsRes, progressRes, attemptsRes] = await Promise.all([
    supabase
      .from("enrollments")
      .select("*, course:courses(id,title,thumbnail)")
      .eq("student_id", studentId),

    supabase
      .from("topic_progress")
      .select("*, topic:topics(id,title,course:courses(title))")
      .eq("student_id", studentId),

    supabase
      .from("quiz_attempts")
      .select(
        "*, quiz:quizzes(id,title,passing_score,topic:topics(course:courses(title)))",
      )
      .eq("student_id", studentId),
  ]);

  return {
    enrollments: enrollmentsRes.data ?? [],
    topicProgress: progressRes.data ?? [],
    quizAttempts: attemptsRes.data ?? [],
  };
}
