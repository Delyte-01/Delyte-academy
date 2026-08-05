import type { LucideIcon } from "lucide-react";
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  FileEdit,
  HelpCircle,
  FolderOpen,
  Award,
  HardDrive,
  UserCog,
  Target,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export interface KpiStat {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const kpiStats: KpiStat[] = [
  {
    id: "students",
    label: "Total Students",
    value: "12,480",
    sublabel: "Active learners",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "enrollments",
    label: "Active Enrollments",
    value: "8,920",
    sublabel: "Currently enrolled",
    change: "+8%",
    trend: "up",
    icon: GraduationCap,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "courses",
    label: "Published Courses",
    value: "24",
    sublabel: "6 drafts pending",
    change: "+3",
    trend: "up",
    icon: BookOpen,
    color: "text-violet-600",
    bgColor: "bg-violet-500/10",
  },
  {
    id: "quizzes",
    label: "Quizzes Completed",
    value: "3,640",
    sublabel: "128 completed today",
    change: "+5%",
    trend: "up",
    icon: ClipboardCheck,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
];

export const enrollmentTrend = [
  { day: "Mon", enrollments: 42 },
  { day: "Tue", enrollments: 58 },
  { day: "Wed", enrollments: 35 },
  { day: "Thu", enrollments: 72 },
  { day: "Fri", enrollments: 64 },
  { day: "Sat", enrollments: 48 },
  { day: "Sun", enrollments: 30 },
];

export interface StudentActivity {
  id: string;
  name: string;
  initials: string;
  action: string;
  course: string;
  time: string;
  type: "enrolled" | "quiz" | "topic" | "finished";
}

export const recentActivity: StudentActivity[] = [
  {
    id: "a1",
    name: "Chiamaka Okeke",
    initials: "CO",
    action: "Enrolled in course",
    course: "Advanced Mathematics",
    time: "2 min ago",
    type: "enrolled",
  },
  {
    id: "a2",
    name: "David Adeyemi",
    initials: "DA",
    action: "Completed quiz",
    course: "Java Basics Quiz",
    time: "15 min ago",
    type: "quiz",
  },
  {
    id: "a3",
    name: "Fatima Mohammed",
    initials: "FM",
    action: "Completed topic",
    course: "Variables and Data Types",
    time: "32 min ago",
    type: "topic",
  },
  {
    id: "a4",
    name: "Emeka Nwosu",
    initials: "EN",
    action: "Finished course",
    course: "Web Development Fundamentals",
    time: "1 hour ago",
    type: "finished",
  },
  {
    id: "a5",
    name: "Amara Linus",
    initials: "AL",
    action: "Completed quiz",
    course: "Data Structures Quiz",
    time: "2 hours ago",
    type: "quiz",
  },
];

export interface PendingReview {
  id: string;
  label: string;
  detail: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const pendingReviews: PendingReview[] = [
  {
    id: "p1",
    label: "Draft courses awaiting publication",
    detail: "Physics Fundamentals, Economics 101",
    icon: FileEdit,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
  {
    id: "p2",
    label: "Quizzes with no questions",
    detail: "3 quizzes need questions added",
    icon: HelpCircle,
    color: "text-rose-600",
    bgColor: "bg-rose-500/10",
  },
  {
    id: "p3",
    label: "Topics missing content",
    detail: "5 topics have no content yet",
    icon: FolderOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
];

export interface SystemMetric {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  progress?: number;
}

export const systemMetrics: SystemMetric[] = [
  {
    id: "storage",
    label: "Storage Used",
    value: "4.2 GB / 10 GB",
    icon: HardDrive,
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
    progress: 42,
  },
  {
    id: "instructors",
    label: "Active Instructors",
    value: "18",
    icon: UserCog,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "avg-score",
    label: "Average Quiz Score",
    value: "78.5%",
    icon: Target,
    color: "text-violet-600",
    bgColor: "bg-violet-500/10",
  },
  {
    id: "completion",
    label: "Completion Rate",
    value: "64%",
    icon: Award,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    progress: 64,
  },
];

export interface CourseTableRow {
  id: string;
  title: string;
  category: string;
  status: "Published" | "Draft" | "Archived";
  students: number;
  topics: number;
  quizzes: number;
  updated: string;
}

export const recentCourses: CourseTableRow[] = [
  {
    id: "c1",
    title: "Advanced Mathematics",
    category: "Science",
    status: "Published",
    students: 1240,
    topics: 18,
    quizzes: 12,
    updated: "Aug 2, 2026",
  },
  {
    id: "c2",
    title: "English Language & Lit.",
    category: "Arts",
    status: "Published",
    students: 980,
    topics: 15,
    quizzes: 8,
    updated: "Jul 28, 2026",
  },
  {
    id: "c3",
    title: "Biology & Life Sciences",
    category: "Science",
    status: "Published",
    students: 1560,
    topics: 22,
    quizzes: 14,
    updated: "Jul 24, 2026",
  },
  {
    id: "c4",
    title: "Physics Fundamentals",
    category: "Science",
    status: "Draft",
    students: 0,
    topics: 8,
    quizzes: 3,
    updated: "Jul 20, 2026",
  },
  {
    id: "c5",
    title: "Economics & Commerce",
    category: "Social Science",
    status: "Archived",
    students: 320,
    topics: 12,
    quizzes: 6,
    updated: "Jul 15, 2026",
  },
];
