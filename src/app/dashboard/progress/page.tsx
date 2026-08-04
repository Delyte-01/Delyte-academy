"use client";

import Link from "next/link";
import { ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

import { OverviewStats } from "@/components/dashboard-components/progress/overview-stats";
import { StreakCard } from "@/components/dashboard-components/progress/streak-card";
import { CourseProgressSection } from "@/components/dashboard-components/progress/course-progress-section";
import { ActivityTimeline } from "@/components/dashboard-components/progress/activity-timeline";
import { QuizAnalyticsCard } from "@/components/dashboard-components/progress/quiz-analytic-card";
import { ConsistencyHeatmap } from "@/components/dashboard-components/progress/consistency-heatmap";
import { AchievementsGrid } from "@/components/dashboard-components/progress/achievements-grid";
import { WeakAreasCard } from "@/components/dashboard-components/progress/weak-area-card";

import { WeeklyGoalCard } from "@/components/dashboard-components/progress/weekly-goal-card";
import { useProgressDashboard } from "@/hooks/useProgressDashboard";
import { useAuth } from "@/hooks/useAuth";

export default function ProgressPage() {
  const { user } = useAuth();

  const {
    overviewStats,
    courseProgress,
    recentActivity,
    quizAnalytics,
    weeklyGoal,
    achievements,
    streakData,
    weakAreas,
  } = useProgressDashboard(user?.id);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/dashboard"
          className="font-medium transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">Learning Progress</span>
      </div>

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Learning Progress
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your courses, quizzes, and study consistency.
          </p>
        </div>
      </div>

      {/* Overview stats */}
      <OverviewStats stats={overviewStats} />

      {/* Streak + Weekly goal */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StreakCard data={streakData} />
        </div>
        <div>
          <WeeklyGoalCard goal={weeklyGoal} />
        </div>
      </div>

      {/* Course progress + Activity timeline */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CourseProgressSection courses={courseProgress} />
        </div>
        <div>
          <ActivityTimeline activities={recentActivity} />
        </div>
      </div>

      {/* Quiz analytics */}
      <QuizAnalyticsCard data={quizAnalytics} />

      {/* Consistency heatmap */}
      <ConsistencyHeatmap />

      {/* Achievements */}
      <AchievementsGrid achievements={achievements} />

      {/* Weak areas */}
      <WeakAreasCard areas={weakAreas} />
    </div>
  );
}
