import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/constants/database";
import { Enrollment, EnrollStudentData } from "@/types/enrollment";
import { notificationService } from "./notification";

const supabase = createClient();

class EnrollmentService {
  async getStudentCourses(studentId: string): Promise<Enrollment[]> {
    const { data, error } = await supabase
      .from(TABLES.ENROLLMENTS)
      .select(
        `
          *,
          course:courses(*)
        `,
      )
      .eq("student_id", studentId)
      .order("enrolled_at", { ascending: false });

    if (error) throw error;

    return data as Enrollment[];
  }

  async enroll({
    studentId,
    courseId,
  }: EnrollStudentData): Promise<Enrollment> {
    const { data, error } = await supabase
      .from(TABLES.ENROLLMENTS)
      .insert({
        student_id: studentId,
        course_id: courseId,
        progress: 0,
        completed: false,
      })
      .select()
      .single();

    if (error) throw error;


     // Get student and course info for the notification
  const [{ data: profile }, { data: course }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", studentId)
      .single(),
    supabase
      .from("courses")
      .select("title")
      .eq("id", courseId)
      .single(),
  ]);

  const studentName =
    profile?.full_name || profile?.email || "A student";

  await notificationService.createAdminNotification({
    type: "enrollment",
    title: "New student enrolled",
    message: `${studentName} enrolled in ${course?.title ?? "a course"}`,
    courseId,
    link: `/admin/courses/${courseId}`,
  });
    return data as Enrollment;
  }

  async unenroll(id: string) {
    const { error } = await supabase
      .from(TABLES.ENROLLMENTS)
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  async updateProgress(
    enrollmentId: string,
    progress: number,
    completed: boolean,
  ) {
    const { data, error } = await supabase
      .from(TABLES.ENROLLMENTS)
      .update({
        progress,
        completed,
      })
      .eq("id", enrollmentId)
      .select()
      .single();

    if (error) throw error;

    return data as Enrollment;
  }

  async isEnrolled(studentId: string, courseId: string) {
    const { data } = await supabase
      .from(TABLES.ENROLLMENTS)
      .select("id")
      .eq("student_id", studentId)
      .eq("course_id", courseId)
      .maybeSingle();

    return !!data;
  }

  async getCourseEnrollments(courseId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
      *,
      profiles!enrollments_student_profile_fkey(
        id,
        full_name,
        email,
        avatar_url
      )
    `,
      )
      .eq("course_id", courseId);

    if (error) throw error;
    return data;
  }
}

export const enrollmentService = new EnrollmentService();
