"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Search,
  SearchX,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { PageHeader } from "@/components/ui/page-header";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-states";
import { Reveal } from "@/components/motion";
import { CourseCardView } from "@/components/dashboard-components/courses/course-card";
import { prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useStudentCourses } from "@/hooks/useStudentCourses";
import { useEnrollment } from "@/context/enrollment-context";

const PAGE_SIZE = 9;

type Filter = "all" | "in-progress" | "completed" | "not-enrolled";
type Sort = "latest" | "title" | "progress";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "in-progress", label: "In progress" },
  { key: "completed", label: "Completed" },
  { key: "not-enrolled", label: "Not enrolled" },
];

const SORTS: { key: Sort; label: string }[] = [
  { key: "latest", label: "Latest" },
  { key: "title", label: "A to Z" },
  { key: "progress", label: "Most progress" },
];

/** Compact page list with ellipses, e.g. [1, "ellipsis", 4, 5, 6, "ellipsis", 12] */
function getPageWindow(current: number, total: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }
  return pages;
}

/** Same footprint as the real card, so nothing jumps when data arrives. */
function CourseCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-card">
      <Skeleton className="aspect-[16/9] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="mt-4 h-2 w-full rounded-full" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

function StatPill({
  icon: Icon,
  tone,
  value,
  label,
}: {
  icon: typeof BookOpen;
  tone: string;
  value: number;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3.5 py-1.5 text-sm shadow-soft">
      <Icon className={cn("size-4", tone)} aria-hidden />
      <span className="font-bold tabular-nums text-foreground">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function CoursesContent() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("latest");
  const topRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const { loading, courses, search, setSearch } = useStudentCourses();
  const { enrollments } = useEnrollment();

  // Header search (and shared links) arrive as /dashboard/courses?q=...
  const urlQuery = useSearchParams().get("q") ?? "";
  // Adjust state during render (React's recommended alternative to an effect)
  // so there is no extra pass with stale results.
  const [appliedQuery, setAppliedQuery] = useState<string | null>(null);
  if (appliedQuery !== urlQuery) {
    setAppliedQuery(urlQuery);
    setSearch(urlQuery);
    setPage(1);
  }

  // "/" focuses the search field (unless the user is already typing somewhere).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // course id -> progress, for every course the learner is enrolled in
  const progressByCourse = useMemo(
    () => new Map(enrollments.map((e) => [e.course_id, e.progress ?? 0] as const)),
    [enrollments],
  );

  const completedCount = enrollments.filter((e) => e.progress >= 100).length;

  // Counts on the filter chips respect the current search.
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

  const visibleCourses = useMemo(() => {
    const filtered =
      filter === "all"
        ? courses
        : courses.filter((course) => {
            const progress = progressByCourse.get(course.id);
            if (filter === "not-enrolled") return progress === undefined;
            if (filter === "completed") return (progress ?? 0) >= 100;
            return progress !== undefined && progress < 100;
          });

    if (sort === "latest") return filtered; // service already returns newest first
    const copy = [...filtered];
    if (sort === "title") {
      copy.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      copy.sort(
        (a, b) => (progressByCourse.get(b.id) ?? -1) - (progressByCourse.get(a.id) ?? -1),
      );
    }
    return copy;
  }, [courses, filter, sort, progressByCourse]);

  const totalPages = Math.ceil(visibleCourses.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(totalPages, 1));

  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return visibleCourses.slice(start, start + PAGE_SIZE);
  }, [visibleCourses, currentPage]);

  const rangeStart = visibleCourses.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, visibleCourses.length);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    // Keep the URL in sync without a navigation, so the link is shareable.
    window.history.replaceState(
      null,
      "",
      value.trim() ? `?q=${encodeURIComponent(value.trim())}` : window.location.pathname,
    );
  };

  const handleFilter = (next: Filter) => {
    setFilter(next);
    setPage(1);
  };

  const goToPage = (next: number) => {
    setPage(next);
    topRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  };

  // Pagination links render as <a>; give them a real href and stop the jump to "#".
  const onPageClick = (next: number) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    goToPage(next);
  };

  const hasSearch = search.trim().length > 0;

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-6">
      <div ref={topRef} className="scroll-mt-20">
        <PageHeader
          eyebrow="Catalogue"
          title="Courses"
          description="Everything available to you, and where you left off."
          actions={
            <div className="flex flex-wrap gap-2">
              <StatPill icon={BookOpen} tone="text-primary" value={courses.length} label="available" />
              <StatPill icon={GraduationCap} tone="text-info" value={enrollments.length} label="enrolled" />
              <StatPill icon={CheckCircle2} tone="text-success" value={completedCount} label="completed" />
            </div>
          }
        />
      </div>

      {/* Sticky toolbar: search, sort, filter chips */}
      <div className="sticky top-16 z-10 -mx-4 space-y-3 border-b border-transparent bg-background/85 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-md">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              ref={searchRef}
              aria-label="Search courses"
              placeholder="Search by title or code…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-11 rounded-xl bg-card pl-10 pr-12 text-[15px]"
            />
            {hasSearch ? (
              <button
                type="button"
                onClick={() => {
                  handleSearch("");
                  searchRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            ) : (
              <Kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 sm:inline-flex">/</Kbd>
            )}
          </div>

          <Select value={sort} onValueChange={(v) => { setSort(v as Sort); setPage(1); }}>
            <SelectTrigger aria-label="Sort courses" className="h-11 w-full rounded-xl bg-card text-[15px] sm:ml-auto sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {SORTS.map(({ key, label }) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div role="group" aria-label="Filter courses" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5">
          {FILTERS.map(({ key, label }) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => handleFilter(key)}
                className={cn(
                  "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
                  active
                    ? "border-transparent bg-primary text-primary-foreground shadow-soft"
                    : "bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
                )}
              >
                {label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-xs tabular-nums",
                    active ? "bg-primary-foreground/20" : "bg-muted",
                  )}
                >
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid / states */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading courses">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : paginatedCourses.length === 0 ? (
        <EmptyState
          icon={hasSearch ? SearchX : BookOpen}
          title={
            hasSearch
              ? `No courses match “${search.trim()}”`
              : filter !== "all"
                ? "Nothing in this view yet"
                : "No courses available yet"
          }
          description={
            hasSearch
              ? "Check the spelling or try a shorter search."
              : filter !== "all"
                ? "Switch to All to see every course available to you."
                : "New courses will show up here as soon as they're published."
          }
          action={
            (hasSearch || filter !== "all") && (
              <div className="flex flex-wrap justify-center gap-2">
                {hasSearch && (
                  <Button variant="outline" onClick={() => handleSearch("")}>
                    Clear search
                  </Button>
                )}
                {filter !== "all" && (
                  <Button onClick={() => handleFilter("all")}>Show all courses</Button>
                )}
              </div>
            )
          }
        />
      ) : (
        <Reveal
          key={`${filter}-${sort}-${currentPage}`}
          on="mount"
          selector="[data-card]"
          stagger={0.06}
          y={14}
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
        >
          {paginatedCourses.map((course) => {
            const progress = progressByCourse.get(course.id);
            return (
              <div key={course.id} data-card className="flex">
                <div className="flex-1">
                  <CourseCardView
                    {...course}
                    isEnrolled={progress !== undefined}
                    progress={progress ?? 0}
                  />
                </div>
              </div>
            );
          })}
        </Reveal>
      )}

      {/* Footer: range + pagination */}
      {!loading && visibleCourses.length > 0 && (
        <div className="space-y-4 pt-2">
          <p className="text-center text-[13px] text-muted-foreground" aria-live="polite">
            Showing {rangeStart}–{rangeEnd} of {visibleCourses.length}{" "}
            {visibleCourses.length === 1 ? "course" : "courses"}
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
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {getPageWindow(currentPage, totalPages).map((entry, index) =>
                  entry === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${index}`} className="hidden sm:list-item">
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem
                      key={entry}
                      className={entry !== currentPage ? "hidden sm:list-item" : ""}
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
                      if (currentPage < totalPages) onPageClick(currentPage + 1)(e);
                      else e.preventDefault();
                    }}
                    aria-disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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

export default function MyCoursesPage() {
  // useSearchParams needs a Suspense boundary for static rendering.
  return (
    <Suspense fallback={null}>
      <CoursesContent />
    </Suspense>
  );
}
