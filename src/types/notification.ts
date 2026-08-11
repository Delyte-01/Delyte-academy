export type NotificationType =
  | "announcement"
  | "course_published"
  | "topic_added"
  | "quiz_added"
  | "quiz_result"
  | "course_completed"
  | "enrollment"
  | "system";

export interface Notification {
  id: string;
  recipient_id: string | null;
  recipient_role: "student" | "admin";
  course_id: string | null;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  created_at: string;
}