"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, ClipboardList, Users, FileBarChart } from "lucide-react";
import gsap from "gsap";
import { CourseWorkspaceHeader } from "@/components/admin/course-workspace/workspace-header";
import { StatsBar } from "@/components/admin/course-workspace/stats-bar";
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
import FullPageLoader from "@/components/loading/Loading";
import { Quiz } from "@/types/quiz";
import { Enrollment } from "@/types/enrollment";
import { QuizService } from "@/services/quiz";
import { enrollmentService } from "@/services/enrollment";
import { CourseStudentsTab } from "@/components/admin/course-workspace/course-students-tab";

const recentActivity = [
  {
    action: 'Published topic "Geometry & Trigonometry"',
    user: "Super Admin",
    time: "2h ago",
  },
  {
    action: 'Added 12 new questions to "Quadratic Functions"',
    user: "Super Admin",
    time: "1d ago",
  },
  { action: "Updated course description", user: "Super Admin", time: "3d ago" },
  {
    action: 'Created practice set "Algebra Mock Test"',
    user: "Super Admin",
    time: "5d ago",
  },
];

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
    if (!tabContentRef.current) return;
    gsap.fromTo(
      tabContentRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
    );
  }, [activeTab]);

  if (loading) {
    return <FullPageLoader />;
  }

  if (!course) {
    return null;
  }

  const totalTopics = topics.length;
  const totalQuizzes = quizzes.length;
  const totalStudents = enrollments.length;

  const stats = [
    {
      label: "Topics",
      value: totalTopics,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },

    {
      label: "Quiz Questions",
      value: totalQuizzes,
      icon: ClipboardList,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
    },

    {
      label: "Students",
      value: totalStudents,
      icon: Users,
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
    },
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

      <StatsBar stats={stats} />

      <WorkspaceTabs
        tabs={courseTabs}
        value={activeTab}
        onChange={setActiveTab}
      />

      <div ref={tabContentRef}>
        {activeTab === "overview" && (
          <OverviewTab
            description={course?.description}
            code={course?.course_code}
            status={course.status}
            recentActivity={recentActivity}
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
            iconColor="text-violet-600"
            iconBg="bg-violet-500/10"
          />
        )}
        {activeTab === "settings" && (
          <PlaceholderTab
            icon={Users}
            title="Course settings"
            description="Configure course visibility, certificates, and enrollment preferences."
            actionLabel="Edit Settings"
            iconColor="text-blue-600"
            iconBg="bg-blue-500/10"
          />
        )}
      </div>
    </div>
  );
}
