"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, GraduationCap, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useStudentCourses } from "@/hooks/useStudentCourses";
import { useEnrollment } from "@/hooks/useEnrollment";
import { useEffect, useMemo, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseCard } from "@/components/dashboard-components/courses/course-card";
import { useProfile } from "@/context/profile-context";

const PAGE_SIZE = 9;

/** Builds a compact page list with ellipses, e.g. [1, "...", 4, 5, 6, "...", 12] */
function getPageWindow(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];
  const windowSize = 1;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - windowSize && i <= current + windowSize)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return pages;
}

export default function MyCoursesPage() {
  const [page, setPage] = useState(1);

  const { loading, courses, search, setSearch } = useStudentCourses();
 const { profile } = useProfile();

 const { enrollments } = useEnrollment(profile?.id);



  const totalPages = Math.ceil(courses.length / PAGE_SIZE);

  const paginatedCourses = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return courses.slice(start, start + PAGE_SIZE);
  }, [courses, page]);

  const completedCount = enrollments.filter((e) => e.progress === 100).length;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            My Courses
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              {courses.length} available
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-amber-600" />
              {enrollments.length} enrolled
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              {completedCount} completed
            </span>
          </div>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9 sm:h-9"
          />
        </div>
      </div>

      {/* Grid / states */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[19rem] w-full rounded-xl" />
          ))}
        </div>
      ) : paginatedCourses.length === 0 ? (
        <Card className="flex min-h-[400px] flex-col items-center justify-center gap-4 border-dashed border-border/60 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              No courses found
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different search or browse all available courses.
            </p>
          </div>
          <Button onClick={() => setSearch("")}>Browse Courses</Button>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {paginatedCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && setPage(page - 1)}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {getPageWindow(page, totalPages).map((entry, index) =>
              entry === "ellipsis" ? (
                <PaginationItem
                  key={`ellipsis-${index}`}
                  className="hidden sm:list-item"
                >
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem
                  key={entry}
                  className={entry !== page ? "hidden sm:list-item" : ""}
                >
                  <PaginationLink
                    isActive={page === entry}
                    onClick={() => setPage(entry)}
                    className="cursor-pointer"
                  >
                    {entry}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => page < totalPages && setPage(page + 1)}
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
