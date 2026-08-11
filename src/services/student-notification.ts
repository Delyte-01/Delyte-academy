import { createClient } from "@/lib/supabase/client";
import { Notification } from "@/types/notification";

const supabase = createClient();


async function createStudentNotification({
  studentId,
  type,
  title,
  message,
  courseId,
  link,
}: {
  studentId: string;
  type: Notification["type"];
  title: string;
  message: string;
  courseId?: string | null;
  link?: string | null;
}) {
  const { error } = await supabase.from("notifications").insert({
    recipient_role: "student",
    recipient_id: studentId,
    course_id: courseId ?? null,
    type,
    title,
    message,
    link: link ?? null,
  });

  if (error) throw error;
}

async function notifyEnrolledStudents({
  courseId,
  type,
  title,
  message,
  link,
}: {
  courseId: string;
  type: Notification["type"];
  title: string;
  message: string;
  link?: string | null;
}) {
  const { data: enrollments, error } = await supabase
    .from("enrollments")
    .select("student_id")
    .eq("course_id", courseId);

  if (error) throw error;

  if (!enrollments || enrollments.length === 0) return;

  const rows = enrollments.map((e) => ({
    recipient_role: "student",
    recipient_id: e.student_id,
    course_id: courseId,
    type,
    title,
    message,
    link: link ?? null,
  }));

  const { error: insertError } = await supabase
    .from("notifications")
    .insert(rows);

  if (insertError) throw insertError;
}

async function getStudentNotifications(
  studentId: string,
): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_role", "student")
    .eq("recipient_id", studentId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Notification[];
}

async function getUnreadCount(studentId: string): Promise<number> {
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("recipient_role", "student")
    .eq("recipient_id", studentId)
    .eq("read", false);

  if (error) throw error;
  return count ?? 0;
}

async function markAsRead(id: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id);

  if (error) throw error;
}

async function markAllAsRead(studentId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("recipient_role", "student")
    .eq("recipient_id", studentId)
    .eq("read", false);

  if (error) throw error;
}

export const studentNotificationService = {
  getStudentNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createStudentNotification,
  notifyEnrolledStudents,
};
