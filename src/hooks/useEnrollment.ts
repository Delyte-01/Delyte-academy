"use client";

import { useCallback, useEffect, useState } from "react";

import { Enrollment } from "@/types/enrollment";
import { toast } from "sonner";
import { enrollmentService } from "@/services/enrollment";

export function useEnrollment(studentId?: string) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchEnrollments = useCallback(async () => {
    if (!studentId) {
      setEnrollments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await enrollmentService.getStudentCourses(studentId);

      setEnrollments(data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load enrolled courses.");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    void Promise.resolve().then(() => fetchEnrollments());
  }, [fetchEnrollments]);

  const enroll = async (courseId: string) => {
    if (!studentId) return;
      if (enrollments.some((e) => e.course_id === courseId)) {
        return;
      }

    try {
      setSaving(true);

      await enrollmentService.enroll({
        studentId,
        courseId,
      });

      toast.success("Successfully enrolled.");

      await fetchEnrollments();
    } catch (error) {
      console.error(error);

      toast.error("Unable to enroll.");
    } finally {
      setSaving(false);
    }
  };

  const unenroll = async (enrollmentId: string) => {
    try {
      setSaving(true);

      await enrollmentService.unenroll(enrollmentId);

      toast.success("Course removed.");

      await fetchEnrollments();
    } catch (error) {
      console.error(error);

      toast.error("Unable to remove course.");
    } finally {
      setSaving(false);
    }
  };

  const updateProgress = async (
    enrollmentId: string,
    progress: number,
    completed = false,
  ) => {
    try {
      await enrollmentService.updateProgress(enrollmentId, progress, completed);

      setEnrollments((prev) =>
        prev.map((item) =>
          item.id === enrollmentId
            ? {
                ...item,
                progress,
                completed,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error(error);

      toast.error("Progress update failed.");
    }
  };

  const isEnrolled = (courseId: string) =>
    enrollments.some((e) => e.course_id === courseId);

  return {
    enrollments,

    loading,

    saving,

    refresh: fetchEnrollments,

    enroll,

    unenroll,

    updateProgress,

    isEnrolled,
  };
}
