import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Topic } from "@/types/topic";
import { TopicService } from "@/services/topic";

export function useTopics(courseId: string) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTopics = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);

      const data = await TopicService.getTopicsByCourse(courseId);

      setTopics(data);
    } catch (error) {
      console.error(error);

      toast.error("Unable to load topics.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  return {
    topics,
    loading,
    reload: loadTopics,
  };
}
