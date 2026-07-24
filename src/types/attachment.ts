export interface TopicAttachment {
  id: string;

  topic_id: string;

  title: string;

  file_name: string;

  file_url: string;

  file_type: string;

  file_size: number;

  created_at: string;

  updated_at: string;
  description: string;
  category: ResourceCategory;
  mime_type: string;
}

export interface CreateAttachmentData {
  topicId: string;

  courseId: string;

  title: string;
  description: string;
  category: ResourceCategory;
  file: File;
}

export interface UploadAttachmentForm {
  title: string;

  category: ResourceCategory;

  description: string;

  file: File;
}

export const RESOURCE_CATEGORIES = [
  "Lecture Notes",
  "Slides",
  "Assignment",
  "Worksheet",
  "Source Code",
  "Cheat Sheet",
  "Reference Material",
  "Other",
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];
