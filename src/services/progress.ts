import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

/**
 * Read-only snapshot used by the student progress page.
 *
 * Note on the selects: the hook groups topics by `topic.course.id` and quiz
 * attempts by `quiz.topic.id`, so those ids must be selected here.
 */
export async function getProgressDashboard(studentId: string) {
  const [enrollmentsRes, progressRes, attemptsRes] = await Promise.all([
    supabase
      .from("enrollments")
      .select("*, course:courses(id,title,thumbnail)")
      .eq("student_id", studentId),

    supabase
      .from("topic_progress")
      .select("*, topic:topics(id,title,course:courses(id,title))")
      .eq("student_id", studentId),

    supabase
      .from("quiz_attempts")
      .select(
        "*, quiz:quizzes(id,title,passing_score,topic:topics(id,title,course:courses(id,title)))",
      )
      .eq("student_id", studentId),
  ]);

  // `topic_progress` only has rows for topics the student has finished, so the
  // real "out of N" comes from the published topics of the enrolled courses.
  // If this lookup fails the hook falls back to the completed count.
  const courseIds = (enrollmentsRes.data ?? []).map(
    (e: { course_id: string }) => e.course_id,
  );
  let courseTopics: { id: string; course_id: string }[] = [];
  if (courseIds.length > 0) {
    const topicsRes = await supabase
      .from("topics")
      .select("id,course_id")
      .in("course_id", courseIds)
      .eq("status", "published");
    courseTopics = topicsRes.data ?? [];
  }

  return {
    enrollments: enrollmentsRes.data ?? [],
    topicProgress: progressRes.data ?? [],
    quizAttempts: attemptsRes.data ?? [],
    courseTopics,
  };
}
