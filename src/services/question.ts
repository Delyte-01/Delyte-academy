import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/constants/database";

import type {
  QuizQuestion,
  CreateQuestionData,
  UpdateQuestionData,
} from "@/types/quiz";
import { QuestionOptionService } from "./question-option";

const supabase = createClient();

async function getQuestions(quizId: string) {
  const { data, error } = await supabase
    .from(TABLES.QUESTIONS)
    .select(
      `
      *,
      options:question_options(*)
    `
    )
    .eq("quiz_id", quizId)
    .order("order_index");

  if (error) throw error;

  return data as QuizQuestion[];
}

async function createQuestion(data: CreateQuestionData) {
  const { data: question, error } = await supabase
    .from(TABLES.QUESTIONS)
    .insert({
      quiz_id: data.quizId,

      question: data.question,

      type: data.type,

      difficulty: data.difficulty,

      points: data.points,

      explanation: data.explanation,

      order_index: data.orderIndex,
    })
    .select()
    .single();

  if (error) throw error;

  return question as QuizQuestion;
}

async function createQuestionWithOptions(data: CreateQuestionData) {
  // create question first
  const created = await createQuestion(data);

  // create all options

  const createdOptions = await QuestionOptionService.createOptions(
    data.options.map((option, index) => ({
      questionId: created.id,
      optionText: option.optionText,
      isCorrect: option.isCorrect,
      orderIndex: index,
    }))
  );
  return {
    ...created,
    options: createdOptions,
  } as QuizQuestion;
}

async function updateQuestion(data: UpdateQuestionData) {
  const { data: question, error } = await supabase
    .from(TABLES.QUESTIONS)
    .update({
      question: data.question,

      type: data.type,

      difficulty: data.difficulty,

      points: data.points,

      explanation: data.explanation,
    })
    .eq("id", data.id)
    .select()
    .single();

  if (error) throw error;

  return question as QuizQuestion;
}

async function updateQuestionWithOptions(data: UpdateQuestionData) {
  const updated = await updateQuestion(data);

  await QuestionOptionService.deleteOptions(data.id);

  const updatedOptions = await QuestionOptionService.createOptions(
    data.options.map((option, index) => ({
      questionId: data.id,
      optionText: option.optionText,
      isCorrect: option.isCorrect,
      orderIndex: index,
    }))
  );

  return {
    ...updated,
    options: updatedOptions,
  } as QuizQuestion;
}

async function deleteQuestion(id: string) {
  const { error } = await supabase.from(TABLES.QUESTIONS).delete().eq("id", id);

  if (error) throw error;
}

export const QuestionService = {
  getQuestions,

  createQuestion,

  updateQuestion,
  createQuestionWithOptions,
  updateQuestionWithOptions,
  deleteQuestion,
};
