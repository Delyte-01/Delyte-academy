"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutGrid,
  PlayCircle,
  ClipboardList,
  HelpCircle,
  BarChart3,
  Clock,
  Paperclip,
  Link2,
  Target,
} from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

import { StatStrip } from "@/components/admin/workspace/stat-strip";
import { WorkspaceSkeleton } from "@/components/admin/workspace/workspace-skeleton";

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
    external_links: [{ title: "", url: "" }],
    attachments: [],
  });
  const [, setLoading] = useState(true);

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
    value: (typeof contentData)[K],
  ) => {
    setContentData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

  if (!topic) {
    return <WorkspaceSkeleton />;
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
          : prev,
      );

      toast.success(
        status === "published" ? "Topic published." : "Topic moved to draft.",
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
    value: string,
  ) => {
    const updated = [...contentData[field]];

    updated[index] = value;

    handleContentChange(field, updated);
  };

  const removeListItem = (
    field: "objectives" | "prerequisites",
    index: number,
  ) => {
    handleContentChange(
      field,
      contentData[field].filter((_, i) => i !== index),
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
          : "Draft saved successfully.",
      );
    } catch (err) {
      toast.error(`Failed to save content. ${err}`);
    }
  };

  // Real figures from the topic itself (the old tiles were hard-coded sample numbers).
  const attachmentCount = contentData.attachments.length;
  const linkCount = contentData.external_links.filter((l) => l.url.trim()).length;
  const objectiveCount = contentData.objectives.filter((o) => o.trim()).length;
  const stats = [
    { label: "Reading time (min)", value: topic.estimated_time ?? 0, icon: Clock, tone: "info" as const },
    { label: "Learning objectives", value: objectiveCount, icon: Target, tone: "brand" as const },
    { label: "Attachments", value: attachmentCount, icon: Paperclip, tone: "warning" as const },
    { label: "External links", value: linkCount, icon: Link2, tone: "success" as const },
  ];
  const overviewStats = stats.map(({ label, value }) => ({ label, value: String(value) }));

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

      <StatStrip items={stats} />

      <WorkspaceTabs tabs={tabs} value={activeTab} onChange={setActiveTab} />

      <div
        ref={tabContentRef}
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
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
            iconColor="text-primary"
            iconBg="bg-primary/10"
            title="Question bank"
            description="Build and organize multiple-choice and short-answer questions for this topic."
            actionLabel="Add Question"
          />
        )}
        {activeTab === "analytics" && (
          <TopicPlaceholderTab
            icon={BarChart3}
            iconColor="text-warning"
            iconBg="bg-warning/10"
            title="Topic analytics"
            description="Track student performance, average scores, and question difficulty across this topic."
            actionLabel="View Analytics"
          />
        )}
      </div>
    </div>
  );
}
