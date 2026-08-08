"use client";

import Link from "next/link";
import { ArrowLeft, Play, BookOpen, Users, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/course";
// import { useEnrollment } from "@/hooks/useEnrollment";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEnrollment } from "@/context/enrollment-context";

export function CourseHero({ course }: { course: Course }) {
  const { user } = useAuth();
  const router = useRouter();
  const { enrollments, enroll, saving } = useEnrollment();
  const enrollment = enrollments.find((e) => e.course_id === course.id);
  const isEnrolled = Boolean(enrollment);
  const progress =
    enrollments.find((e) => e.course_id === course.id)?.progress ?? 0;
  const linkHref = `/dashboard/courses/${course.id}`;

  const handleEnroll = async () => {
    if (!course || !user) {
      toast.error("Please sign in to enroll.");
      return;
    }

    try {
      await enroll(course.id);

      toast.success("You are now enrolled in this course!");

      // Redirect directly into the course after enrollment
      router.push(linkHref);

      console.log("Current user:", user);
    } catch (error) {
      console.error(error);
      toast.error("Unable to enroll in this course.");
    }
  };

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-emerald-950/80 to-emerald-900/50 text-white shadow-xl">
      <div className="absolute inset-0 opacity-10">
        {course.banner && (
          <Image
            src={course.banner}
            alt={course.title}
            width={1920}
            height={1080}
            priority
            quality={100}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <CardContent className="relative grid gap-8 p-6 lg:grid-cols-3 lg:p-10">
        <div className="space-y-5 lg:col-span-2">
          <Link
            href="/dashboard/courses"
            className="inline-flex items-center gap-1.5 text-sm text-emerald-200 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            {course.thumbnail && (
              <Image
                src={course?.thumbnail}
                alt={course?.title ?? ""}
                width={400}
                height={200}
                className="h-28 w-44 flex-shrink-0 rounded-xl object-cover shadow-lg ring-1 ring-white/20"
              />
            )}

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-white/20 bg-white/10 text-white"
                >
                  {course.course_code}
                </Badge>
                {/* <Badge variant="outline" className={`border ${difficultyStyles[course.difficulty]}`}>
                  <Signal className="mr-1 h-3 w-3" />
                  {course.difficulty}
                </Badge> */}
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">
                {course.title}
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-emerald-100">
                {course.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-emerald-100">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-white">3</span> rating
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {/* {course.studentsCount.toLocaleString()} */}
              100 students
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {/* {course.totalTopics} */}
              topics
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between text-xs text-emerald-100">
              <span>Overall Progress</span>
              <span className="font-bold text-white">{progress}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* <p className="mt-2 text-[11px] text-emerald-200">
              {enrollments?.find((e) => e.course_id === course.id)?.completedTopics ?? 0} of {course.totalTopics} topics completed
            </p> */}
          </div>

          {isEnrolled ? (
            <Button
              className="w-full bg-white text-emerald-700 hover:bg-emerald-50"
              size="lg"
            >
              <Play className="mr-2 h-4 w-4" />
              Continue Learning
            </Button>
          ) : (
            <Button
              onClick={handleEnroll}
              disabled={saving}
              className="w-full bg-white text-emerald-700 hover:bg-emerald-50"
              size="lg"
            >
              {saving ? "Enrolling..." : "Enroll Now"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
