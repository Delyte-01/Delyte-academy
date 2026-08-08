"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

import { enrollmentService } from "@/services/enrollment";
import { Enrollment } from "@/types/enrollment";

interface EnrollmentContextType {
  enrollments: Enrollment[];
  loading: boolean;
  saving: boolean;
  refresh: () => Promise<void>;
  enroll: (courseId: string) => Promise<void>;
  unenroll: (enrollmentId: string) => Promise<void>;
  updateProgress: (
    enrollmentId: string,
    progress: number,
    completed?: boolean,
  ) => Promise<void>;
  isEnrolled: (courseId: string) => boolean;
}

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(
  undefined,
);

interface EnrollmentProviderProps {
  studentId: string;
  children: React.ReactNode;
}

export function EnrollmentProvider({
  studentId,
  children,
}: EnrollmentProviderProps) {
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchEnrollments();
  }, [fetchEnrollments]);

  const enroll = useCallback(
    async (courseId: string) => {
      if (!studentId) return;

      if (enrollments.some((e) => e.course_id === courseId)) {
        return;
      }

      try {
        setSaving(true);

        const enrollment = await enrollmentService.enroll({
          studentId,
          courseId,
        });

        // Optimistic update so every component unlocks immediately
        setEnrollments((prev) => [...prev, enrollment]);

        toast.success("Course unlocked successfully 🎉");
      } catch (error) {
        console.error(error);
        toast.error("Unable to enroll.");
        throw error;
      } finally {
        setSaving(false);
      }
    },
    [studentId, enrollments],
  );

  const unenroll = useCallback(async (enrollmentId: string) => {
    try {
      setSaving(true);

      await enrollmentService.unenroll(enrollmentId);

      setEnrollments((prev) => prev.filter((item) => item.id !== enrollmentId));

      toast.success("Course removed.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to remove course.");
      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateProgress = useCallback(
    async (enrollmentId: string, progress: number, completed = false) => {
      try {
        await enrollmentService.updateProgress(
          enrollmentId,
          progress,
          completed,
        );

        setEnrollments((prev) =>
          prev.map((item) =>
            item.id === enrollmentId ? { ...item, progress, completed } : item,
          ),
        );
      } catch (error) {
        console.error(error);
        toast.error("Progress update failed.");
        throw error;
      }
    },
    [],
  );

  const isEnrolled = useCallback(
    (courseId: string) => enrollments.some((e) => e.course_id === courseId),
    [enrollments],
  );

  const value = useMemo(
    () => ({
      enrollments,
      loading,
      saving,
      refresh: fetchEnrollments,
      enroll,
      unenroll,
      updateProgress,
      isEnrolled,
    }),
    [
      enrollments,
      loading,
      saving,
      fetchEnrollments,
      enroll,
      unenroll,
      updateProgress,
      isEnrolled,
    ],
  );

  return (
    <EnrollmentContext.Provider value={value}>
      {children}
    </EnrollmentContext.Provider>
  );
}

export function useEnrollment() {
  const context = useContext(EnrollmentContext);

  if (!context) {
    throw new Error("useEnrollment must be used within an EnrollmentProvider");
  }

  return context;
}
