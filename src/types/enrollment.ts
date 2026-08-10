import { Course } from "./course";

export interface Enrollment {
  id: string;

  student_id: string;

  course_id: string;

  progress: number;

  completed: boolean;

  enrolled_at: string;

  course?: Course;

  profiles?: {
    id: string;
    full_name: string | null;
    email: string | null;
    username?: string | null;
    avatar_url: string | null;
  } | null;
}

export interface EnrollStudentData {
  studentId: string;
  courseId: string;
}