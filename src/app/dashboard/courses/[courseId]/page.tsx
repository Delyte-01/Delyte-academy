"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CourseHero } from "@/components/dashboard-components/course-details/course-hero";
import { CourseOverview } from "@/components/dashboard-components/course-details/course-overview";
import { TopicAccordion } from "@/components/dashboard-components/course-details/topic-accordion";
// import { CourseSidebar } from "@/components/dashboard-components/course-details/course-sidebar";
import { useParams } from "next/navigation";
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

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/dashboard"
          className="font-medium transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
        <Link
          href="/dashboard/courses"
          className="font-medium transition-colors hover:text-foreground"
        >
          My Courses
        </Link>
        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="truncate font-medium text-foreground">
          {course?.title}
        </span>
      </div>

      {/* Hero */}
      {course && <CourseHero course={course} />}

      {/* Main content + sidebar */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Overview + Topics */}
        <div className="space-y-6 lg:col-span-2">
          <CourseOverview
            description={course?.description ?? ""}
          />

          <TopicAccordion
            topics={topics}
            loading={topicLoading}
            completedTopics={completedTopics}
          />
        </div>

        {/* Right: Sidebar (desktop sticky, mobile stacks below) */}
        <div className="lg:col-span-1">
          {/* {course && <CourseSidebar course={course} />} */}
        </div>
      </div>
    </div>
  );
}
