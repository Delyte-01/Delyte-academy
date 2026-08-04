/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { getProgressDashboard } from "@/services/progress";
import type {
  Achievement,
  ActivityItem,
  CourseProgressItem,
  OverviewStat,
  QuizAnalytics,
  StreakData,
  WeakArea,
  WeeklyGoalData,
} from "@/types/progress";
import {
  TrendingUp,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  BookOpen,
  Award,
  Trophy,
  Flame,
  AlertCircle,
} from "lucide-react";

function calculateStreak(topicProgress: any[]): {
  current: number;
  longest: number;
} {
  const completedDates = topicProgress
    .filter((t) => t.completed && t.completed_at)
    .map((t) => new Date(t.completed_at).toDateString());

  const uniqueDates = Array.from(new Set(completedDates))
    .map((d) => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());

  if (uniqueDates.length === 0) {
    return { current: 0, longest: 0 };
  }

  let longest = 1;
  let current = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const diff =
      (uniqueDates[i].getTime() - uniqueDates[i - 1].getTime()) /
      (1000 * 60 * 60 * 24);

    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  // Calculate current streak from today backwards
  let currentStreak = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completedSet = new Set(uniqueDates.map((d) => d.toDateString()));

  const cursor = new Date(today);

  while (completedSet.has(cursor.toDateString())) {
    currentStreak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return {
    current: currentStreak,
    longest,
  };
}

export function useProgressDashboard(studentId?: string) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    enrollments: any[];
    topicProgress: any[];
    quizAttempts: any[];
  }>({
    enrollments: [],
    topicProgress: [],
    quizAttempts: [],
  });

  useEffect(() => {
    if (!studentId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    let mounted = true;

    async function load() {
      try {
        setLoading(true);

        const dashboard = await getProgressDashboard(studentId!);

        if (mounted) setData(dashboard as any);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [studentId]);

  function formatRelative(dateString?: string | null) {
    if (!dateString) return "Recently";

    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();

    const minutes = Math.floor(diffMs / (1000 * 60));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

    const days = Math.floor(hours / 24);

    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    const weeks = Math.floor(days / 7);

    if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;

    return date.toLocaleDateString();
  }

  const overviewStats: OverviewStat[] = useMemo(() => {
    const completedTopics = data.topicProgress.filter(
      (t: any) => t.completed,
    ).length;

    const totalTopics = data.topicProgress.length;

    const quizzesTaken = data.quizAttempts.length;

    const passed = data.quizAttempts.filter((a: any) => {
      const passing = a.quiz?.passing_score ?? 70;

      return a.score >= passing;
    }).length;

    const overall =
      data.enrollments.length === 0
        ? 0
        : Math.round(
            data.enrollments.reduce(
              (sum: number, e: any) => sum + (e.progress ?? 0),
              0,
            ) / data.enrollments.length,
          );

    return [
      {
        id: "overall",
        label: "Overall Progress",
        value: `${overall}%`,
        sublabel: "Across enrolled courses",
        icon: TrendingUp,
        color: "text-emerald-600",
        bgColor: "bg-emerald-500/10",
      },
      {
        id: "topics",
        label: "Topics Completed",
        value: `${completedTopics}/${totalTopics}`,
        sublabel: "Lessons finished",
        icon: CheckCircle2,
        color: "text-blue-600",
        bgColor: "bg-blue-500/10",
      },
      {
        id: "quizzes",
        label: "Quizzes Passed",
        value: `${passed}/${quizzesTaken}`,
        sublabel: "Assessments completed",
        icon: ClipboardCheck,
        color: "text-violet-600",
        bgColor: "bg-violet-500/10",
      },
      {
        id: "study-time",
        label: "Study Time",
        value: "32h 45m",
        sublabel: "This month",
        icon: Clock,
        color: "text-amber-600",
        bgColor: "bg-amber-500/10",
      },
    ];
  }, [data]);

  const courseProgress: CourseProgressItem[] = useMemo(() => {
    return data.enrollments.map((enrollment: any) => {
      const courseId = enrollment.course_id;

      const courseTopics = data.topicProgress.filter(
        (tp: any) => tp.topic?.course?.id === courseId,
      );

      const totalTopics = courseTopics.length;
      const completedTopics = courseTopics.filter(
        (tp: any) => tp.completed,
      ).length;

      const lastCompleted = courseTopics
        .filter((tp: any) => tp.completed_at)
        .sort(
          (a: any, b: any) =>
            new Date(b.completed_at).getTime() -
            new Date(a.completed_at).getTime(),
        )[0] as { completed_at?: string | null } | undefined;

      const lastStudied = lastCompleted?.completed_at
        ? formatRelative(lastCompleted.completed_at)
        : "Not started";

      return {
        id: courseId,
        title: enrollment.course?.title ?? "Course",
        thumbnail: enrollment.course?.thumbnail ?? null,
        progress: enrollment.progress ?? 0,
        completedTopics,
        totalTopics,
        lastStudied,
      };
    });
  }, [data]);

  const recentActivity: ActivityItem[] = useMemo(() => {
    const items: ActivityItem[] = [];

    for (const enrollment of data.enrollments) {
      items.push({
        id: `enroll-${enrollment.id}`,
        title: "Enrolled in a new course",
        detail: enrollment.course?.title ?? "Course",
        time: formatRelative(enrollment.enrolled_at),
        icon: BookOpen,
        color: "text-blue-600",
        bgColor: "bg-blue-500/10",
      });
    }

    for (const tp of data.topicProgress.filter((t: any) => t.completed)) {
      items.push({
        id: `topic-${tp.id}`,
        title: "Completed topic",
        detail: tp.topic?.title ?? "Topic",
        time: formatRelative(tp.completed_at),
        icon: CheckCircle2,
        color: "text-emerald-600",
        bgColor: "bg-emerald-500/10",
        // no extra props
      });
    }

    for (const attempt of data.quizAttempts) {
      items.push({
        id: `quiz-${attempt.id}`,
        title: `Scored ${attempt.score}% on quiz`,
        detail: attempt.quiz?.title ?? "Quiz",
        time: formatRelative(attempt.completed_at),
        icon: ClipboardCheck,
        color: "text-violet-600",
        bgColor: "bg-violet-500/10",
      });
    }

    return items
      .sort((a: any, b: any) => {
        const ta = new Date(a.time).getTime();
        const tb = new Date(b.time).getTime();

        return tb - ta;
      })
      .slice(0, 10);
  }, [data]);

  const quizAnalytics: QuizAnalytics = useMemo(() => {
    const scores = data.quizAttempts.map((q: any) => q.score);

    const averageScore =
      scores.length === 0
        ? 0
        : Math.round(
            scores.reduce((a: number, b: number) => a + b, 0) / scores.length,
          );

    const highestScore = scores.length ? Math.max(...scores) : 0;

    const passRate =
      scores.length === 0
        ? 0
        : Math.round(
            (data.quizAttempts.filter((a: any) => {
              const passing = a.quiz?.passing_score ?? 70;

              return a.score >= passing;
            }).length /
              scores.length) *
              100,
          );

    return {
      averageScore,
      highestScore,
      quizzesTaken: scores.length,
      passRate,
      trend: data.quizAttempts.map((a: any) => ({
        date: a.completed_at,
        score: a.score,
      })),
    };
  }, [data]);

  const weeklyGoal: WeeklyGoalData = useMemo(() => {
    const completedThisWeek = data.topicProgress.filter((t: any) => {
      if (!t.completed || !t.completed_at) return false;

      const completed = new Date(t.completed_at);

      const now = new Date();

      const diff = now.getTime() - completed.getTime();

      return diff <= 7 * 24 * 60 * 60 * 1000;
    }).length;

    return {
      current: completedThisWeek,
      target: 5,
      estimatedCompletion:
        completedThisWeek >= 5 ? "Goal achieved" : "This week",
      message:
        completedThisWeek >= 5
          ? "Amazing work! You completed your weekly goal."
          : completedThisWeek >= 3
            ? "You're close to your weekly goal. Keep going!"
            : "Complete a few more topics to stay on track.",
    };
  }, [data]);

  const streakData: StreakData = useMemo(() => {
    const streak = calculateStreak(data.topicProgress);

    const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const weekActivity = weekLabels.map((day) => ({
      day,
      active: false,
      sessions: 0,
    }));

    // Count completed topics in the last 7 days
    data.topicProgress.forEach((tp: any) => {
      if (!tp.completed || !tp.completed_at) return;

      const d = new Date(tp.completed_at);

      const index = (d.getDay() + 6) % 7; // Monday-first

      weekActivity[index].active = true;
      weekActivity[index].sessions += 1;
    });

    const message =
      streak.current >= 7
        ? "Amazing consistency! You're building a strong learning habit."
        : streak.current >= 3
          ? "Great momentum! Keep your streak alive tomorrow."
          : "Complete a topic today to start a new learning streak.";

    return {
      current: streak.current,
      longest: streak.longest,
      weekActivity,
      message,
    };
  }, [data]);

  const achievements: Achievement[] = useMemo(() => {
    const completedTopics = data.topicProgress.filter(
      (t: any) => t.completed,
    ).length;

    const completedCourses = data.enrollments.filter(
      (e: any) => (e.progress ?? 0) === 100,
    ).length;

    const quizzesPassed = data.quizAttempts.filter((a: any) => {
      const passing = a.quiz?.passing_score ?? 70;

      return a.score >= passing;
    }).length;

    const streak = calculateStreak(data.topicProgress);

    return [
      {
        id: "first-course",
        title: "First Course Completed",
        description: "Complete your first course.",
        unlocked: completedCourses >= 1,
        progress: completedCourses,
        target: 1,
        icon: Trophy,
        color: "text-emerald-600",
        bgColor: "bg-emerald-500/10",
      },
      {
        id: "five-topics",
        title: "5 Topics Completed",
        description: "Complete five learning topics.",
        unlocked: completedTopics >= 5,
        progress: completedTopics,
        target: 5,
        icon: BookOpen,
        color: "text-blue-600",
        bgColor: "bg-blue-500/10",
      },
      {
        id: "quiz-master",
        title: "Quiz Master",
        description: "Pass ten quizzes.",
        unlocked: quizzesPassed >= 10,
        progress: quizzesPassed,
        target: 10,
        icon: ClipboardCheck,
        color: "text-violet-600",
        bgColor: "bg-violet-500/10",
      },
      {
        id: "seven-day-streak",
        title: "7-Day Streak",
        description: "Learn for seven consecutive days.",
        unlocked: streak.current >= 7,
        progress: streak.current,
        target: 7,
        icon: Flame,
        color: "text-orange-600",
        bgColor: "bg-orange-500/10",
      },
      {
        id: "thirty-day-learner",
        title: "30-Day Learner",
        description: "Maintain a 30-day learning streak.",
        unlocked: streak.current >= 30,
        progress: streak.current,
        target: 30,
        icon: Award,
        color: "text-amber-600",
        bgColor: "bg-amber-500/10",
      },
    ];
  }, [data]);

  const weakAreas: WeakArea[] = useMemo(() => {
    const topicMap = new Map<
      string,
      {
        topicId: string;
        topic: string;
        course: string;
        scores: number[];
      }
    >();

    for (const attempt of data.quizAttempts as any[]) {
      const topic = attempt.quiz?.topic;

      if (!topic?.id) continue;

      const existing = topicMap.get(topic.id) ?? {
        topicId: topic.id,
        topic: topic.title ?? "Topic",
        course: topic.course?.title ?? "Course",
        scores: [] as number[],
      };

      existing.scores.push(attempt.score);

      topicMap.set(topic.id, existing);
    }

    return Array.from(topicMap.values())
      .map((item) => ({
        id: item.topicId,
        topicId: item.topicId,
        topic: item.topic,
        course: item.course,
        score: Math.round(
          item.scores.reduce((a, b) => a + b, 0) / item.scores.length,
        ),
        icon: AlertCircle,
      }))
      .filter((item) => item.score < 70)
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);
  }, [data]);

  return {
    loading,
    overviewStats,
    courseProgress,
    recentActivity,
    quizAnalytics,
    weeklyGoal,
    raw: data,
    streakData,
    achievements,
    weakAreas,
  };
}
