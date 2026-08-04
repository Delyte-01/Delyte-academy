import { LucideIcon } from "lucide-react";

export interface OverviewStat {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export interface WeeklyGoalData {
  current: number;
  target: number;
  estimatedCompletion: string;
  message: string;
}

export interface CourseProgressItem {
  id: string;
  title: string;
  thumbnail: string | null;
  progress: number;
  completedTopics: number;
  totalTopics: number;
  lastStudied: string;
}
export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}
export interface QuizAnalytics {
  averageScore: number;
  highestScore: number;
  quizzesTaken: number;
  passRate: number;
  trend: { date: string; score: number }[];
  scoreTrend: { date: string; score: number }[];
}

export interface WeeklyGoal {
  targetTopics: number;
  completedTopics: number;
  percentage: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
  target: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export interface StreakDay {
  day: string;
  active: boolean;
  sessions: number;
}

export interface StreakData {
  current: number;
  longest: number;
  weekActivity: StreakDay[];
  message: string;
}

export interface WeakArea {
  id: string;
  topicId: string;
  topic: string;
  course: string;
  score: number;
  icon: LucideIcon;
}