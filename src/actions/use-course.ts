"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useEnrollment } from "@/context/enrollment-context";
import { Course } from "@/types/course";
import { Topic } from "@/types/topic";

export function formatDuration(minutes: number) {
  if (!minutes) return "0 min";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Single source of truth for the enroll / continue action, shared by the
 * desktop sidebar and the mobile sticky bar so they never drift apart.
 */
export function useCourseAction(
  course: Course,
  topics: Topic[],
  completedTopics: string[],
) {
  const { user } = useAuth();
  const router = useRouter();
  const { enrollments, enroll, saving, refresh } = useEnrollment();

  const enrollment = enrollments.find((e) => e.course_id === course.id);
  const isEnrolled = Boolean(enrollment);
  const progress = Math.min(
    100,
    Math.max(0, Math.round(enrollment?.progress ?? 0)),
  );

  const completedCount = topics.filter((t) =>
    completedTopics.includes(t.id),
  ).length;
  const nextTopic =
    topics.find((t) => !completedTopics.includes(t.id)) ?? topics[0];
  const allDone = topics.length > 0 && completedCount === topics.length;

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Sign in to enroll in this course.");
      return;
    }
    try {
      await enroll(course.id);
      await refresh();
      toast.success("You're enrolled. All topics are unlocked.");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't enroll in this course. Try again.");
    }
  };

  const handleContinue = () => {
    if (nextTopic) router.push(`/dashboard/topics/${nextTopic.id}`);
  };

  const ctaLabel = saving
    ? "Enrolling…"
    : !isEnrolled
      ? "Enroll now"
      : allDone
        ? "Review course"
        : completedCount > 0
          ? "Continue learning"
          : "Start learning";

  return {
    isEnrolled,
    progress,
    saving,
    completedCount,
    nextTopic,
    ctaLabel,
    onCta: isEnrolled ? handleContinue : handleEnroll,
  };
}
