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
import { Topic, TopicContentFormData, TopicStatus } from "@/types/topic";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { formatReadableDate } from "@/constants/date-format";
import { ContentTab } from "@/components/admin/topic-workspace/content/content-tab";
import { useCourse } from "@/hooks/useCourse";
import { QuizPage } from "@/components/admin/topic-workspace/quiz/quiz-page";

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
  { value: "content", label: "Content", icon: PlayCircle },
  { value: "practice", label: "Practice Sets", icon: ClipboardList },
  { value: "questions", label: "Questions", icon: HelpCircle },
  { value: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function TopicWorkspacePage() {
  const params = useParams();
  const id = params.id as string;
  const topicId = params.topicsId as string;
  const { course } = useCourse(id);

  const [activeTab, setActiveTab] = useState("overview");
  const tabContentRef = useRef<HTMLDivElement>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [contentData, setContentData] = useState<TopicContentFormData>({
    introduction: "",
    objectives: [],
    prerequisites: [],
    content: "",
    summary: "",
    video_url: "",
    external_links: [],
    attachments: [],
  });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const topicsData = await TopicService.getTopicById(topicId);
      setTopic(topicsData);
      setContentData({
        introduction: topicsData.introduction ?? "",
        objectives: topicsData.objectives ?? [],
        prerequisites: topicsData.prerequisites ?? [],
        content: topicsData.content ?? "",
        summary: topicsData.summary ?? "",
        video_url: topicsData.video_url ?? "",
        external_links: topicsData.external_links ?? [],
        attachments: topicsData.attachments ?? [],
      });
    } catch (error) {
      console.error(error);
      toast.error("Unable to load course");
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  const handleContentChange = <K extends keyof typeof contentData>(
    field: K,
    value: (typeof contentData)[K]
  ) => {
    setContentData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
    return <div>loading</div>;
  }

  //  changes the status of the topic----------------------------

  const handleChangeStatus = async (id: string, status: TopicStatus) => {
    try {
      await TopicService.changeStatus(id, status);

      setTopic((prev) =>
        prev
          ? {
              ...prev,
              status,
            }
          : prev
      );

      toast.success(
        status === "published" ? "Topic published." : "Topic moved to draft."
      );
    } catch (error) {
      toast.error(`Failed to update topic. ${error}`);
    }
  };

  const addListItem = (field: "objectives" | "prerequisites") => {
    handleContentChange(field, [...contentData[field], ""]);
  };

  const updateListItem = (
    field: "objectives" | "prerequisites",
    index: number,
    value: string
  ) => {
    const updated = [...contentData[field]];

    updated[index] = value;

    handleContentChange(field, updated);
  };

  const removeListItem = (
    field: "objectives" | "prerequisites",
    index: number
  ) => {
    handleContentChange(
      field,
      contentData[field].filter((_, i) => i !== index)
    );
  };

  const saveContent = async (status: TopicStatus) => {
    try {
      await TopicService.updateTopic({
        id: topic.id,
        courseId: topic.course_id,

        title: topic.title,
        description: topic.description,
        estimatedTime: topic.estimated_time,
        difficulty: topic.difficulty,

        status,

        introduction: contentData.introduction,
        objectives: contentData.objectives,
        prerequisites: contentData.prerequisites,
        content: contentData.content,
        summary: contentData.summary,

        video_url: contentData.video_url,
        external_links: contentData.external_links,
        attachments: contentData.attachments,
      });

      setTopic((prev) => (prev ? { ...prev, status } : prev));

      toast.success(
        status === "published"
          ? "Content published successfully."
          : "Draft saved successfully."
      );
    } catch (err) {
      toast.error(`Failed to save content. ${err}`);
    }
  };

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
        onChangeStatus={handleChangeStatus}
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
            createdAt={formatReadableDate(topic.created_at)}
            updatedAt={formatReadableDate(topic.updated_at)}
            // author={topic.author}
            stats={overviewStats}
            recentActivity={recentActivity}
          />
        )}
        {activeTab === "content" && (
          <ContentTab
            data={contentData}
            onChange={handleContentChange}
            addListItem={addListItem}
            updateListItem={updateListItem}
            removeListItem={removeListItem}
            onSave={saveContent}
            topicTitle={topic.title}
            topicId={topicId}
            description={topic.description}
            status={topic.status}
            difficulty={topic.difficulty}
            lastUpdated={formatReadableDate(topic.updated_at)}
            createdAt={formatReadableDate(topic.created_at)}
            readingTime={topic.estimated_time}
            courseSlug={id}
            courseName={course?.title ?? ""}
          />
        )}

        {activeTab === "practice" && <QuizPage />}
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
