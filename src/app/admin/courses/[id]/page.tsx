"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, ClipboardList, Users, FileBarChart } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { CourseWorkspaceHeader } from "@/components/admin/course-workspace/workspace-header";
import { StatStrip } from "@/components/admin/workspace/stat-strip";
import { WorkspaceSkeleton } from "@/components/admin/workspace/workspace-skeleton";
import {
  courseTabs,
  WorkspaceTabs,
} from "@/components/admin/course-workspace/workspace-tab";
import { OverviewTab } from "@/components/admin/course-workspace/overview-tab";
import { PlaceholderTab } from "@/components/admin/course-workspace/placeholder-tab";
import { TopicsTab } from "@/components/admin/course-workspace/topics-tab";
import { Course } from "@/types/course";
import { Topic } from "@/types/topic";
import { courseService } from "@/services/course";
import { TopicService } from "@/services/topic";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { formatReadableDate } from "@/constants/date-format";
import { Quiz } from "@/types/quiz";
import { Enrollment } from "@/types/enrollment";
import { QuizService } from "@/services/quiz";
import { enrollmentService } from "@/services/enrollment";
import { CourseStudentsTab } from "@/components/admin/course-workspace/course-students-tab";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  // Now you can safely access the id
  const id = resolvedParams.id;
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") ?? "overview";
  const [activeTab, setActiveTab] = useState(tab);
  const tabContentRef = useRef<HTMLDivElement>(null);
  

  const [course, setCourse] = useState<Course | null>(null);

  const [topics, setTopics] = useState<Topic[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const [loading, setLoading] = useState(true);
  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const [courseData, topicsData, enrollmentsData] = await Promise.all([
        courseService.getCourseById(id),
        TopicService.getTopicsByCourse(id),
        enrollmentService.getCourseEnrollments(id),
      ]);

      // Fetch quiz for each topic
      const quizResults = await Promise.all(
        topicsData.map(async (topic) => {
          try {
            return await QuizService.getQuizByTopic(topic.id);
          } catch {
            return null; // topic may not have a quiz yet
          }
        }),
      );

      setCourse(courseData);
      setTopics(topicsData);
      setQuizzes(quizResults.filter((quiz): quiz is Quiz => quiz !== null));
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load course");
       router.replace("/admin/courses");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  // Crossfade the tab panel every time the active tab changes
  useEffect(() => {
    if (!tabContentRef.current || prefersReducedMotion()) return;
    gsap.fromTo(
      tabContentRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", clearProps: "transform,opacity" },
    );
  }, [activeTab]);

  if (loading) {
    return <WorkspaceSkeleton />;
  }

  if (!course) {
    return null;
  }

  const totalTopics = topics.length;
  const totalQuizzes = quizzes.length;
  const totalStudents = enrollments.length;

  const stats = [
    { label: "Topics", value: totalTopics, icon: BookOpen, tone: "info" as const },
    { label: "Quizzes", value: totalQuizzes, icon: ClipboardList, tone: "brand" as const },
    { label: "Students", value: totalStudents, icon: Users, tone: "warning" as const },
  ];

  return (
    <div className="space-y-6">
      <CourseWorkspaceHeader
        title={course.title}
        code={course.course_code}
        status={course.status}
        banner={course.banner ?? undefined}
        thumbnail={course.thumbnail ?? undefined}
        courseSlug={id}
      />

      <StatStrip items={stats} />

      <WorkspaceTabs
        tabs={courseTabs.map((t) =>
          t.value === "topics"
            ? { ...t, count: totalTopics }
            : t.value === "students"
              ? { ...t, count: totalStudents }
              : t,
        )}
        value={activeTab}
        onChange={setActiveTab}
      />

      <div
        ref={tabContentRef}
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTab === "overview" && (
          <OverviewTab
            description={course?.description}
            code={course?.course_code}
            status={course.status}
            createdAt={formatReadableDate(course.created_at)}
            updatedAt={formatReadableDate(course.updated_at)}
            id={course.id}
            creator={course.creator}
          />
        )}
        {activeTab === "topics" && (
          <TopicsTab courseId={id} topics={topics} setTopics={setTopics} />
        )}

        {activeTab === "students" && (
          <CourseStudentsTab students={enrollments} />
        )}
        {activeTab === "analytics" && (
          <PlaceholderTab
            icon={FileBarChart}
            title="Course analytics"
            description="See engagement, completion rates, and performance trends for this course."
            actionLabel="View Analytics"
            iconColor="text-primary"
            iconBg="bg-primary/10"
          />
        )}
        {activeTab === "settings" && (
          <PlaceholderTab
            icon={Users}
            title="Course settings"
            description="Configure course visibility, certificates, and enrollment preferences."
            actionLabel="Edit Settings"
            iconColor="text-info"
            iconBg="bg-info/10"
          />
        )}
      </div>
    </div>
  );
}
