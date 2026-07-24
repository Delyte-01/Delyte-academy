import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import type { Topic, UpdateTopicData } from "@/types/topic";
import { TopicService } from "@/services/topic";

export function useTopic(topicId: string) {
  const [topic, setTopic] = useState<Topic | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const loadTopic = useCallback(async () => {
    if (!topicId) return;

    setLoading(true);

    try {
      const data = await TopicService.getTopicById(topicId);

      setTopic(data);
    } catch (error) {
      console.error(error);

      toast.error("Unable to load topic.");
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTopic();
  }, [loadTopic]);

  const updateTopic = async (data: UpdateTopicData) => {
    try {
      setSaving(true);

      const updated = await TopicService.updateTopic(data);

      setTopic(updated);

      toast.success("Topic updated.");

      return updated;
    } catch (error) {
      console.error(error);

      toast.error("Failed to update topic.");

      throw error;
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (status: "draft" | "published") => {
    if (!topic) return;

    try {
      await TopicService.changeStatus(topic.id, status);

      setTopic((prev) => (prev ? { ...prev, status } : prev));

      toast.success(
        status === "published" ? "Topic published." : "Topic moved to draft."
      );
    } catch (error) {
      console.error(error);

      toast.error("Failed to update topic.");
    }
  };

  return {
    topic,

    loading,

    saving,

    updateTopic,

    changeStatus,

    reload: loadTopic,
  };
}
