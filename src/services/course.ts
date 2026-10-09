import { TABLES } from "@/constants/database";
import { createClient } from "@/lib/supabase/client";
import { Course, CreateCourseData, UpdateCourseData } from "@/types/course";
import { notificationService } from "./notification";
import { studentNotificationService } from "./student-notification";

async function createCourse({
  title,
  courseCode,
  description,
  banner,
  thumbnail,
  status,
}: CreateCourseData) {
  const supabase = createClient();

  // Get logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from(TABLES.COURSES)
    .insert({
      title,
      course_code: courseCode,
      description,
      banner: banner,
      thumbnail: thumbnail,
      status,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

async function getCourses() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(TABLES.COURSES)
    .select(
      `
      *,
      creator:profiles!courses_created_by_fkey (
        id,
        full_name,
        email,
        username,
        avatar_url,
        role
      )
    `,
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data;
}

async function getCourseById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(TABLES.COURSES)
    .select(
      `
      *,
      creator:profiles!courses_created_by_fkey (
        id,
        full_name,
        email,
        username,
        avatar_url,
        role
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

async function updateCourse({
  id,
  title,
  courseCode,
  banner,
  thumbnail,
  description,
  status,
}: UpdateCourseData) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(TABLES.COURSES)
    .update({
      title,
      course_code: courseCode,
      banner: banner,
      thumbnail: thumbnail,

      description,
      status,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

async function deleteCourse(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from(TABLES.COURSES).delete().eq("id", id);

  if (error) throw error;
}

async function publishCourse(courseId: string) {
  const supabase = createClient();

  const { data: course, error } = await supabase
    .from("courses")
    .update({ status: "published" })
    .eq("id", courseId)
    .select()
    .single();

  if (error) throw error;

  await notificationService.createAdminNotification({
    type: "course_published",
    title: "Course published",
    message: `${course.title} has been published successfully.`,
    courseId: course.id,
    link: `/admin/courses/${course.id}`,
  });

  await studentNotificationService.notifyEnrolledStudents({
    courseId: course.id,
    type: "course_published",
    title: "Course published",
    message: `${course.title} is now available to study.`,
    link: `/dashboard/courses/${course.id}`,
  });
  return course;
}

async function unpublishCourse(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from(TABLES.COURSES)
    .update({
      status: "draft",
    })
    .eq("id", id);

  if (error) throw error;
}

async function getPublishedCourses() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLES.COURSES)
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Course[];
}

async function searchPublishedCourses(search: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLES.COURSES)
    .select("*")
    .eq("status", "published")
    .or(
      `title.ilike.%${search}%,description.ilike.%${search}%,code.ilike.%${search}%`,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Course[];
}

export const courseService = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  publishCourse,
  unpublishCourse,
  getPublishedCourses,
  searchPublishedCourses,
};
