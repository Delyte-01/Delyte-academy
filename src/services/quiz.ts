import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/constants/database";

import type { Quiz, CreateQuizData, UpdateQuizData } from "@/types/quiz";
import { notificationService } from "./notification";
import { studentNotificationService } from "./student-notification";

const supabase = createClient();

async function getQuizByTopic(topicId: string) {
  const { data, error } = await supabase
    .from(TABLES.QUIZZES)
    .select("*")
    .eq("topic_id", topicId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") throw error;

  return data as Quiz | null;
}

async function createQuiz(data: CreateQuizData) {
  const { data: quiz, error } = await supabase
    .from(TABLES.QUIZZES)
    .insert({
      topic_id: data.topicId,
      title: data.title,
      description: data.description,
      instructions: data.instructions,
      passing_score: data.passingScore,
      time_limit: data.timeLimit,
      attempt_limit: data.attemptLimit,
      shuffle_questions: data.shuffleQuestions,
      shuffle_options: data.shuffleOptions,
      show_results: data.showResults,
      require_passing_score: data.requirePassingScore,
      status: data.status,
    })
    .select()
    .single();

  if (error) throw error;

  // Create admin notification (do not fail quiz creation if notification fails)
  try {
    const { data: topic } = await supabase
      .from(TABLES.TOPICS)
      .select("title, course_id")
      .eq("id", data.topicId)
      .single();

    await notificationService.createAdminNotification({
      type: "quiz_added",
      title: "New quiz added",
      message: `${quiz.title} was added to ${topic?.title ?? "a topic"}.`,
      courseId: topic?.course_id ?? null,
      link: `/admin/topics/${data.topicId}/quiz`,
    });

    await studentNotificationService.notifyEnrolledStudents({
      courseId: topic?.course_id,
      type: "quiz_added",
      title: "New quiz available",
      message: `${quiz.title} is now available in ${topic?.title}.`,
      link: `/dashboard/courses/${topic?.course_id}`,
    });
  } catch (notificationError) {
    console.error("Failed to create admin notification:", notificationError);
  }

  return quiz as Quiz;
}
async function updateQuiz(data: UpdateQuizData) {
  const { data: quiz, error } = await supabase
    .from(TABLES.QUIZZES)
    .update({
      title: data.title,

      description: data.description,

      instructions: data.instructions,

      passing_score: data.passingScore,

      time_limit: data.timeLimit,

      attempt_limit: data.attemptLimit,

      shuffle_questions: data.shuffleQuestions,

      shuffle_options: data.shuffleOptions,

      show_results: data.showResults,

      require_passing_score: data.requirePassingScore,

      status: data.status,
    })
    .eq("id", data.id)
    .select()
    .single();

  if (error) throw error;

  return quiz as Quiz;
}

async function publishQuiz(id: string) {
  const { error } = await supabase
    .from(TABLES.QUIZZES)
    .update({
      status: "published",
    })
    .eq("id", id);

  if (error) throw error;
}

async function saveDraft(id: string) {
  const { error } = await supabase
    .from(TABLES.QUIZZES)
    .update({
      status: "draft",
    })
    .eq("id", id);

  if (error) throw error;
}

// export async function submitQuizAttempt({
//   quizId,
//   score,
//   totalQuestions,
// }: {
//   quizId: string;
//   score: number;
//   totalQuestions: number;
// }) {
//   const { data: userData } = await supabase.auth.getUser();

//   const { data, error } = await supabase
//     .from(TABLES.QUIZ_ATTEMPTS)
//     .insert({
//       quiz_id: quizId,
//       student_id: userData.user?.id,
//       score,
//       total_questions: totalQuestions,
//       percentage: Math.round((score / totalQuestions) * 100),
//       completed_at: new Date().toISOString(),
//     })
//     .select()
//     .single();

//   if (error) throw error;

//   return data;
// }

export const QuizService = {
  getQuizByTopic,

  createQuiz,

  updateQuiz,

  publishQuiz,

  saveDraft,
};
