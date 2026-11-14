"use client";

import Link from "next/link";
import { ArrowRight, ClipboardCheck, Layers } from "lucide-react";
import { useFeaturedCourses, type FeaturedCourse } from "@/hooks/useFeaturedHooks";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionIntro } from "../section-intro";

/** Stable, flat-colour fallback cover per course (picked from the palette by id). */
const COVERS = [
  "bg-primary text-primary-foreground",
  "bg-ink text-ink-foreground",
  "bg-pop text-pop-foreground",
  "bg-tint text-primary-soft-foreground",
];
function coverClass(id: string): string {
  const sum = Array.from(id).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return COVERS[sum % COVERS.length];
}

function CourseCard({ course }: { course: FeaturedCourse }) {
  return (
    <div data-course-card className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-card transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-float has-[a:focus-visible]:ring-[3px] has-[a:focus-visible]:ring-ring/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        <div
          className={`relative aspect-[16/10] w-full shrink-0 overflow-hidden ${course.thumbnail ? "" : coverClass(course.id)}`}
        >
          {course.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.thumbnail}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
            />
          ) : (
            <>
              <span
                aria-hidden
                className="absolute -bottom-10 right-3 select-none font-headline text-[11rem] font-extrabold uppercase leading-none opacity-20"
              >
                {course.title.trim().charAt(0)}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="line-clamp-1 font-headline text-xl font-extrabold capitalize tracking-[-0.02em] text-foreground">
            {course.title}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-[3rem] text-[15px] leading-relaxed text-muted-foreground">
            {course.description}
          </p>

          <div className="mt-5 flex items-center gap-5 border-t pt-4 text-sm font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Layers className="size-4" aria-hidden />
              <span className="tabular-nums">{course.topicsCount}</span>{" "}
              {course.topicsCount === 1 ? "topic" : "topics"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ClipboardCheck className="size-4" aria-hidden />
              <span className="tabular-nums">{course.quizzesCount}</span>{" "}
              {course.quizzesCount === 1 ? "quiz" : "quizzes"}
            </span>
          </div>

          <Link
            href={`/dashboard/courses/${course.id}`}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary outline-none after:absolute after:inset-0 after:content-['']"
          >
            View course
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            <span className="sr-only">: {course.title}</span>
          </Link>
        </div>
      </article>
    </div>
  );
}

function CourseSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border bg-card shadow-card">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="space-y-3 p-6">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-5 h-4 w-1/2" />
      </div>
    </div>
  );
}

/**
 * Real, published courses straight from Supabase (`useFeaturedCourses`). When
 * there are none yet (or the request fails) the section stays, with an honest
 * "on the way" card, so the "Courses" nav link never dead-ends.
 */
export function CoursesSection() {
  const { courses, loading } = useFeaturedCourses(3);
  const published = courses.filter((c) => c.status?.toLowerCase() === "published");

  const empty = !loading && published.length === 0;

  return (
    <section id="courses" className="scroll-mt-16 bg-mist py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionIntro
            title={empty ? "New courses are on the way" : "Start with a course"}
            description={
              empty
                ? "Nothing is published right now. Create an account and you’ll be notified in your dashboard as soon as a course goes live."
                : "A few of the courses available right now. Create an account to enroll."
            }
          />
          {!empty && (
            <Button asChild variant="outline" size="lg" className="w-full shrink-0 rounded-full border-foreground/15 bg-card px-7 sm:w-auto">
              <Link href="/sign-up">
                Browse all courses
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          )}
        </div>

        {empty && (
          <div className="mt-8 flex flex-col items-start gap-5 rounded-3xl border border-dashed bg-card p-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">
                Courses, topics and quizzes appear here as soon as they are
                published. Sign up now so you don’t miss the first one.
              </p>
            </div>
            <Button asChild variant="brand" size="lg" className="w-full shrink-0 sm:w-auto">
              <Link href="/sign-up">
                Create free account
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        )}

        {empty ? null : loading ? (
          <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3" aria-busy>
            {[0, 1, 2].map((n) => (
              <CourseSkeleton key={n} />
            ))}
          </div>
        ) : (
          <Reveal
            selector="[data-course-card]"
            stagger={0.08}
            className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          >
            {published.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
