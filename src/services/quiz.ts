import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/constants/database";

import type { Quiz, CreateQuizData, UpdateQuizData } from "@/types/quiz";

const supabase = createClient();

async function getQuizByTopic(topicId: string) {
  const { data, error } = await supabase
    .from(TABLES.QUIZZES)
    .select("*")
    .eq("topic_id", topicId)
    .single();

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

export const QuizService = {
  getQuizByTopic,

  createQuiz,

  updateQuiz,

  publishQuiz,

  saveDraft,
};
