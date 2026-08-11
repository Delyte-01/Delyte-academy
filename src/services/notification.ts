import { createClient } from "@/lib/supabase/client";
import { Notification, NotificationType } from "@/types/notification";

const supabase = createClient();


async function getAdminNotifications(limit = 10): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_role", "admin")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Notification[];
}

async function getUnreadAdminCount(): Promise<number> {
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("recipient_role", "admin")
    .eq("read", false);

  if (error) throw error;
  return count ?? 0;
}

async function markAdminNotificationRead(id: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id);

  if (error) throw error;
}

async function markAllAdminNotificationsRead() {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("recipient_role", "admin")
    .eq("read", false);

  if (error) throw error;
}

async function createAdminNotification(params: {
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  courseId?: string | null;
}) {
  console.log("Creating admin notification:", params);

  const { error } = await supabase.from("notifications").insert({
    recipient_role: "admin",
    recipient_id: null,
    course_id: params.courseId ?? null,
    type: params.type,
    title: params.title,
    message: params.message,
    link: params.link ?? null,
  });

  if (error) throw error;
}

export const notificationService = {
  getAdminNotifications,
  getUnreadAdminCount,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  createAdminNotification,
};
