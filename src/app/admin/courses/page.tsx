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



// const categoryStyles: Record<string, { bg: string; icon: string }> = {
//   Science: { bg: "bg-blue-500/10", icon: "text-blue-600" },
//   Arts: { bg: "bg-violet-500/10", icon: "text-violet-600" },
//   "Social Science": { bg: "bg-amber-500/10", icon: "text-amber-600" },
// };

const statusStyles: Record<string, string> = {
  published:
    "border-transparent bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15",
  draft:
    "border-transparent bg-amber-500/10 text-amber-600 hover:bg-amber-500/15",
};

// const maxQuestions = Math.max(...courses.map((c) => c.questions));

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  console.log(loading)

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
      gridRef.current?.querySelectorAll("[data-course-card]") ?? []
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
      }
    );
  }, []);

  // const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  // const publishedCount = courses.filter((c) => c.status === "Published").length;

  const stats = [
    { label: "Total Courses", value: courses.length, icon: Layers },
    {
      label: "Enrolled Students",
      value: 2,
      icon: GraduationCap,
    },
    {
      label: "Published",
      value: `${5}/${courses.length}`,
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
        <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            // const category =
            //   categoryStyles[course.category] ?? categoryStyles.Science;
            // const progress = Math.round(
            //   (course.questions / maxQuestions) * 100
            // );

            return (
              <Link
                key={course.id}
                href={`/admin/courses/${course.id}`}
                className="block"
              >
                <Card
                  // key={course.title}
                  data-course-card
                  className="group cursor-pointer overflow-hidden border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 capitalize"
                >
                  <CourseThumbnail src={course.thumbnail} alt={course.title} />

                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="min-w-0">
                        <h2 className="uppercase extra-bold">
                          {course.course_code}
                        </h2>
                        <CardTitle className="truncate text-sm font-bold mt-1">
                          {course.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-2">
                          {course.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-1.5">
                      <Badge
                        className={cn(
                          "text-[10px] font-semibold",
                          statusStyles[course.status]
                        )}
                      >
                        {course.status}
                      </Badge>
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
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-500 transition-[width] duration-500" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </AdminPageShell>
  );
}
