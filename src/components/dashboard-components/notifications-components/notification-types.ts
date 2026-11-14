import { Notification, NotificationType } from "@/types/notification";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FileText,
  ClipboardList,
  Trophy,
  Medal,
  Megaphone,
  Bell,
} from "lucide-react";

export type NotificationFilter =
  | "all"
  | "unread"
  | "courses"
  | "quizzes"
  | "announcements"
  | "results";

export interface NotificationTypeMeta {
  icon: LucideIcon;
  label: string;
  accent: string;
  bg: string;
}

export const notificationTypeMeta: Record<
  NotificationType,
  NotificationTypeMeta
> = {
  course_published: {
    icon: BookOpen,
    label: "New Course",
    accent: "text-success",
    bg: "bg-success/10",
  },

  topic_added: {
    icon: FileText,
    label: "New Topic",
    accent: "text-info",
    bg: "bg-info/10",
  },

  quiz_added: {
    icon: ClipboardList,
    label: "New Quiz",
    accent: "text-warning",
    bg: "bg-warning/10",
  },

  quiz_result: {
    icon: Trophy,
    label: "Quiz Result",
    accent: "text-success",
    bg: "bg-success/10",
  },

  course_completed: {
    icon: Medal,
    label: "Course Completed",
    accent: "text-primary",
    bg: "bg-primary/10",
  },

  announcement: {
    icon: Megaphone,
    label: "Announcement",
    accent: "text-muted-foreground",
    bg: "bg-muted-foreground/10",
  },

  enrollment: {
    icon: BookOpen,
    label: "Enrollment",
    accent: "text-success",
    bg: "bg-success/10",
  },

  system: {
    icon: Bell,
    label: "System",
    accent: "text-muted-foreground",
    bg: "bg-muted-foreground/10",
  },
};

export const filterConfig: { value: NotificationFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "courses", label: "Courses" },
  { value: "quizzes", label: "Quizzes" },
  { value: "announcements", label: "Announcements" },
  { value: "results", label: "Results" },
];

const DAY = 24 * 60 * 60 * 1000;

export function formatRelativeTime(dateString: string): string {
  const timestamp = new Date(dateString).getTime();
  const diff = Date.now() - timestamp;

  if (diff < 60 * 1000) return "Just now";
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m ago`;
  if (diff < 2 * 60 * 60 * 1000) return "1h ago";
  if (diff < DAY) return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
  if (diff < 2 * DAY) return "Yesterday";
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)}d ago`;

  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export type NotificationGroup = {
  label: string;
  items: Notification[];
};

export function groupNotifications(items: Notification[]): NotificationGroup[] {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfYesterday = new Date(startOfToday.getTime() - DAY);

  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const earlier: Notification[] = [];

  items.forEach((item) => {
    const created = new Date(item.created_at);

    if (created >= startOfToday) today.push(item);
    else if (created >= startOfYesterday) yesterday.push(item);
    else earlier.push(item);
  });

  const groups: NotificationGroup[] = [];

  if (today.length) groups.push({ label: "Today", items: today });
  if (yesterday.length) groups.push({ label: "Yesterday", items: yesterday });
  if (earlier.length) groups.push({ label: "Earlier", items: earlier });

  return groups;
}

export function filterNotifications(
  items: Notification[],
  filter: NotificationFilter,
): Notification[] {
  switch (filter) {
    case "unread":
      return items.filter((n) => !n.read);

    case "courses":
      return items.filter(
        (n) =>
          n.type === "course_published" ||
          n.type === "topic_added" ||
          n.type === "course_completed",
      );

    case "quizzes":
      return items.filter((n) => n.type === "quiz_added");

    case "announcements":
      return items.filter((n) => n.type === "announcement");

    case "results":
      return items.filter((n) => n.type === "quiz_result");

    default:
      return items;
  }
}
