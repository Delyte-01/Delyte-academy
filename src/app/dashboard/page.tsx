"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Award,
  Target,
  ArrowRight,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard-components/dashboard/stats-card";
import { useEnrollment } from "@/hooks/useEnrollment";
import { useAuth } from "@/hooks/useAuth";
import { CourseCard } from "@/components/dashboard-components/courses/course-card";
import FullPageLoader from "@/components/loading/Loading";
import { useDashboard } from "@/hooks/useDashboard";
import { ContinueLearningHero } from "@/components/dashboard-components/dashboard/continue-learning";
import { useProfile } from "@/context/profile-context";
import { useRecentActivity } from "@/hooks/useRecentActivity";

const ACTIVITY_COLLAPSED_COUNT = 5;

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const plural = (n: number, one: string, many = `${one}s`): string =>
  `${n} ${n === 1 ? one : many}`;

const activityMeta = {
  enrollment: {
    icon: BookOpen,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  topic_completed: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  quiz_completed: {
    icon: ClipboardCheck,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
};

/** Consistent section title with an optional count and action link. */
function SectionHeader({
  title,
  subtitle,
  href,
  actionLabel = "View all",
}: {
  title: string;
  subtitle?: string;
  href?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {href && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="shrink-0 rounded-full text-xs text-muted-foreground hover:text-foreground"
        >
          <Link href={href}>
            {actionLabel}
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { profile } = useProfile();

  const { activities, loading: activityLoading } = useRecentActivity(user?.id);
  const { enrollments, loading } = useEnrollment(user?.id ?? "");
  const { upcomingQuizzes } = useDashboard();

  const [greeting, setGreeting] = useState("Welcome back");
  const [activitiesExpanded, setActivitiesExpanded] = useState(false);

  // Computed client-side only, so the server-rendered markup and first paint
  // stay identical (avoids a hydration mismatch from the visitor's clock).
  useEffect(() => {
    const hour = new Date().getHours();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const publishedCourses = useMemo(
    () => enrollments.filter((e) => e.course?.status === "published"),
    [enrollments],
  );

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.completed).length;
  const activeCourses = enrollments.filter((e) => !e.completed).length;
  const quizCount = upcomingQuizzes.length;

  const averageProgress =
    totalCourses === 0
      ? 0
      : Math.round(
          enrollments.reduce((sum, e) => sum + e.progress, 0) / totalCourses,
        );

  const completionRate =
    totalCourses === 0
      ? 0
      : Math.round((completedCourses / totalCourses) * 100);

  const continueCourse = enrollments
    .filter((e) => !e.completed)
    .sort((a, b) => b.progress - a.progress)[0];

  const displayName = profile?.full_name || "Student";

  const summary =
    totalCourses === 0
      ? "Pick a course below to start your learning journey."
      : activeCourses === 0
        ? "You're all caught up. Time to pick your next course?"
        : `${plural(activeCourses, "course")} in progress${
            quizCount > 0
              ? ` · ${plural(quizCount, "quiz", "quizzes")} waiting for you`
              : ""
          }`;

  const visibleActivities = activitiesExpanded
    ? activities
    : activities.slice(0, ACTIVITY_COLLAPSED_COUNT);
  const hasMoreActivities = activities.length > ACTIVITY_COLLAPSED_COUNT;

  // --- Entrance animation (runs once, as soon as the page content exists) ---
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  useGSAP(
    () => {
      if (loading || hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      if (prefersReducedMotion()) return;

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
      });

      tl.from("[data-reveal]", {
        y: 14,
        opacity: 0,
        duration: 0.45,
        stagger: 0.08,
      });

      tl.from(
        "[data-reveal-group] > *",
        {
          y: 12,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
        },
        "-=0.35",
      );
    },
    { scope: containerRef, dependencies: [loading] },
  );

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-[1400px] space-y-8">
      {/* Header */}
      <header
        data-reveal
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {greeting},
          </p>
          <h1 className="mt-0.5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {displayName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{summary}</p>
        </div>
        <Button asChild className="w-full rounded-full sm:w-auto">
          <Link href="/dashboard/courses">
            <Compass className="mr-2 h-4 w-4" />
            Explore courses
          </Link>
        </Button>
      </header>

      {/* Stats */}
      <div
        data-reveal-group
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
      >
        <StatCard
          label="Enrolled"
          value={totalCourses}
          subtitle={
            totalCourses === 0
              ? "No courses yet"
              : `${activeCourses} in progress`
          }
          icon={BookOpen}
          tone="blue"
        />
        <StatCard
          label="Completed"
          value={completedCourses}
          subtitle={
            totalCourses === 0
              ? "Finish a course to see it here"
              : `${completionRate}% of your courses`
          }
          icon={Award}
          tone="emerald"
        />
        <StatCard
          label="Average progress"
          value={`${averageProgress}%`}
          subtitle="Across all courses"
          icon={Target}
          tone="amber"
          progress={averageProgress}
        />
        <StatCard
          label="Quizzes waiting"
          value={quizCount}
          subtitle={quizCount === 0 ? "Nothing due right now" : "Ready to take"}
          icon={ClipboardCheck}
          tone="violet"
        />
      </div>

      {/* Main layout: content + right rail */}
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
        {/* Left column */}
        <div className="min-w-0 space-y-8">
          {continueCourse && (
            <div data-reveal>
              <ContinueLearningHero enrollment={continueCourse} />
            </div>
          )}

          <section>
            <div data-reveal>
              <SectionHeader
                title="My courses"
                subtitle={
                  publishedCourses.length > 0
                    ? plural(publishedCourses.length, "course") +
                      " in your library"
                    : undefined
                }
                href="/dashboard/courses"
              />
            </div>

            {publishedCourses.length > 0 ? (
              <div
                data-reveal-group
                className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3"
              >
                {publishedCourses.map((enrollment) => {
                  const course = enrollment.course!;
                  return <CourseCard key={course.id} {...course} />;
                })}
              </div>
            ) : (
              <div
                data-reveal
                className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {totalCourses === 0
                    ? "No courses enrolled yet"
                    : "Your courses aren't available yet"}
                </h3>
                <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
                  {totalCourses === 0
                    ? "Browse the catalog and start learning something new today."
                    : "Courses you enrolled in will appear here once they're published."}
                </p>
                <Button asChild className="mt-5 rounded-full">
                  <Link href="/dashboard/courses">Browse courses</Link>
                </Button>
              </div>
            )}
          </section>
        </div>

        {/* Right rail */}
        <aside className="min-w-0 space-y-6">
          {/* Upcoming quizzes */}
          <Card
            data-reveal
            className="gap-0 overflow-hidden rounded-2xl border-border/60 py-0 shadow-sm"
          >
            <div className="flex items-center justify-between px-5 pb-3 pt-5">
              <h2 className="text-base font-semibold text-foreground">
                Upcoming quizzes
              </h2>
              {quizCount > 0 && (
                <Badge  className="rounded-full">
                  {quizCount}
                </Badge>
              )}
            </div>

            <div className="px-3 pb-3 sm:px-4 sm:pb-4">
              {quizCount === 0 ? (
                <div className="rounded-xl bg-muted/40 px-4 py-8 text-center">
                  <ClipboardCheck className="mx-auto h-6 w-6 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No quizzes available right now.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {upcomingQuizzes.slice(0, 5).map((quiz) => (
                    <li
                      key={quiz.id}
                      className="group flex items-center gap-3 rounded-xl border border-border/60 p-3 transition-colors duration-200 hover:border-violet-500/30 hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                        <ClipboardCheck className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {quiz.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {quiz.course}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            Pass {quiz.passingScore}%
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {quiz.timeLimit} min
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        asChild
                        className="shrink-0 rounded-full transition-transform duration-150 active:scale-95"
                      >
                        <Link href={`/dashboard/topics/${quiz.topicId}/quiz`}>
                          Start
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          {/* Recent activity */}
          <Card
            data-reveal
            className="gap-0 overflow-hidden rounded-2xl border-border/60 py-0 shadow-sm"
          >
            <div className="px-5 pb-3 pt-5">
              <h2 className="text-base font-semibold text-foreground">
                Recent activity
              </h2>
            </div>

            <div className="px-5 pb-4">
              {activityLoading ? (
                <p className="py-4 text-sm text-muted-foreground">
                  Loading activity...
                </p>
              ) : activities.length === 0 ? (
                <div className="rounded-xl bg-muted/40 px-4 py-8 text-center">
                  <BookOpen className="mx-auto h-6 w-6 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No recent activity yet.
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className={cn(
                      "relative",
                      activitiesExpanded &&
                        "max-h-[420px] overflow-y-auto pr-1",
                    )}
                  >
                    <ul>
                      {visibleActivities.map((activity, idx) => {
                        const meta =
                          activityMeta[activity.type] ??
                          activityMeta.enrollment;
                        const Icon = meta.icon;

                        return (
                          <li
                            key={activity.id}
                            className="relative flex min-w-0 gap-3 pb-5 last:pb-0"
                          >
                            {idx < visibleActivities.length - 1 && (
                              <span
                                aria-hidden="true"
                                className="absolute bottom-0 left-[17px] top-9 w-px bg-border"
                              />
                            )}
                            <div
                              className={cn(
                                "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                                meta.bg,
                              )}
                            >
                              <Icon className={cn("h-4 w-4", meta.color)} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="break-words text-sm font-medium text-foreground">
                                {activity.text}
                              </p>
                              <p className="break-words text-xs text-muted-foreground">
                                {activity.course}
                              </p>
                              <p className="mt-0.5 text-[11px] text-muted-foreground/80">
                                {activity.time}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    {activitiesExpanded && (
                      <div className="pointer-events-none sticky bottom-0 left-0 h-6 w-full bg-gradient-to-t from-card to-transparent" />
                    )}
                  </div>

                  {hasMoreActivities && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3 w-full rounded-full text-xs text-muted-foreground"
                      onClick={() => setActivitiesExpanded((v) => !v)}
                      aria-expanded={activitiesExpanded}
                    >
                      {activitiesExpanded ? (
                        <>
                          Show less
                          <ChevronUp className="ml-1 h-3.5 w-3.5" />
                        </>
                      ) : (
                        <>
                          View all {activities.length} activities
                          <ChevronDown className="ml-1 h-3.5 w-3.5" />
                        </>
                      )}
                    </Button>
                  )}
                </>
              )}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
