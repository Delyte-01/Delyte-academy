export type UserRole = "student" | "admin" | "super_admin";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}
