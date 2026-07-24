import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { TopicAttachment, CreateAttachmentData } from "@/types/attachment";
import { AttachmentService } from "@/services/attachment";

export function useAttachments(topicId: string) {
  const [attachments, setAttachments] = useState<TopicAttachment[]>([]);

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  const loadAttachments = useCallback(async () => {
    if (!topicId) return;

    setLoading(true);

    try {
      const data = await AttachmentService.getAttachments(topicId);

      setAttachments(data);
    } catch {
      toast.error("Unable to load attachments.");
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAttachments();
  }, [loadAttachments]);

  const uploadAttachment = async (data: CreateAttachmentData) => {
    try {
      setUploading(true);

      const attachment = await AttachmentService.uploadAttachment(data);

      setAttachments((prev) => [...prev, attachment]);

      toast.success("Attachment uploaded.");
    } catch {
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const deleteAttachment = async (attachment: TopicAttachment) => {
    try {
      await AttachmentService.deleteAttachment(attachment);

      setAttachments((prev) =>
        prev.filter((item) => item.id !== attachment.id)
      );

      toast.success("Attachment deleted.");
    } catch {
      toast.error("Delete failed.");
    }
  };

  const renameAttachment = async (id: string, title: string) => {
    try {
      await AttachmentService.renameAttachment(id, title);

      setAttachments((prev) =>
        prev.map((item) => (item.id === id ? { ...item, title } : item))
      );
    } catch {
      toast.error("Rename failed.");
    }
  };

  return {
    attachments,

    loading,

    uploading,

    uploadAttachment,

    deleteAttachment,

    renameAttachment,

    reload: loadAttachments,
  };
}
