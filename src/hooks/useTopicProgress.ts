import { useCallback, useEffect, useState } from "react";

import { topicProgressService } from "@/services/topic-progress";

export function useTopicProgress(studentId?: string, courseId?: string) {
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!studentId || !courseId) {
      setCompletedTopics([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const topics = await topicProgressService.getCompletedTopics(
        studentId,
        courseId,
      );

      setCompletedTopics(topics);
    } finally {
      setLoading(false);
    }
  }, [studentId, courseId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const markComplete = async (topicId: string) => {
    if (!studentId || !courseId) return;

    await topicProgressService.markComplete(studentId, courseId, topicId);

    setCompletedTopics((prev) =>
      prev.includes(topicId) ? prev : [...prev, topicId],
    );
  };

  return {
    completedTopics,
    loading,
    markComplete,
    reload: load,
  };
}
