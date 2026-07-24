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

async function createOption(data: CreateOptionData) {
  const { data: option, error } = await supabase
    .from(TABLES.QUESTION_OPTIONS)
    .insert({
      question_id: data.questionId,

      option_text: data.optionText,

      is_correct: data.isCorrect,

      order_index: data.orderIndex,
    })
    .select()
    .single();

  if (error) throw error;

  return option as QuizOption;
}

async function createManyOptions(questionId: string, options: QuizOption[]) {
  const rows = options.map((option, index) => ({
    question_id: questionId,

    option_text: option.option_text,

    is_correct: option.is_correct,

    order_index: index + 1,
  }));

  const { error } = await supabase.from(TABLES.QUESTION_OPTIONS).insert(rows);

  if (error) throw error;
}



async function deleteOptions(questionId: string) {
  const { error } = await supabase
    .from(TABLES.QUESTION_OPTIONS)
    .delete()
    .eq("question_id", questionId);

  if (error) throw error;
}


export const OptionService = {
  getOptions,
  createOption,
  createManyOptions,
  deleteOptions,
};