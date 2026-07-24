import { useEffect, useState } from "react";

import { QuestionService } from "@/services/question";

import type {
  QuizQuestion,
  CreateQuestionData,
  UpdateQuestionData,
} from "@/types/quiz";

export function useQuestion(quizId?: string) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
      if (!quizId) return;
    // eslint-disable-next-line react-hooks/immutability
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  const loadQuestions = async () => {
    if (!quizId) return;
    setLoading(true);

    const data = await QuestionService.getQuestions(quizId);

    setQuestions(data);

    setLoading(false);
  };

  const addQuestion = async (data: CreateQuestionData) => {
    setSaving(true);

    const created = await QuestionService.createQuestionWithOptions(data);

    setQuestions((prev) => [...prev, created]);

    setSaving(false);

    return created;
  };

  const editQuestion = async (data: UpdateQuestionData) => {
    setSaving(true);

    const updated = await QuestionService.updateQuestionWithOptions(data);

    setQuestions((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q))
    );

    setSaving(false);

    return updated;
  };

  const removeQuestion = async (id: string) => {
    await QuestionService.deleteQuestion(id);

    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return {
    questions,

    loading,

    saving,

    addQuestion,

    editQuestion,

    removeQuestion,
  };
}
