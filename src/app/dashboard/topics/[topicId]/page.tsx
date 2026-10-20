"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import FullPageLoader from "@/components/loading/Loading";
import { Button } from "@/components/ui/button";
import { ExternalLinksSection } from "@/components/dashboard-components/topic-content/external-links";
import { IntroductionCard } from "@/components/dashboard-components/topic-content/introduction-card";
import { LearningObjectives } from "@/components/dashboard-components/topic-content/learning-objectives";
import { MobileLessonBar } from "@/components/dashboard-components/topic-content/mobile-lesson-bar";
import { PrerequisitesCard } from "@/components/dashboard-components/topic-content/prerequisite-card";
import { ReadingProgress } from "@/components/dashboard-components/topic-content/reading-progress";
import { ResourcesSection } from "@/components/dashboard-components/topic-content/resources-section";
import {
  Heading,
  RichContentViewer,
} from "@/components/dashboard-components/topic-content/richcontent-viewer";
import { SummaryCard } from "@/components/dashboard-components/topic-content/summary-card";
import { TopicHeader } from "@/components/dashboard-components/topic-content/topic-header";
import { TopicNavigation } from "@/components/dashboard-components/topic-content/topic-navigation";
import {
  MobileOutline,
  TopicSidebar,
} from "@/components/dashboard-components/topic-content/topic-sidebar";
import { VideoSection } from "@/components/dashboard-components/topic-content/video-section";
import { useAttachments } from "@/hooks/useAttachments";
import { useAuth } from "@/hooks/useAuth";
import { useCourse } from "@/hooks/useCourse";
import { useEnrollment } from "@/hooks/useEnrollment";
import { useTopics } from "@/hooks/useTopic";
import { useTopicProgress } from "@/hooks/useTopicProgress";
import { useTopic } from "@/hooks/useTopics";
import { studentNotificationService } from "@/services/student-notification";

export default function TopicContentPage() {
  const { topicId } = useParams();

  const { topic, loading } = useTopic(topicId as string);
  const { topics } = useTopics(topic?.course_id ?? "");
  const { course } = useCourse(topic?.course_id as string);
  const { attachments } = useAttachments(topicId as string);
  const { user } = useAuth();
  const { enrollments, updateProgress } = useEnrollment(user?.id);
  const { completedTopics, markComplete } = useTopicProgress(
    user?.id,
    topic?.course_id,
  );

  const [headings, setHeadings] = useState<Heading[]>([]);
  const [completing, setCompleting] = useState(false);

  const enrollment = enrollments.find((e) => e.course_id === topic?.course_id);
  const isCompleted = topic ? completedTopics.includes(topic.id) : false;

  const totalTopics = topics.length;
  const completedCount = topics.filter((t) =>
    completedTopics.includes(t.id),
  ).length;
  const progress = totalTopics
    ? Math.round((completedCount / totalTopics) * 100)
    : 0;

  const currentIndex = topics.findIndex((t) => t.id === topic?.id);
  const previousTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic =
    currentIndex >= 0 && currentIndex < totalTopics - 1
      ? topics[currentIndex + 1]
      : null;

  const handleMarkComplete = async () => {
    if (!user || !topic || isCompleted || completing) return;
    if (!enrollment) {
      toast.error("Enroll in this course to track your progress.");
      return;
    }

    setCompleting(true);
    try {
      await markComplete(topic.id);

      const newCount = completedCount + 1;
      const newProgress = totalTopics
        ? Math.min(100, Math.round((newCount / totalTopics) * 100))
        : 0;
      const courseDone = newProgress === 100;

      await updateProgress(enrollment.id, newProgress, courseDone);

      if (courseDone) {
        toast.success("Course completed! 🎉");
        // Only notify when the whole course is finished, not on every topic.
        await studentNotificationService.createStudentNotification({
          studentId: user.id,
          type: "course_completed",
          title: "Course completed",
          message: `Congratulations! You completed ${course?.title}.`,
          courseId: course?.id,
          link: `/dashboard/courses/${course?.id}`,
        });
      } else {
        toast.success("Topic completed!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Couldn't save your progress. Try again.");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <FullPageLoader />;

  if (!topic) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Topic not found</h1>
          <p className="text-sm text-muted-foreground">
            It may have been moved or removed.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/courses">Back to my courses</Link>
        </Button>
      </div>
    );
  }

  const topicNumber = currentIndex >= 0 ? currentIndex + 1 : topic.order_index;

  return (
    // No overflow-x-hidden here: it breaks the sticky sidebar. Wide content scrolls inside its own container.
    <div className="mx-auto w-full max-w-5xl pb-28 lg:pb-0">
      <ReadingProgress targetId="lesson-content" />

      <TopicHeader
        topic={topic}
        courseName={course?.title ?? ""}
        topicNumber={topicNumber}
        totalTopics={totalTopics}
        isCompleted={isCompleted}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="min-w-0 space-y-10">
          <MobileOutline headings={headings} />

          <div className="space-y-6">
            <IntroductionCard introduction={topic.introduction ?? ""} />
            <LearningObjectives objectives={topic.objectives ?? []} />
            <PrerequisitesCard prerequisites={topic.prerequisites ?? []} />
          </div>

          <VideoSection videoUrl={topic.video_url ?? ""} />

          <RichContentViewer
            content={topic.content ?? ""}
            onHeadings={setHeadings}
          />

          <SummaryCard summary={topic.summary ?? ""} />
          <ResourcesSection attachments={attachments} />
          <ExternalLinksSection links={topic.external_links ?? []} />

          <TopicNavigation
            topic={topic}
            previousTopic={previousTopic}
            nextTopic={nextTopic}
            hasQuiz
            isCompleted={isCompleted}
            completing={completing}
            onComplete={handleMarkComplete}
          />
        </div>

        <TopicSidebar
          topic={topic}
          headings={headings}
          progress={progress}
          completedCount={completedCount}
          totalTopics={totalTopics}
        />
      </div>

      <MobileLessonBar
        topic={topic}
        nextTopic={nextTopic}
        topicNumber={topicNumber}
        totalTopics={totalTopics}
        isCompleted={isCompleted}
        completing={completing}
        onComplete={handleMarkComplete}
      />
    </div>
  );
}
