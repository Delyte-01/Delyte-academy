export type TopicStatus = "draft" | "published";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface LinkItem {
  title: string;
  url: string;
}

export interface AttachmentItem {
  title: string;
  url: string;
  type: "pdf" | "image" | "file";
}

export interface Topic {
  id: string;

  course_id: string;

  title: string;

  slug: string;

  description: string;
  difficulty: DifficultyLevel;

  order_index: number;

  estimated_time: number;

  status: TopicStatus;

  created_at: string;

  updated_at: string;
  introduction?: string;
  content?: string;

  summary?: string;

  objectives?: string[];

  prerequisites?: string[];

  video_url?: string;

  external_links?: LinkItem[];

  attachments?: AttachmentItem[];
}

export interface CreateTopicData {
  courseId: string;

  title: string;

  description: string;

  estimatedTime: number;
  difficulty: DifficultyLevel;

  status: TopicStatus;
  introduction?: string;

  content?: string;

  summary?: string;

  objectives?: string[];

  prerequisites?: string[];

  video_url?: string;

  external_links?: LinkItem[];

  attachments?: AttachmentItem[];
}

export interface UpdateTopicData extends CreateTopicData {
  id: string;
}

export interface TopicContentFormData {
  introduction: string;

  objectives: string[];

  prerequisites: string[];

  content: string;

  summary: string;

  video_url: string;

  external_links: LinkItem[];

  attachments: AttachmentItem[];
}
