"use client";

import { useMemo, useRef, useState, type MouseEvent } from "react";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Search,
  SearchX,
  X,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CourseCardView } from "@/components/dashboard-components/courses/course-card";
import { useStudentCourses } from "@/hooks/useStudentCourses";
import { useEnrollment } from "@/hooks/useEnrollment";
import { useProfile } from "@/context/profile-context";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

type Filter = "all" | "in-progress" | "completed" | "not-enrolled";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "in-progress", label: "In progress" },
  { key: "completed", label: "Completed" },
  { key: "not-enrolled", label: "Not enrolled" },
];

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

function CourseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
      <Skeleton className="aspect-[16/9] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="mt-5 h-1.5 w-full rounded-full" />
        <Skeleton className="h-9 w-full rounded-full" />
      </div>
    </div>
  );
}

function StatPill({
  icon: Icon,
  iconClass,
  value,
  label,
}: {
  icon: typeof BookOpen;
  iconClass: string;
  value: number;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-sm shadow-sm">
      <Icon className={cn("h-4 w-4", iconClass)} />
      <span className="font-semibold tabular-nums text-foreground">
        {value}
      </span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

export default function MyCoursesPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<Filter>("all");
  const headerRef = useRef<HTMLDivElement>(null);

  const { loading, courses, search, setSearch } = useStudentCourses();
  const { profile } = useProfile();
  const { enrollments } = useEnrollment(profile?.id);

  // course id -> progress, for every course the learner is enrolled in
  const progressByCourse = useMemo(
    () =>
      new Map(enrollments.map((e) => [e.course_id, e.progress ?? 0] as const)),
    [enrollments],
  );

  const completedCount = enrollments.filter((e) => e.progress >= 100).length;

  const statusOf = (courseId: (typeof courses)[number]["id"]): Filter => {
    const progress = progressByCourse.get(courseId);
    if (progress === undefined) return "not-enrolled";
    return progress >= 100 ? "completed" : "in-progress";
  };

  // Counts shown on the filter tabs (they respect the current search).
  const counts = useMemo(() => {
    const result: Record<Filter, number> = {
      all: courses.length,
      "in-progress": 0,
      completed: 0,
      "not-enrolled": 0,
    };
    for (const course of courses) {
      const progress = progressByCourse.get(course.id);
      if (progress === undefined) result["not-enrolled"] += 1;
      else if (progress >= 100) result.completed += 1;
      else result["in-progress"] += 1;
    }
    return result;
  }, [courses, progressByCourse]);

  const filteredCourses = useMemo(
    () =>
      filter === "all"
        ? courses
        : courses.filter((course) => {
            const progress = progressByCourse.get(course.id);
            if (filter === "not-enrolled") return progress === undefined;
            if (filter === "completed") return (progress ?? 0) >= 100;
            return progress !== undefined && progress < 100;
          }),
    [courses, filter, progressByCourse],
  );

  const totalPages = Math.ceil(filteredCourses.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(totalPages, 1));

  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCourses.slice(start, start + PAGE_SIZE);
  }, [filteredCourses, currentPage]);

  const rangeStart =
    filteredCourses.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredCourses.length);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilter = (next: Filter) => {
    setFilter(next);
    setPage(1);
  };

  const goToPage = (next: number) => {
    setPage(next);
    headerRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  };

  // Pagination links render as <a>; give them a real href so they're
  // keyboard-focusable, and stop the jump to "#".
  const onPageClick = (next: number) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    goToPage(next);
  };

  const hasSearch = search.trim().length > 0;

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6">
      {/* Header */}
      <div ref={headerRef} className="scroll-mt-4 space-y-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              My courses
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Everything available to you, and where you left off.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatPill
                icon={BookOpen}
                iconClass="text-primary"
                value={courses.length}
                label="available"
              />
              <StatPill
                icon={GraduationCap}
                iconClass="text-amber-600 dark:text-amber-400"
                value={enrollments.length}
                label="enrolled"
              />
              <StatPill
                icon={CheckCircle2}
                iconClass="text-emerald-600 dark:text-emerald-400"
                value={completedCount}
                label="completed"
              />
            </div>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="Search courses"
              placeholder="Search by title or code..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-11 rounded-full bg-card pl-10 pr-10 shadow-sm"
            />
            {hasSearch && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div
          role="group"
          aria-label="Filter courses"
          className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1"
        >
          <div className="inline-flex gap-1 rounded-full bg-muted p-1">
            {FILTERS.map(({ key, label }) => {
              const active = filter === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleFilter(key)}
                  className={cn(
                    "inline-flex h-8 shrink-0 items-center gap-2 rounded-full px-3.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[11px] tabular-nums",
                      active
                        ? "bg-primary/10 text-primary"
                        : "bg-background/60 text-muted-foreground",
                    )}
                  >
                    {counts[key]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid / states */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : paginatedCourses.length === 0 ? (
        <Card className="flex min-h-[360px] flex-col items-center justify-center gap-4 rounded-2xl border-dashed border-border/60 bg-muted/20 p-8 text-center shadow-none">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            {hasSearch ? (
              <SearchX className="h-8 w-8 text-muted-foreground" />
            ) : (
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div className="max-w-sm">
            <p className="text-base font-semibold text-foreground">
              {hasSearch
                ? `No courses match “${search.trim()}”`
                : filter !== "all"
                  ? "Nothing in this view yet"
                  : "No courses available yet"}
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {hasSearch
                ? "Check the spelling or try a shorter search."
                : filter !== "all"
                  ? "Switch to All to see every course available to you."
                  : "New courses will show up here as soon as they're published."}
            </p>
          </div>
          {(hasSearch || filter !== "all") && (
            <div className="flex flex-wrap justify-center gap-2">
              {hasSearch && (
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => handleSearch("")}
                >
                  Clear search
                </Button>
              )}
              {filter !== "all" && (
                <Button
                  className="rounded-full"
                  onClick={() => handleFilter("all")}
                >
                  Show all courses
                </Button>
              )}
            </div>
          )}
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {paginatedCourses.map((course) => {
            const status = statusOf(course.id);
            return (
              <CourseCardView
                key={course.id}
                {...course}
                isEnrolled={status !== "not-enrolled"}
                progress={progressByCourse.get(course.id) ?? 0}
              />
            );
          })}
        </div>
      )}

      {/* Footer: range + pagination */}
      {!loading && filteredCourses.length > 0 && (
        <div className="space-y-4 pt-2">
          <p className="text-center text-xs text-muted-foreground">
            Showing {rangeStart}–{rangeEnd} of {filteredCourses.length}{" "}
            {filteredCourses.length === 1 ? "course" : "courses"}
          </p>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      if (currentPage > 1) onPageClick(currentPage - 1)(e);
                      else e.preventDefault();
                    }}
                    aria-disabled={currentPage === 1}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {getPageWindow(currentPage, totalPages).map((entry, index) =>
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
                      className={
                        entry !== currentPage ? "hidden sm:list-item" : ""
                      }
                    >
                      <PaginationLink
                        href="#"
                        isActive={currentPage === entry}
                        onClick={onPageClick(entry)}
                        className="cursor-pointer"
                      >
                        {entry}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      if (currentPage < totalPages)
                        onPageClick(currentPage + 1)(e);
                      else e.preventDefault();
                    }}
                    aria-disabled={currentPage === totalPages}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}
