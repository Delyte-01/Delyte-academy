export type UserRole = "student" | "admin" | "super_admin";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  role: UserRole;

  username?: string | null;
  phone?: string | null;
  country?: string | null;
  bio?: string | null;
  avatar_url?: string | null;

  theme?: "light" | "dark" | "system";
  language?: string | null;
  autoplay_videos?: boolean;
  math_rendering?: boolean;
  email_notifications?: boolean;
  quiz_reminders?: boolean;

  created_at: string;
  updated_at: string;
}
