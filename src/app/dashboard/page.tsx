"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Award,
  Target,
  ArrowRight,

  Star,

  ClipboardCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import gsap from "gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard-components/dashboard/stats-card";
import { useEnrollment } from "@/hooks/useEnrollment";
import { useAuth } from "@/hooks/useAuth";
import { CourseCard } from "@/components/dashboard-components/courses/course-card";
import FullPageLoader from "@/components/loading/Loading";
import { useDashboard } from "@/hooks/useDashboard";
import { ContinueLearningHero } from "@/components/dashboard-components/dashboard/continue-learning";
import { useProfile } from "@/context/profile-context";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { useGSAP } from "@gsap/react";

const recommendedCourses = [
  {
    id: "rec-1",
    title: "Python for Beginners",
    instructor: "Dr. Alan Smith",
    image:
      "https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.9,
    students: 2100,
  },
  {
    id: "rec-2",
    title: "Data Structures & Algorithms",
    instructor: "Prof. Rita Patel",
    image:
      "https://images.pexels.com/photos/270557/pexels-photo-270557.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.8,
    students: 1800,
  },
  {
    id: "rec-3",
    title: "Web Development Bootcamp",
    instructor: "Mr. Kevin Lee",
    image:
      "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.7,
    students: 3200,
  },
  {
    id: "rec-4",
    title: "Machine Learning Basics",
    instructor: "Dr. Sophia Chen",
    image:
      "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.9,
    students: 2500,
  },
];

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Small heading with a colored accent bar — used to keep section headers consistent. */
function SectionHeading({ title, badge }: { title: string; badge?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-5 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      {badge && <Badge className="text-xs">{badge}</Badge>}
    </div>
  );
}

const activityMeta = {
  enrollment: {
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-500/10",
  },
  topic_completed: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
  quiz_completed: {
    icon: ClipboardCheck,
    color: "text-violet-600",
    bg: "bg-violet-500/10",
  },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { profile } = useProfile();
  console.log(profile)

  const { activities, loading: activityLoading } = useRecentActivity(user?.id);
  const { enrollments, loading } = useEnrollment(user?.id ?? "");
  const { upcomingQuizzes } = useDashboard();

  const [greeting, setGreeting] = useState("Welcome back");

  const ACTIVITY_COLLAPSED_COUNT = 5;

  // inside component:
  const [activitiesExpanded, setActivitiesExpanded] = useState(false);

  const visibleActivities = activitiesExpanded
    ? activities
    : activities.slice(0, ACTIVITY_COLLAPSED_COUNT);
  const hasMoreActivities = activities.length > ACTIVITY_COLLAPSED_COUNT;

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

  const averageProgress =
    enrollments.length === 0
      ? 0
      : Math.round(
          enrollments.reduce((sum, e) => sum + e.progress, 0) /
            enrollments.length,
        );

  const activeCourses = enrollments.filter((e) => !e.completed).length;

  const continueCourse = enrollments
    .filter((e) => !e.completed)
    .sort((a, b) => b.progress - a.progress)[0];

  // const displayName = user?.user_metadata?.full_name ?? "Student";

  const displayName = profile?.full_name || "Student";

  // --- Animation refs (typed, no `any`) ---
  const statsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroBarRef = useRef<HTMLDivElement>(null);
  const heroPercentRef = useRef<HTMLSpanElement>(null);
  const coursesGridRef = useRef<HTMLDivElement>(null);
  const activityRef = useRef<HTMLDivElement>(null);
  const quizzesRef = useRef<HTMLDivElement>(null);
  const recommendedRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  useGSAP(
    () => {
      if (loading || hasAnimatedRef.current || activityLoading) return;

      hasAnimatedRef.current = true;

      gsap.killTweensOf([
        statsRef.current?.children,
        heroRef.current,
        heroBarRef.current,
        coursesGridRef.current?.children,
        activityRef.current?.children,
        quizzesRef.current?.children,
        recommendedRef.current?.children,
      ]);

      if (prefersReducedMotion()) {
        if (heroBarRef.current && continueCourse) {
          heroBarRef.current.style.width = `${continueCourse.progress}%`;
        }
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.from(statsRef.current?.children ?? [], {
        y: 16,
        opacity: 0,
        duration: 0.45,
        stagger: 0.08,
        clearProps: "opacity,transform",
      });

      tl.from(
        heroRef.current,
        {
          y: 18,
          opacity: 0,
          duration: 0.5,
          clearProps: "opacity,transform",
        },
        "-=0.25",
      );

      if (heroBarRef.current && continueCourse) {
        tl.fromTo(
          heroBarRef.current,
          { width: "0%" },
          {
            width: `${continueCourse.progress}%`,
            duration: 0.9,
            ease: "power2.out",
          },
          "-=0.2",
        );

        const counter = { val: 0 };

        tl.to(
          counter,
          {
            val: continueCourse.progress,
            duration: 0.9,
            ease: "power2.out",
            onUpdate: () => {
              if (heroPercentRef.current) {
                heroPercentRef.current.textContent = `${Math.round(counter.val)}%`;
              }
            },
          },
          "<",
        );
      }

      tl.from(
        coursesGridRef.current?.children ?? [],
        {
          y: 14,
          opacity: 0,
          duration: 0.4,
          stagger: 0.06,
          clearProps: "opacity,transform",
        },
        "-=0.3",
      );

      tl.from(
        activityRef.current?.children ?? [],
        {
          x: -10,
          opacity: 0,
          duration: 0.35,
          stagger: 0.05,
          clearProps: "opacity,transform",
        },
        "-=0.3",
      );

      tl.from(
        quizzesRef.current?.children ?? [],
        {
          x: 10,
          opacity: 0,
          duration: 0.35,
          stagger: 0.05,
          clearProps: "opacity,transform",
        },
        "-=0.35",
      );

      tl.from(
        recommendedRef.current?.children ?? [],
        {
          y: 14,
          opacity: 0,
          duration: 0.4,
          stagger: 0.06,
          clearProps: "opacity,transform",
        },
        "-=0.25",
      );
    },
    {
      dependencies: [
        loading,
        // enrolledCourses.length,
        activities.length,
        upcomingQuizzes.length,
        recommendedCourses.length,
      ],
    },
  );

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <p className="text-sm font-medium text-muted-foreground">{greeting},</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {displayName} <span aria-hidden="true">👋</span>
        </h1>
      </div>

      {/* SECTION 1: Statistics Cards */}
      <div
        ref={statsRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <StatCard
          label="Courses Enrolled"
          value={totalCourses}
          subtitle="2 new this month"
          trend="+2"
          trendUp
          icon={BookOpen}
          gradient="from-blue-500/10 to-blue-500/5"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Completed Courses"
          value={completedCourses}
          subtitle="Keep going!"
          trend="+1"
          trendUp
          icon={CheckCircle2}
          gradient="from-emerald-500/10 to-emerald-500/5"
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Average Progress"
          value={`${averageProgress}%`}
          subtitle="Learn more!"
          trend="+1"
          trendUp
          icon={Award}
          gradient="from-amber-500/10 to-amber-500/5"
          iconColor="text-amber-600"
        />
        <StatCard
          label="Active Courses"
          value={activeCourses}
          subtitle="+8% improvement"
          trend="+8%"
          trendUp
          icon={Target}
          gradient="from-violet-500/10 to-violet-500/5"
          iconColor="text-violet-600"
        />
      </div>

      {/* SECTION 2: Hero / Continue Learning */}
      {continueCourse && <ContinueLearningHero enrollment={continueCourse} />}

      {/* SECTION 3: My Courses */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <SectionHeading
            title="My Courses"
            badge={`${publishedCourses.length} enrolled`}
          />
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <Link href="/dashboard/courses">
              View all
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <div
          ref={coursesGridRef}
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 "
        >
          {publishedCourses.map((enrollment) => {
            const course = enrollment.course!;
            return <CourseCard key={course.id} {...course} />;
          })}
        </div>
        {!loading && enrollments.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed p-6 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              No courses enrolled yet
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse our course catalog and start learning today!
            </p>
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="mt-4 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Link href="/dashboard/courses">Browse Courses</Link>
            </Button>
          </div>
        )}
      </div>

      {/* SECTION 4: Recent Activity + SECTION 5: Upcoming Quizzes */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
            {activityLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading activity...
              </p>
            ) : activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recent activity yet.
              </p>
            ) : (
              <>
                <div
                  ref={activityRef}
                  className={`relative ${
                    activitiesExpanded
                      ? "max-h-[400px] overflow-y-auto pr-1"
                      : ""
                  }`}
                >
                  <div className="space-y-4">
                    {visibleActivities.map((activity, idx) => {
                      const meta = activityMeta[activity.type];
                      const Icon = meta.icon;

                      return (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 min-w-0"
                        >
                          <div className="relative flex flex-col items-center flex-shrink-0">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-xl ${meta.bg}`}
                            >
                              <Icon className={`h-4 w-4 ${meta.color}`} />
                            </div>
                            {idx < visibleActivities.length - 1 && (
                              <div className="mt-1 h-full w-px flex-1 bg-border" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0 pb-4">
                            <p className="text-sm font-semibold text-foreground break-words">
                              {activity.text}
                            </p>
                            <p className="text-xs text-muted-foreground break-words">
                              {activity.course}
                            </p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {activitiesExpanded && (
                    <div className="pointer-events-none sticky bottom-0 left-0 h-6 w-full bg-gradient-to-t from-background to-transparent" />
                  )}
                </div>

                {hasMoreActivities && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full text-xs text-muted-foreground"
                    onClick={() => setActivitiesExpanded((v) => !v)}
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
          </CardContent>
        </Card>

        {/* Upcoming Quizzes */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">
              Upcoming Quizzes
            </CardTitle>
          </CardHeader>

          <CardContent ref={quizzesRef} className="space-y-3 p-4 sm:p-5 pt-0">
            {upcomingQuizzes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No quizzes available right now.
              </p>
            ) : (
              upcomingQuizzes.slice(0, 5).map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/60 p-3 transition-colors duration-200 hover:border-emerald-500/30 hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {quiz.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {quiz.course}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                      <span>Passing: {quiz.passingScore}%</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{quiz.timeLimit} min</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    asChild
                    className="w-full sm:w-auto flex-shrink-0 transition-transform duration-150 active:scale-95"
                  >
                    <Link href={`/dashboard/topics/${quiz.topicId}/quiz`}>
                      Start
                    </Link>
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* SECTION 6: Recommended Courses */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <SectionHeading title="Recommended Courses" />
          <Button variant="ghost" size="sm" className="text-xs">
            View all
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="relative">
          {/* Edge fades hint that the row scrolls, without a visible scrollbar */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent"
          />
          <div
            ref={recommendedRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:thin]"
          >
            {recommendedCourses.map((course) => (
              <Card
                key={course.id}
                className="min-w-[260px] flex-shrink-0 snap-start border-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative h-32 overflow-hidden rounded-t-xl">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <CardContent className="p-4">
                  <h3 className="line-clamp-1 text-sm font-bold text-foreground">
                    {course.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {course.instructor}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {course.rating}
                    </span>
                    <span>{course.students.toLocaleString()} students</span>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    Enroll
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 7: Achievements */}
      {/* <div>
        <div className="mb-4 flex items-center gap-3">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-bold text-foreground">Achievements</h2>
        </div>
        <AchievementCard achievements={achievements} />
      </div> */}
    </div>
  );
}
