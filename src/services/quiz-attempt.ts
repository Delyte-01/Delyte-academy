import { TABLES } from "@/constants/database";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export interface SubmitQuizAttemptData {
  quizId: string;
  studentId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  attemptNumber: number;
}

export async function submitQuizAttempt(data: SubmitQuizAttemptData) {
  const { data: attempt, error } = await supabase
    .from(TABLES.QUIZ_ATTEMPTS)
    .insert({
      quiz_id: data.quizId,
      student_id: data.studentId,
      score: data.score,
      correct_answers: data.correctAnswers,
      total_questions: data.totalQuestions,
      time_spent: data.timeSpent,
      attempt_number: data.attemptNumber,
    })
    .select()
    .single();

  if (error) throw error;

  return attempt;
}

export async function submitQuizAttemptAnswers(
  attemptId: string,
  answers: {
    questionId: string;
    selectedOptionId: string | null;
    isCorrect: boolean;
  }[],
) {
  if (answers.length === 0) return;

  const { error } = await supabase.from(TABLES.QUIZ_ATTEMPT_ANSWERS).insert(
    answers.map((a) => ({
      attempt_id: attemptId,
      question_id: a.questionId,
      selected_option_id: a.selectedOptionId,
      is_correct: a.isCorrect,
    })),
  );

  if (error) throw error;
}

export async function getQuizAttempt(attemptId: string) {
  const { data, error } = await supabase
    .from(TABLES.QUIZ_ATTEMPTS)
    .select("*, quiz:quizzes(*, topic:topics(*, course:courses(*)))")
    .eq("id", attemptId)
    .single();

  if (error) throw error;

  return data;
}

export async function getQuizAttemptAnswers(attemptId: string) {
  const { data, error } = await supabase
    .from(TABLES.QUIZ_ATTEMPT_ANSWERS)
    .select("*, question:questions(*, options:question_options(*))")
    .eq("attempt_id", attemptId)
    .order("created_at");

  if (error) throw error;

  return data;
}
