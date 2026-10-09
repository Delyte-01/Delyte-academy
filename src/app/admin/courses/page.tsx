"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import AdminPageShell, {
  PlaceholderCard,
} from "@/components/admin/admin-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Layers, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CourseCardMenu } from "@/components/admin/courses/courseCardMenu";
import { Course } from "@/types/course";
import { courseService } from "@/services/course";
import { toast } from "sonner";
import { CourseThumbnail } from "@/components/admin/courses/courseThumbnail";
import Link from "next/link";
import { useAdminStudents } from "@/hooks/useAdminStudents";

const statusStyles: Record<string, string> = {
  published:
    "border-transparent bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15",
  draft:
    "border-transparent bg-amber-500/10 text-amber-600 hover:bg-amber-500/15",
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { students } = useAdminStudents();

  const enrolledStudents = students.filter(
    (student) => student.enrolledCourses > 0,
  ).length;

  
  console.log(loading);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const data = await courseService.getCourses();

      setCourses(data);
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

  // deleting courses --------------------------------

  const handleDelete = async (id: string) => {
    try {
      await courseService.deleteCourse(id);

      toast.success("Course deleted.");

      fetchCourses();
    } catch {
      toast.error("Unable to delete course.");
    }
  };

  // publish courses -------------------

  const handlePublish = async (id: string) => {
    try {
      await courseService.publishCourse(id);

      toast.success("Course published.");

      fetchCourses();
    } catch {
      toast.error("Unable to publish.");
    }
  };

  // move back to draft ------------------
  const handleDraft = async (id: string) => {
    try {
      await courseService.unpublishCourse(id);

      toast.success("Moved to draft.");

      fetchCourses();
    } catch {
      toast.error("Unable to update.");
    }
  };

  const gridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const cards = gsap.utils.toArray<HTMLElement>(
      gridRef.current?.querySelectorAll("[data-course-card]") ?? [],
    );
    gsap.fromTo(
      cards,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.06,
        ease: "power2.out",
        delay: 0.1,
      },
    );
  }, []);

  const publishedCount = courses.filter((c) => c.status === "published").length;

  const stats = [
    { label: "Total Courses", value: courses.length, icon: Layers },
    {
      label: "Enrolled Students",
      value: enrolledStudents,
      icon: GraduationCap,
    },
    {
      label: "Published",
      value: `${publishedCount}/${courses.length}`,
      icon: Sparkles,
    },
  ];

  return (
    <AdminPageShell
      title="Courses"
      description="Create and manage all courses available on the platform."
      actionLabel="New Course"
      onAction={() => {
        router.push("/admin/courses/create");
      }}
    >
      {/* KPI strip */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-border/60">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-extrabold leading-tight text-foreground">
                  {value}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 ? (
        <PlaceholderCard
          message="No courses yet. Create your first course to start building content for students."
          actionLabel="New Course"
        />
      ) : (
        <div ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/admin/courses/${course.id}`}
              className="block"
            >
              <Card
                data-course-card
                className="group relative overflow-hidden border-border/50 transition-colors duration-150 hover:border-primary/40"
              >
                <CourseThumbnail src={course.thumbnail} alt={course.title} />

                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {course.course_code}
                    </p>
                    <CardTitle className="mt-0.5 truncate text-sm font-bold">
                      {course.title}
                    </CardTitle>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {course.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2">
                      {course.creator?.avatar_url ? (
                        <img
                          src={course.creator.avatar_url}
                          alt={course.creator.full_name || "Course creator"}
                          className="h-6 w-6 rounded-full object-cover ring-1 ring-border"
                        />
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                          {(course.creator?.full_name ||
                            course.creator?.email ||
                            "A")[0].toUpperCase()}
                        </div>
                      )}
                      <p className="truncate text-xs text-muted-foreground">
                        <span className="text-foreground/80">
                          {course.creator?.full_name ||
                            course.creator?.username ||
                            course.creator?.email ||
                            "Unknown admin"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-1.5">
                    <Badge
                      className={cn(
                        "text-[10px] font-semibold",
                        statusStyles[course.status],
                      )}
                    >
                      {course.status}
                    </Badge>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <CourseCardMenu
                        status={course.status}
                        onEdit={() =>
                          router.push(`/admin/courses/${course.id}/edit`)
                        }
                        onDelete={() => handleDelete(course.id)}
                        onStatusChange={() =>
                          course.status === "draft"
                            ? handlePublish(course.id)
                            : handleDraft(course.id)
                        }
                      />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
}
