import { TABLES } from "@/constants/database";
import { createClient } from "@/lib/supabase/client";
import { CreateCourseData, UpdateCourseData } from "@/types/course";

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
    .select("*")
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
    .select("*")
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

async function publishCourse(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from(TABLES.COURSES)
    .update({
      status: "published",
    })
    .eq("id", id);

  if (error) throw error;
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

export const courseService = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  publishCourse,
  unpublishCourse,
};
