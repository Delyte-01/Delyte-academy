"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  FileText,
  ClipboardList,
  HelpCircle,
  Users,
  FileBarChart,
} from "lucide-react";
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
import { useSearchParams } from "next/navigation";
import { formatReadableDate } from "@/constants/date-format";


const stats = [
  {
    label: "Topics",
    value: "24",
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Resources",
    value: "8",
    icon: FileText,
    color: "text-rose-600",
    bgColor: "bg-rose-500/10",
  },
  {
    label: "Practice Sets",
    value: "12",
    icon: ClipboardList,
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Questions",
    value: "320",
    icon: HelpCircle,
    color: "text-violet-600",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Students",
    value: "1,240",
    icon: Users,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
];

const overviewStats = [
  { label: "Topics", value: "24" },
  { label: "Resources", value: "8" },
  { label: "Practice Sets", value: "12" },
  { label: "Questions", value: "320" },
  { label: "Students", value: "1,240" },
  { label: "Completion", value: "68%" },
];

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
  const tab = searchParams.get("tab") ?? "overview";
  const [activeTab, setActiveTab] = useState(tab);
  const tabContentRef = useRef<HTMLDivElement>(null);

  const [course, setCourse] = useState<Course | null>(null);

  const [topics, setTopics] = useState<Topic[]>([]);

  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const [courseData, topicsData] = await Promise.all([
        courseService.getCourseById(id),
        TopicService.getTopicsByCourse(id),
      ]);

      setCourse(courseData);
      setTopics(topicsData);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load course");
    } finally {
      setLoading(false);
    }
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
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );
  }, [activeTab]);

  if (loading) {
    return <div>laoding...</div>;
  }

  if (!course) {
    return null;
  }


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
            stats={overviewStats}
            recentActivity={recentActivity}
            createdAt={formatReadableDate(course.created_at)}
            updatedAt={formatReadableDate(course.updated_at)}
          />
        )}
        {activeTab === "topics" && (
          <TopicsTab courseId={id} topics={topics} setTopics={setTopics} />
        )}
        {activeTab === "resources" && (
          <PlaceholderTab
            icon={FileText}
            title="Manage resources"
            description="Upload and organize PDFs, slides, and downloadable materials for this course."
            actionLabel="Add Resource"
            iconColor="text-rose-600"
            iconBg="bg-rose-500/10"
          />
        )}
        {activeTab === "practice" && (
          <PlaceholderTab
            icon={ClipboardList}
            title="Practice sets"
            description="Create timed practice tests and mock exams to help students prepare."
            actionLabel="Create Practice Set"
            iconColor="text-emerald-600"
            iconBg="bg-emerald-500/10"
          />
        )}
        {activeTab === "students" && (
          <PlaceholderTab
            icon={Users}
            title="Enrolled students"
            description="View and manage students enrolled in this course, track their progress."
            actionLabel="View Students"
            iconColor="text-amber-600"
            iconBg="bg-amber-500/10"
          />
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
