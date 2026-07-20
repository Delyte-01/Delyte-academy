"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutGrid,
  PlayCircle,
  FileText,
  ClipboardList,
  HelpCircle,
  BarChart3,
} from "lucide-react";
import gsap from "gsap";

import { StatsBar } from "@/components/admin/course-workspace/stats-bar";

import {
  WorkspaceTabItem,
  WorkspaceTabs,
} from "@/components/admin/course-workspace/workspace-tab";
import { TopicWorkspaceHeader } from "@/components/admin/topic-workspace/topic-workspace-header";
import { TopicOverviewTab } from "@/components/admin/topic-workspace/topic-overview-tab";
import { TopicPlaceholderTab } from "@/components/admin/topic-workspace/topic-placeholder-tab";
import { TopicService } from "@/services/topic";
import { Topic } from "@/types/topic";
import { courseService } from "@/services/course";
import { toast } from "sonner";
import { Course } from "@/types/course";
import { useParams } from "next/navigation";
import { formatReadableDate } from "@/constants/date-format";

const stats = [
  {
    label: "Lessons",
    value: "6",
    icon: PlayCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Resources",
    value: "4",
    icon: FileText,
    color: "text-rose-600",
    bgColor: "bg-rose-500/10",
  },
  {
    label: "Practice Sets",
    value: "2",
    icon: ClipboardList,
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Questions",
    value: "24",
    icon: HelpCircle,
    color: "text-violet-600",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Completion",
    value: "82%",
    icon: BarChart3,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
];

const overviewStats = [
  { label: "Lessons", value: "6" },
  { label: "Resources", value: "4" },
  { label: "Practice Sets", value: "2" },
  { label: "Questions", value: "24" },
];

const recentActivity = [
  {
    action: 'Added lesson "Solving for X"',
    user: "Super Admin",
    time: "3h ago",
  },
  { action: "Updated topic description", user: "Super Admin", time: "2d ago" },
  {
    action: 'Created practice set "Algebra Basics Quiz"',
    user: "Super Admin",
    time: "4d ago",
  },
  {
    action: 'Uploaded resource "Variables Worksheet.pdf"',
    user: "Super Admin",
    time: "1w ago",
  },
];

const tabs: WorkspaceTabItem[] = [
  { value: "overview", label: "Overview", icon: LayoutGrid },
  { value: "lesson", label: "Lesson", icon: PlayCircle },
  { value: "resources", label: "Resources", icon: FileText },
  { value: "practice", label: "Practice Sets", icon: ClipboardList },
  { value: "questions", label: "Questions", icon: HelpCircle },
  { value: "analytics", label: "Analytics", icon: BarChart3 },
];

// interface PageProps {
//   params: Promise<{ id: string }>;
// }

export default function TopicWorkspacePage() {
  // const router = useRouter();

  const params = useParams();
  const id = params.id as string;
  const topicId = params.topicsId as string;

  const [activeTab, setActiveTab] = useState("overview");
  const tabContentRef = useRef<HTMLDivElement>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const topicsData = await TopicService.getTopicById(topicId);
      setTopic(topicsData);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load course");
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  console.log(topic);
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

  if (!topic) {
    return (
      <div>loading</div>
    );
  }
  return (
    <div className="space-y-6">
      <TopicWorkspaceHeader
        title={topic.title}
        description={topic.description}
        // code={topic.code}
        difficulty={topic.difficulty ?? undefined}
        duration={topic.estimated_time}
        status={topic.status}
        courseSlug={id}
      />

      <StatsBar stats={stats} />

      <WorkspaceTabs tabs={tabs} value={activeTab} onChange={setActiveTab} />

      <div ref={tabContentRef}>
        {activeTab === "overview" && (
          <TopicOverviewTab
            title={topic.title}
            description={topic.description}
            code={topic.title}
            difficulty={topic.difficulty}
            duration={topic.estimated_time}
            status={topic.status}
            createdAt={formatReadableDate(topic.created_at )}
            updatedAt={formatReadableDate(topic.updated_at )}
            // author={topic.author}
            stats={overviewStats}
            recentActivity={recentActivity}
          />
        )}
        {activeTab === "lesson" && (
          <TopicPlaceholderTab
            icon={PlayCircle}
            iconColor="text-blue-600"
            iconBg="bg-blue-500/10"
            title="Build the lesson"
            description="Add video lessons, slides, and step-by-step walkthroughs for this topic."
            actionLabel="Add Lesson"
          />
        )}
        {activeTab === "resources" && (
          <TopicPlaceholderTab
            icon={FileText}
            iconColor="text-rose-600"
            iconBg="bg-rose-500/10"
            title="Topic resources"
            description="Attach PDFs, worksheets, and downloadable materials specific to this topic."
            actionLabel="Add Resource"
          />
        )}
        {activeTab === "practice" && (
          <TopicPlaceholderTab
            icon={ClipboardList}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-500/10"
            title="Practice sets"
            description="Create topic-specific practice sets and diagnostic quizzes for students."
            actionLabel="Create Practice Set"
          />
        )}
        {activeTab === "questions" && (
          <TopicPlaceholderTab
            icon={HelpCircle}
            iconColor="text-violet-600"
            iconBg="bg-violet-500/10"
            title="Question bank"
            description="Build and organize multiple-choice and short-answer questions for this topic."
            actionLabel="Add Question"
          />
        )}
        {activeTab === "analytics" && (
          <TopicPlaceholderTab
            icon={BarChart3}
            iconColor="text-amber-600"
            iconBg="bg-amber-500/10"
            title="Topic analytics"
            description="Track student performance, average scores, and question difficulty across this topic."
            actionLabel="View Analytics"
          />
        )}
      </div>
    </div>
  );
}
