import { useEffect, useState } from "react";
import { QuizService } from "@/services/quiz";
import type { Quiz, UpdateQuizData } from "@/types/quiz";

interface UseQuizOptions {
  createIfMissing?: boolean;
}

export function useQuiz(topicId: string, options: UseQuizOptions = {}) {
  const { createIfMissing = false } = options;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!topicId) return;
    // eslint-disable-next-line react-hooks/immutability
    loadQuiz();
  }, [topicId]);

  const loadQuiz = async () => {
    setLoading(true);
    try {
      let existing = await QuizService.getQuizByTopic(topicId);
      console.log("Quiz from Supabase:", existing);

      if (!existing && createIfMissing) {
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
    } catch (error) {
      console.error("Failed to load quiz:", error);
      setQuiz(null);
    } finally {
      setLoading(false);
    }

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
    reload: loadQuiz,
  };
}
