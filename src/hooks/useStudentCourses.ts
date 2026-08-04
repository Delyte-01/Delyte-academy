"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Course } from "@/types/course";
import { courseService } from "@/services/course";

export function useStudentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  // const [featured, setFeatured] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);

      const data = await courseService.getPublishedCourses();

      setCourses(data);

      // const featuredData = await courseService.getFeaturedCourses();

      // setFeatured(featuredData);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCourses();
  }, [fetchCourses]);

  const filteredCourses = useMemo(() => {
    if (!search.trim()) return courses;

    const value = search.toLowerCase();

    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(value) ||
        course.description?.toLowerCase().includes(value) ||
        course.course_code.toLowerCase().includes(value),
    );
  }, [courses, search]);


  

  return {
    loading,

    search,

    setSearch,

    courses: filteredCourses,

    // featured,

    refresh: fetchCourses,
  };
}
