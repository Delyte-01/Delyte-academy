export type CourseStatus = "draft" | "published";

export interface Course {
  id: string;
  title: string;
  course_code: string;
  description: string;
  status: CourseStatus;
  created_by: string;
  created_at: string;
  updated_at: string;

  banner: string | null;
  thumbnail: string | null;
  creator?: {
    id: string;
    full_name: string | null;
    email: string | null;
    username: string | null;
    avatar_url: string | null;
    role: string;
  };
}

export interface CreateCourseData {
  title: string;
  courseCode: string;
  description: string;
  banner?: string;
  thumbnail?: string;
  status: CourseStatus;
}

export interface UpdateCourseData extends CreateCourseData {
  id: string;
}
