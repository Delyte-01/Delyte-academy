"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronRight, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-states";
import { Reveal } from "@/components/motion";
import { CourseHero } from "@/components/dashboard-components/course-details/course-hero";
import { CourseOverview } from "@/components/dashboard-components/course-details/course-overview";
import { TopicAccordion } from "@/components/dashboard-components/course-details/topic-accordion";
import {
  CourseSidebar,
  MobileEnrollBar,
} from "@/components/dashboard-components/course-details/course-sidebar";
import { useCourse } from "@/hooks/useCourse";
import { useTopics } from "@/hooks/useTopic";
import { useAuth } from "@/hooks/useAuth";
import { useTopicProgress } from "@/hooks/useTopicProgress";
import { useEnrollment } from "@/context/enrollment-context";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { enrollments } = useEnrollment();

  const { course, loading: courseLoading } = useCourse(courseId as string);
  const { topics, loading: topicLoading } = useTopics(courseId as string);
  const { completedTopics } = useTopicProgress(user?.id, course?.id);

  const topicList = topics ?? [];
  const totalMinutes = topicList.reduce(
    (sum, t) => sum + (Number(t.estimated_time) || 0),
    0,
  );

  const enrollment = enrollments.find((e) => e.course_id === course?.id);

  // Resolved, and the course really doesn't exist (or isn't visible to this learner).
  if (!courseLoading && !course) {
    return (
      <div className="mx-auto w-full max-w-[1280px]">
        <EmptyState
          icon={SearchX}
          title="Course not found"
          description="It may have been unpublished or the link is out of date."
          action={
            <Button asChild variant="brand">
              <Link href="/dashboard/courses">Browse courses</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    // Bottom padding keeps content clear of the mobile sticky bar
    <div className="mx-auto w-full max-w-[1280px] space-y-6 pb-28 lg:pb-0">
      {/* Mobile: single back link. Desktop: full breadcrumb. */}
      <Link
        href="/dashboard/courses"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground sm:hidden"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Courses
      </Link>
      <nav aria-label="Breadcrumb" className="hidden sm:block">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/dashboard" className="font-semibold transition-colors hover:text-foreground">
              Dashboard
            </Link>
          </li>
          <ChevronRight className="size-3.5 shrink-0" aria-hidden />
          <li>
            <Link href="/dashboard/courses" className="font-semibold transition-colors hover:text-foreground">
              Courses
            </Link>
          </li>
          <ChevronRight className="size-3.5 shrink-0" aria-hidden />
          <li className="min-w-0 truncate font-semibold capitalize text-foreground" aria-current="page">
            {course?.title}
          </li>
        </ol>
      </nav>

      <Reveal on="mount" selector="[data-reveal]" stagger={0.1} className="space-y-8">
        <div data-reveal>
          {course ? (
            <CourseHero
              course={course}
              topicCount={topicList.length}
              totalMinutes={totalMinutes}
              enrolled={Boolean(enrollment)}
              progress={enrollment?.progress ?? 0}
            />
          ) : (
            <Skeleton className="h-80 w-full rounded-2xl sm:h-[26rem]" />
          )}
        </div>

        <div
          data-reveal
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-10"
        >
          <div className="min-w-0 space-y-10">
            <CourseOverview description={course?.description ?? ""} />
            <TopicAccordion
              topics={topicList}
              loading={topicLoading}
              completedTopics={completedTopics}
            />
          </div>

          {course && (
            <CourseSidebar
              course={course}
              topics={topicList}
              completedTopics={completedTopics}
              totalMinutes={totalMinutes}
            />
          )}
        </div>
      </Reveal>

      {course && (
        <MobileEnrollBar
          course={course}
          topics={topicList}
          completedTopics={completedTopics}
        />
      )}
    </div>
  );
}
