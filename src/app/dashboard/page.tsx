"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Award, BookOpen, ClipboardCheck, Compass, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/empty-states";
import { Reveal } from "@/components/motion";
import { CourseCardView } from "@/components/dashboard-components/courses/course-card";
import {
  ContinueLearningHero,
  StartLearningHero,
} from "@/components/dashboard-components/dashboard/continue-learning";
import { UpNextQuizzes } from "@/components/dashboard-components/dashboard/up-next-quizzes";
import { RecentActivity } from "@/components/dashboard-components/dashboard/recent-activity";
import {
  GetStartedChecklist,
  SuggestedCourses,
} from "@/components/dashboard-components/dashboard/get-started";

import { useEnrollment } from "@/context/enrollment-context";
import { useProfile } from "@/context/profile-context";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { useTopics } from "@/hooks/useTopic";
import { useTopicProgress } from "@/hooks/useTopicProgress";

const plural = (n: number, one: string, many = `${one}s`): string =>
  `${n} ${n === 1 ? one : many}`;

const MAX_COURSES = 6;

function DashboardSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-[1280px] space-y-8"
      role="status"
      aria-label="Loading your dashboard"
    >
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-72" />
      </div>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <Skeleton className="h-60 w-full rounded-2xl" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { enrollments, loading } = useEnrollment();
  const { upcomingQuizzes, loading: quizzesLoading } = useDashboard();
  const { activities, loading: activityLoading } = useRecentActivity(user?.id);

  const [greeting, setGreeting] = useState("Welcome back");

  // Client-only so server and first client paint match (no hydration mismatch).
  useEffect(() => {
    const hour = new Date().getHours();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.completed).length;
  const activeCourses = enrollments.filter((e) => !e.completed).length;
  const quizCount = upcomingQuizzes.length;
  // A brand-new student: show guidance and real courses instead of rows of zeros.
  const isNewStudent = totalCourses === 0;

  const averageProgress =
    totalCourses === 0
      ? 0
      : Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / totalCourses);

  const completionRate =
    totalCourses === 0 ? 0 : Math.round((completedCourses / totalCourses) * 100);

  // Same rule as before: the unfinished course the student is furthest into.
  const continueCourse = useMemo(
    () =>
      [...enrollments]
        .filter((e) => !e.completed)
        .sort((a, b) => b.progress - a.progress)[0],
    [enrollments],
  );

  // Real "up next" topic for the hero (first topic not yet completed).
  const continueCourseId = continueCourse?.course_id ?? "";
  const { topics } = useTopics(continueCourseId);
  const { completedTopics } = useTopicProgress(user?.id, continueCourseId || undefined);

  const heroTopics = continueCourseId ? topics : [];
  const nextTopic =
    heroTopics.find((t) => !completedTopics.includes(t.id)) ?? null;
  const topicStats =
    heroTopics.length > 0
      ? {
          done: heroTopics.filter((t) => completedTopics.includes(t.id)).length,
          total: heroTopics.length,
        }
      : null;

  const libraryCourses = useMemo(
    () =>
      enrollments
        .filter((e) => e.course?.status === "published")
        .sort((a, b) => Number(a.completed) - Number(b.completed) || b.progress - a.progress),
    [enrollments],
  );

  const displayName = profile?.full_name?.split(" ")[0] || "there";

  const summary =
    totalCourses === 0
      ? "Pick a course to start your learning journey."
      : activeCourses === 0
        ? "You're all caught up. Time to pick your next course?"
        : `${plural(activeCourses, "course")} in progress${
            quizCount > 0 ? ` · ${plural(quizCount, "quiz", "quizzes")} waiting` : ""
          }`;

  if (loading) return <DashboardSkeleton />;

  return (
    <Reveal
      on="mount"
      selector="[data-reveal]"
      stagger={0.08}
      className="mx-auto w-full max-w-[1280px] space-y-8"
    >
      {/* Greeting */}
      <header
        data-reveal
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="min-w-0 space-y-1.5">
          <p className="text-[15px] font-semibold text-muted-foreground">{greeting},</p>
          <h1 className="font-heading text-[32px] font-extrabold leading-tight tracking-tight text-foreground sm:text-[40px]">
            {displayName}
          </h1>
          <p className="text-[15px] text-muted-foreground">{summary}</p>
        </div>
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
          <Link href="/dashboard/courses">
            <Compass />
            Explore courses
          </Link>
        </Button>
      </header>

      {/*
        Two columns on xl. Below xl the column wrappers use `contents`, so the
        blocks interleave in a deliberate mobile order (hero, KPIs, quizzes, courses, activity).
      */}
      <div className="flex flex-col gap-8 xl:grid xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start xl:gap-x-8">
        {/* Main column */}
        <div className="contents xl:flex xl:min-w-0 xl:flex-col xl:gap-8">
          <div data-reveal className="max-xl:order-1">
            {continueCourse ? (
              <ContinueLearningHero
                enrollment={continueCourse}
                nextTopic={nextTopic ? { id: nextTopic.id, title: nextTopic.title } : null}
                topicStats={topicStats}
              />
            ) : (
              <StartLearningHero hasCompleted={completedCourses > 0} />
            )}
          </div>

          <div
            data-reveal
            className={
              isNewStudent
                ? "max-xl:order-2"
                : "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 max-xl:order-2"
            }
          >
            {isNewStudent ? (
              <GetStartedChecklist />
            ) : (
              <>
            <StatCard
              label="Enrolled"
              value={totalCourses}
              icon={BookOpen}
              tone="brand"
              hint={totalCourses === 0 ? "No courses yet" : `${activeCourses} in progress`}
            />
            <StatCard
              label="Completed"
              value={completedCourses}
              icon={Award}
              tone="success"
              hint={totalCourses === 0 ? "Finish one to see it here" : `${completionRate}% of your courses`}
            />
            <StatCard
              label="Avg. progress"
              value={averageProgress}
              suffix="%"
              icon={Target}
              tone="warning"
              progress={averageProgress}
            />
            <StatCard
              label="Quizzes"
              value={quizCount}
              icon={ClipboardCheck}
              tone="info"
              hint={quizCount === 0 ? "Nothing waiting" : "Ready to take"}
            />
              </>
            )}
          </div>

          <section data-reveal aria-labelledby="my-courses" className="max-xl:order-4">
            <SectionHeader
              title={isNewStudent ? "Courses you can join" : "My courses"}
              description={
                libraryCourses.length > 0
                  ? `${plural(libraryCourses.length, "course")} in your library`
                  : undefined
              }
              href="/dashboard/courses"
              actionLabel="Browse all"
            />
            {libraryCourses.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                {libraryCourses.slice(0, MAX_COURSES).map((enrollment) => {
                  const course = enrollment.course!;
                  return (
                    <CourseCardView
                      key={course.id}
                      {...course}
                      isEnrolled
                      progress={enrollment.progress}
                    />
                  );
                })}
              </div>
            ) : isNewStudent ? (
              <SuggestedCourses />
            ) : (
              <EmptyState
                icon={BookOpen}
                title={totalCourses === 0 ? "No courses yet" : "Your courses aren't available yet"}
                description={
                  totalCourses === 0
                    ? "Browse the catalogue and enroll to start learning."
                    : "Courses you enrolled in will appear here once they're published."
                }
                action={
                  <Button asChild variant="brand">
                    <Link href="/dashboard/courses">Browse courses</Link>
                  </Button>
                }
              />
            )}
          </section>
        </div>

        {/* Right rail */}
        <div className="contents xl:flex xl:min-w-0 xl:flex-col xl:gap-8">
          <div data-reveal className="max-xl:order-3">
            <UpNextQuizzes quizzes={upcomingQuizzes} loading={quizzesLoading} />
          </div>
          <div data-reveal className="max-xl:order-5">
            <RecentActivity activities={activities} loading={activityLoading} />
          </div>
        </div>
      </div>
    </Reveal>
  );
}
