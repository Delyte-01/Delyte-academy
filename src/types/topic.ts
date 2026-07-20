export type TopicStatus = "draft" | "published";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

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
}

export interface CreateTopicData {
  courseId: string;

  title: string;

  description: string;

  estimatedTime: number;
  difficulty: DifficultyLevel;

  status: TopicStatus;
}

export interface UpdateTopicData extends CreateTopicData {
  id: string;
}
