import { TABLES } from "@/constants/database";
import { createClient } from "@/lib/supabase/client";

import { CreateTopicData, Topic, TopicStatus, UpdateTopicData } from "@/types/topic";
import slugify from "slugify";

const supabase = createClient();

async function createTopic({
  title,
  courseId,
  description,
  estimatedTime,
  difficulty,
  status,
  content,
  objectives,
  prerequisites,
  summary,
  video_url,
  external_links,
  attachments,
}: CreateTopicData) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from(TABLES.TOPICS)
    .insert({
      course_id: courseId,
      title,
      slug: slugify(title, {
        lower: true,
        strict: true,
      }),
      description,
      difficulty,
      estimated_time: estimatedTime,
      status,
      content: content ?? "",

      summary: summary ?? "",

      objectives: objectives ?? [],

      prerequisites: prerequisites ?? [],

      video_url: video_url ?? "",

      external_links: external_links ?? [],

      attachments: attachments ?? [],
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

async function getTopicsByCourse(courseId: string) {
  const { data, error } = await supabase
    .from(TABLES.TOPICS)
    .select("*")
    .eq("course_id", courseId)
    .order("order_index");

  if (error) throw error;

  return data;
}

async function getTopicById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(TABLES.TOPICS)
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}
async function updateTopic(data: UpdateTopicData): Promise<Topic> {
  const { data: updatedTopic, error } = await supabase
    .from(TABLES.TOPICS)
    .update({
      title: data.title,
      slug: slugify(data.title, {
        lower: true,
        strict: true,
      }),
      description: data.description,
      estimated_time: data.estimatedTime,
      difficulty: data.difficulty,
      status: data.status,
      introduction: data.introduction,
      content: data.content,
      objectives: data.objectives,
      prerequisites: data.prerequisites,
      summary: data.summary,
      video_url: data.video_url,
      external_links: data.external_links,
      attachments: data.attachments,
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.id)
    .select()
    .single();

  if (error) throw error;

  return updatedTopic;
}
async function deleteTopic(id: string) {
  const { error } = await supabase.from(TABLES.TOPICS).delete().eq("id", id);

  if (error) throw error;
}

async function changeStatus(id: string, status: TopicStatus) {
  const { data, error } = await supabase
    .from(TABLES.TOPICS)
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}
export const TopicService = {
  createTopic,
  getTopicsByCourse,
  getTopicById,
  deleteTopic,
  updateTopic,
  changeStatus,
};
