import { createClient } from "@/lib/supabase/client";

import { TABLES } from "@/constants/database";

import type { QuizOption, CreateOptionData } from "@/types/quiz";

const supabase = createClient();


async function getOptions(questionId: string) {
  const { data, error } = await supabase
    .from(TABLES.QUESTION_OPTIONS)
    .select("*")
    .eq("question_id", questionId)
    .order("order_index");

  if (error) throw error;

  return data as QuizOption[];
}


async function createOptions(options: CreateOptionData[]) {
  const { data, error } = await supabase
    .from(TABLES.QUESTION_OPTIONS)
    .insert(
      options.map((option) => ({
        question_id: option.questionId,

        option_text: option.optionText,

        is_correct: option.isCorrect,

        order_index: option.orderIndex,
      }))
    )
    .select();

  if (error) throw error;

  return data as QuizOption[];
}




async function deleteOptions(questionId: string) {
  const { error } = await supabase
    .from(TABLES.QUESTION_OPTIONS)
    .delete()
    .eq("question_id", questionId);

  if (error) throw error;
}

export const QuestionOptionService = {
  createOptions,
  getOptions,
  deleteOptions,
};
