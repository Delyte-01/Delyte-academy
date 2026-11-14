"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/motion";
import { ProgressOverview } from "@/components/dashboard-components/progress/progress-overview";
import { StreakCard } from "@/components/dashboard-components/progress/streak-card";
import { WeeklyGoalCard } from "@/components/dashboard-components/progress/weekly-goal-card";
import { CourseProgressSection } from "@/components/dashboard-components/progress/course-progress-section";
import { ConsistencyHeatmap } from "@/components/dashboard-components/progress/consistency-heatmap";
import { ActivityTimeline } from "@/components/dashboard-components/progress/activity-timeline";
import { QuizAnalyticsCard } from "@/components/dashboard-components/progress/quiz-analytic-card";
import { AchievementsGrid } from "@/components/dashboard-components/progress/achievements-grid";
import { WeakAreasCard } from "@/components/dashboard-components/progress/weak-area-card";
import { useProgressDashboard } from "@/hooks/useProgressDashboard";
import { useAuth } from "@/hooks/useAuth";

function ProgressSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-label="Loading your progress">
      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-72" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <Skeleton className="h-72 rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-64 rounded-xl lg:col-span-2" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const { user, loading: authLoading } = useAuth();

  const {
    loading,
    summary,
    courseProgress,
    recentActivity,
    quizAnalytics,
    weeklyGoal,
    achievements,
    streakData,
    weakAreas,
    raw,
  } = useProgressDashboard(user?.id);

  // Wait for the session too, otherwise an empty first render flashes "No courses yet".
  if (authLoading || loading) return <ProgressSkeleton />;

  const completedAt: string[] = raw.topicProgress
    .filter((t: { completed?: boolean; completed_at?: string | null }) => t.completed && t.completed_at)
    .map((t: { completed_at: string }) => t.completed_at);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 pb-6">
      <PageHeader
        eyebrow="Progress"
        title="Your learning progress"
        description="Courses, quizzes and study habits in one place."
        breadcrumb={
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            <Link href="/dashboard" className="font-semibold transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <ChevronRight className="size-3.5" aria-hidden />
            <span className="font-semibold text-foreground">Progress</span>
          </nav>
        }
      />

      <Reveal on="mount" selector="[data-reveal]" stagger={0.07} className="space-y-6">
        <div data-reveal>
          <ProgressOverview summary={summary} courseCount={courseProgress.length} />
        </div>

        <div data-reveal className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StreakCard data={streakData} />
          </div>
          <WeeklyGoalCard goal={weeklyGoal} />
        </div>

        <div data-reveal className="grid gap-6 lg:grid-cols-3 lg:items-start">
          <div className="lg:col-span-2">
            <CourseProgressSection courses={courseProgress} />
          </div>
          <div className="space-y-6">
            <ConsistencyHeatmap completedAt={completedAt} />
            <ActivityTimeline activities={recentActivity} />
          </div>
        </div>

        <div data-reveal>
          <QuizAnalyticsCard data={quizAnalytics} />
        </div>

        <div data-reveal className="grid gap-6 lg:grid-cols-2">
          <AchievementsGrid achievements={achievements} />
          <WeakAreasCard areas={weakAreas} />
        </div>
      </Reveal>
    </div>
  );
}
