"use client";

import { ExternalLinksSection } from "@/components/dashboard-components/topic-content/external-links";
import { IntroductionCard } from "@/components/dashboard-components/topic-content/introduction-card";
import { LearningObjectives } from "@/components/dashboard-components/topic-content/learning-objectives";
import { PrerequisitesCard } from "@/components/dashboard-components/topic-content/prerequisite-card";
import { ResourcesSection } from "@/components/dashboard-components/topic-content/resources-section";
import { RichContentViewer } from "@/components/dashboard-components/topic-content/richcontent-viewer";
import { SummaryCard } from "@/components/dashboard-components/topic-content/summary-card";
import { TopicHeader } from "@/components/dashboard-components/topic-content/topic-header";
import { TopicNavigation } from "@/components/dashboard-components/topic-content/topic-navigation";
import { TopicSidebar } from "@/components/dashboard-components/topic-content/topic-sidebar";
import { VideoSection } from "@/components/dashboard-components/topic-content/video-section";
import FullPageLoader from "@/components/loading/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAttachments } from "@/hooks/useAttachments";
import { useAuth } from "@/hooks/useAuth";
import { useCourse } from "@/hooks/useCourse";
import { useEnrollment } from "@/hooks/useEnrollment";
import { useTopics } from "@/hooks/useTopic";
import { useTopicProgress } from "@/hooks/useTopicProgress";
import { useTopic } from "@/hooks/useTopics";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function TopicContentPage() {
  const { topicId } = useParams();

  const { topic, loading } = useTopic(topicId as string);
  const { topics } = useTopics(topic?.course_id ?? "");
  const { course } = useCourse(topic?.course_id as string);
  const { attachments } = useAttachments(topicId as string);
  const { user } = useAuth();

  const { enrollments, updateProgress, isEnrolled } = useEnrollment(user?.id);

  const enrollment = enrollments.find((e) => e.course_id === topic?.course_id);

  const { completedTopics, markComplete } = useTopicProgress(
    user?.id,
    topic?.course_id,
  );

  const handleMarkComplete = async () => {
    if (!user || !topic || !enrollment) return;

    await markComplete(topic.id);

    const totalTopics = topics.length; // from the course topics list

    const completedCount = completedTopics.includes(topic.id)
      ? completedTopics.length
      : completedTopics.length + 1;

    const progress = Math.round((completedCount / totalTopics) * 100);

    await updateProgress(enrollment.id, progress, progress === 100);

    toast.success("Topic completed!");
  };

  const currentIndex = topics.findIndex((t) => t.id === topic?.id);

  const previousTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;

  const nextTopic =
    currentIndex >= 0 && currentIndex < topics.length - 1
      ? topics[currentIndex + 1]
      : null;

  console.log(course);

  if (loading) {
    return <FullPageLoader />;
  }

  if (!topic) {
    return <div className="p-8">Topic not found.</div>;
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <TopicHeader topic={topic} courseName={course?.title ?? ""} />

      <div className="md:grid gap-6 lg:grid-cols-10">
        {/* Reading Content (70%) */}
        <div className="space-y-6 lg:col-span-7">
          <LearningObjectives objectives={topic.objectives ?? []} />
          <PrerequisitesCard prerequisites={topic.prerequisites ?? []} />
          <IntroductionCard introduction={topic.introduction ?? ""} />
          <VideoSection videoUrl={topic.video_url ?? ""} />
          <RichContentViewer
            content={topic.content ?? "<p>No content available.</p>"}
          />
          <SummaryCard summary={topic.summary ?? ""} />
          <ResourcesSection attachments={attachments} />
          <ExternalLinksSection links={topic.external_links ?? []} />

          <Card className="border-primary/20 bg-primary/5 mt-8">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-foreground">
                  Ready to move on?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Mark this topic as complete to update your course progress and
                  unlock the next lesson.
                </p>
              </div>

              <Button
                onClick={handleMarkComplete}
                disabled={completedTopics.includes(topic.id)}
                className="sm:min-w-[180px] cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {completedTopics.includes(topic.id)
                  ? "Completed"
                  : "Mark Topic Complete"}
              </Button>
            </CardContent>
          </Card>
          <TopicNavigation
            topic={topic}
            previousTopic={previousTopic}
            nextTopic={nextTopic}
            hasQuiz={true}
          />
        </div>

        {/* Sticky Sidebar (30%) */}
        <div className="lg:col-span-3">
          <TopicSidebar topic={topic} attachments={attachments} />
        </div>
      </div>
    </div>
  );
}
