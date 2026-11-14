"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, GraduationCap, Layers, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import AdminPageShell from "@/components/admin/admin-page-shell";
import { CourseCardMenu } from "@/components/admin/courses/courseCardMenu";
import { CourseThumbnail } from "@/components/admin/courses/courseThumbnail";
import { EmptyState } from "@/components/empty-states";
import { Reveal, SpotlightCard } from "@/components/motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAdminStudents } from "@/hooks/useAdminStudents";
import { cn } from "@/lib/utils";
import { courseService } from "@/services/course";
import type { Course } from "@/types/course";

type Filter = "all" | "published" | "draft";

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [toDelete, setToDelete] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { students } = useAdminStudents();

  const enrolledStudents = students.filter((s) => s.enrolledCourses > 0).length;

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setCourses(await courseService.getCourses());
    } catch (error) {
      toast.error(`Failed to load courses.${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);
      await courseService.deleteCourse(id);
      toast.success("Course deleted.");
      setToDelete(null);
      fetchCourses();
    } catch {
      toast.error("Unable to delete course.");
    } finally {
      setDeleting(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await courseService.publishCourse(id);
      toast.success("Course published.");
      fetchCourses();
    } catch {
      toast.error("Unable to publish.");
    }
  };

  const handleDraft = async (id: string) => {
    try {
      await courseService.unpublishCourse(id);
      toast.success("Moved to draft.");
      fetchCourses();
    } catch {
      toast.error("Unable to update.");
    }
  };

  const publishedCount = courses.filter((c) => c.status === "published").length;
  const draftCount = courses.length - publishedCount;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter(
      (c) =>
        (filter === "all" || c.status === filter) &&
        (!q || c.title.toLowerCase().includes(q) || c.course_code.toLowerCase().includes(q)),
    );
  }, [courses, query, filter]);

  const chips: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: courses.length },
    { id: "published", label: "Published", count: publishedCount },
    { id: "draft", label: "Drafts", count: draftCount },
  ];

  return (
    <AdminPageShell
      title="Courses"
      description="Create and manage all courses available on the platform."
      actionLabel="New course"
      onAction={() => router.push("/admin/courses/create")}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total courses" value={courses.length} icon={Layers} tone="brand" />
          <StatCard label="Enrolled students" value={enrolledStudents} icon={GraduationCap} tone="success" />
          <StatCard
            label="Published"
            value={publishedCount}
            icon={Sparkles}
            tone="info"
            hint={courses.length ? `of ${courses.length} courses` : undefined}
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or code"
              aria-label="Search courses"
              className="pl-9 pr-9"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" aria-hidden />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
            {chips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                aria-pressed={filter === chip.id}
                onClick={() => setFilter(chip.id)}
                className={cn(
                  "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
                  filter === chip.id
                    ? "border-transparent bg-primary-soft text-primary-soft-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {chip.label}
                <span className="text-xs tabular-nums opacity-80">{chip.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading courses">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[320px] rounded-xl" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses yet"
            description="Create your first course to start building content for students."
            action={
              <Button variant="brand" onClick={() => router.push("/admin/courses/create")}>
                New course
              </Button>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState
            title="No courses match"
            description="Try a different search or clear the status filter."
            action={
              <Button
                variant="soft"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <Reveal on="mount" selector="[data-course-card]" stagger={0.05} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((course) => (
              <div key={course.id} data-course-card>
                <SpotlightCard className="group h-full overflow-hidden p-0">
                  <CourseThumbnail src={course.thumbnail} alt="" />
                  <div className="flex flex-col gap-3 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{course.course_code}</p>
                        <h3 className="mt-0.5 font-heading text-lg font-bold leading-snug tracking-tight text-foreground">
                          {/* Stretched link: the whole card opens the course; the menu sits above it. */}
                          <Link
                            href={`/admin/courses/${course.id}`}
                            className="outline-none after:absolute after:inset-0 after:z-0 focus-visible:after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
                          >
                            <span className="line-clamp-2">{course.title}</span>
                          </Link>
                        </h3>
                      </div>
                      <div className="relative z-10 -mr-2 -mt-1 shrink-0">
                        <CourseCardMenu
                          status={course.status}
                          title={course.title}
                          onEdit={() => router.push(`/admin/courses/${course.id}/edit`)}
                          onDelete={() => setToDelete(course)}
                          onStatusChange={() =>
                            course.status === "draft" ? handlePublish(course.id) : handleDraft(course.id)
                          }
                        />
                      </div>
                    </div>

                    <p className="line-clamp-2 text-[15px] leading-relaxed text-muted-foreground">{course.description}</p>

                    <div className="mt-1 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        {course.creator?.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={course.creator.avatar_url}
                            alt=""
                            className="size-6 shrink-0 rounded-full object-cover ring-1 ring-border"
                          />
                        ) : (
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[10px] font-bold text-primary-soft-foreground">
                            {(course.creator?.full_name || course.creator?.email || "A")[0].toUpperCase()}
                          </span>
                        )}
                        <span className="truncate text-[13px] text-muted-foreground">
                          {course.creator?.full_name ||
                            course.creator?.username ||
                            course.creator?.email ||
                            "Unknown admin"}
                        </span>
                      </div>
                      <StatusBadge status={course.status} />
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            ))}
          </Reveal>
        )}
      </div>

      {/* Delete confirmation (was previously immediate) */}
      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && !deleting && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this course?</AlertDialogTitle>
            <AlertDialogDescription>
              “{toDelete?.title}” will be permanently removed. This can’t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                if (toDelete) void handleDelete(toDelete.id);
              }}
            >
              {deleting ? "Deleting…" : "Delete course"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPageShell>
  );
}
