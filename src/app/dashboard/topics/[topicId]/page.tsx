"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-states";
import { cn } from "@/lib/utils";
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
  LessonRail,
  MobileOutline,
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

const FOCUS_KEY = "delyte:lesson-focus";

/** Focus mode is a per-device reading preference, so browser storage is the right home. */
function readFocusPref(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(FOCUS_KEY) === "1";
  } catch {
    return false;
  }
}

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
  const [focus, setFocus] = useState(readFocusPref);

  const toggleFocus = () => {
    setFocus((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(FOCUS_KEY, next ? "1" : "0");
      } catch {
        /* storage unavailable: the preference just won't persist */
      }
      return next;
    });
  };

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

  if (loading) {
    return (
      <div
        className="mx-auto w-full max-w-6xl space-y-8"
        role="status"
        aria-label="Loading lesson"
      >
        <Skeleton className="h-4 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-40 rounded-full" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        <div className="grid gap-12 xl:grid-cols-[232px_minmax(0,1fr)]">
          <Skeleton className="hidden h-72 rounded-xl xl:block" />
          <div className="max-w-3xl space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="mt-6 h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <EmptyState
        title="Topic not found"
        description="It may have been moved or removed."
        action={
          <Button asChild>
            <Link href="/dashboard/courses">Back to my courses</Link>
          </Button>
        }
      />
    );
  }

  const topicNumber = currentIndex >= 0 ? currentIndex + 1 : topic.order_index;

  return (
    // No overflow-x-hidden here: it breaks the sticky rail. Wide content scrolls inside its own container.
    <div
      className={cn(
        "mx-auto w-full pb-28 xl:pb-0",
        focus ? "max-w-3xl" : "max-w-6xl",
      )}
    >
      <ReadingProgress targetId="lesson-content" />

      <TopicHeader
        topic={topic}
        courseName={course?.title ?? ""}
        topicNumber={topicNumber}
        totalTopics={totalTopics}
        isCompleted={isCompleted}
        focus={focus}
        onToggleFocus={toggleFocus}
      />

      <div
        className={cn(
          "grid gap-12",
          !focus && "xl:grid-cols-[232px_minmax(0,1fr)] xl:items-start",
        )}
      >
        {!focus && (
          <LessonRail
            topic={topic}
            headings={headings}
            progress={progress}
            completedCount={completedCount}
            totalTopics={totalTopics}
          />
        )}

        <div className="min-w-0 max-w-3xl space-y-10">
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
