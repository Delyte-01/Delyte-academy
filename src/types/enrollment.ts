import { Course } from "./course";

export interface Enrollment {
  id: string;

  student_id: string;

  course_id: string;

  progress: number;

  completed: boolean;

  enrolled_at: string;

  course?: Course;
}

export interface EnrollStudentData {
  studentId: string;
  courseId: string;
}