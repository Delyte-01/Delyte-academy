"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const { user } = useAuth();

  const { course } = useCourse(courseId as string);
  const { topics, loading: topicLoading } = useTopics(courseId as string);
  const { completedTopics } = useTopicProgress(user?.id, course?.id);

  const topicList = topics ?? [];
  const totalMinutes = topicList.reduce(
    (sum, t) => sum + (Number(t.estimated_time) || 0),
    0,
  );

  return (
    // Bottom padding keeps content clear of the mobile sticky bar
    <div className="space-y-6 pb-28 lg:pb-0">
      {/* Mobile: single back link. Desktop: full breadcrumb. */}
      <Link
        href="/dashboard/courses"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:hidden"
      >
        <ArrowLeft className="size-4" />
        My courses
      </Link>
      <nav aria-label="Breadcrumb" className="hidden sm:block">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/dashboard" className="font-medium transition-colors hover:text-foreground">
              Dashboard
            </Link>
          </li>
          <ChevronRight className="size-3.5 shrink-0" aria-hidden />
          <li>
            <Link href="/dashboard/courses" className="font-medium transition-colors hover:text-foreground">
              My courses
            </Link>
          </li>
          <ChevronRight className="size-3.5 shrink-0" aria-hidden />
          <li className="min-w-0 truncate font-medium text-foreground" aria-current="page">
            {course?.title}
          </li>
        </ol>
      </nav>

      {course ? (
        <CourseHero
          course={course}
          topicCount={topicList.length}
          totalMinutes={totalMinutes}
        />
      ) : (
        <Skeleton className="h-64 w-full rounded-3xl sm:h-80" />
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-10">
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