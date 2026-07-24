import { useEffect, useState } from "react";

import { QuizService } from "@/services/quiz";

import type { Quiz, UpdateQuizData } from "@/types/quiz";

export function useQuiz(topicId: string) {
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadQuiz = async () => {
    setLoading(true);

    let existing = await QuizService.getQuizByTopic(topicId);

    if (!existing) {
      existing = await QuizService.createQuiz({
        topicId,

        title: "Untitled Quiz",

        description: "",

        instructions: "",

        passingScore: 70,

        timeLimit: 30,

        attemptLimit: 1,

        shuffleQuestions: false,

        shuffleOptions: false,

        showResults: true,

        requirePassingScore: true,

        status: "draft",
      });
    }

    setQuiz(existing);

    setLoading(false);
  };

  const saveQuiz = async (data: UpdateQuizData) => {
    setSaving(true);

    const updated = await QuizService.updateQuiz(data);

    setQuiz(updated);

    setSaving(false);
  };

  return {
    quiz,

    loading,

    saving,

    saveQuiz,

    setQuiz,
  };
}
