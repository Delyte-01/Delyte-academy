import { createClient } from "@/lib/supabase/client";
import { uploadService } from "./upload";
import { TABLES } from "@/constants/database";
import type { TopicAttachment, CreateAttachmentData } from "@/types/attachment";

const supabase = createClient();

async function getAttachments(topicId: string) {
  const { data, error } = await supabase
    .from(TABLES.TOPIC_ATTACHMENTS)
    .select("*")
    .eq("topic_id", topicId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data as TopicAttachment[];
}

async function uploadAttachment({
  topicId,
  courseId,
  title,
  file,
  description,
  category,
}: CreateAttachmentData & {
  courseId: string;
}) {
  const fileUrl = await uploadService.uploadImage(
    file,
    "lesson-attachment",
    `${courseId}/${topicId}`
  );
  const { data, error } = await supabase
    .from(TABLES.TOPIC_ATTACHMENTS)
    .insert({
      topic_id: topicId,

      title,

      file_name: file.name,
      description,
      category,

      file_url: fileUrl,

      file_type: file.type,

      file_size: file.size,
      mime_type: file.type,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

async function deleteAttachment(attachment: TopicAttachment) {
  await uploadService.deleteImage(attachment.file_url, "lesson-attachment");
  const { error } = await supabase
    .from(TABLES.TOPIC_ATTACHMENTS)
    .delete()
    .eq("id", attachment.id);

  if (error) throw error;
}

async function renameAttachment(id: string, title: string) {
  const { error } = await supabase
    .from(TABLES.TOPIC_ATTACHMENTS)
    .update({
      title,
    })
    .eq("id", id);

  if (error) throw error;
}

export const AttachmentService = {
  getAttachments,
  uploadAttachment,
  deleteAttachment,
  renameAttachment,
};
