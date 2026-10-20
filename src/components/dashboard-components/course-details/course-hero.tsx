"use client";

import Image from "next/image";
import { Clock, Layers, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/course";
import { formatDuration } from "@/actions/use-course";

interface CourseHeroProps {
  course: Course;
  topicCount?: number;
  totalMinutes?: number;
  rating?: number;
  students?: number;
}

export function CourseHero({
  course,
  topicCount,
  totalMinutes,
  rating,
  students,
}: CourseHeroProps) {
  const meta = [
    rating != null && {
      icon: <Star className="size-4 fill-amber-400 text-amber-400" />,
      label: (
        <>
          <span className="font-semibold text-white">{rating.toFixed(1)}</span>{" "}
          rating
        </>
      ),
    },
    students != null && {
      icon: <Users className="size-4" />,
      label: `${students.toLocaleString()} students`,
    },
    !!topicCount && {
      icon: <Layers className="size-4" />,
      label: `${topicCount} ${topicCount === 1 ? "topic" : "topics"}`,
    },
    !!totalMinutes && {
      icon: <Clock className="size-4" />,
      label: formatDuration(totalMinutes),
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: React.ReactNode }[];

  return (
    <section className="relative isolate overflow-hidden rounded-2xl bg-slate-950 text-white ring-1 ring-white/10 sm:rounded-3xl">
      {course.banner && (
        <Image
          src={course.banner}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 1100px, 100vw"
          className="-z-20 object-cover opacity-40"
        />
      )}
      {/* Legibility scrim: darkest where the text sits */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

      <div className="flex min-h-[240px] flex-col justify-end gap-4 p-5 sm:min-h-[300px] sm:p-8 lg:min-h-[340px] lg:p-10">
        <Badge
          variant="outline"
          className="w-fit border-emerald-400/30 bg-emerald-400/10 font-medium text-emerald-200"
        >
          {course.course_code}
        </Badge>

        <h1 className="max-w-3xl text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {course.title}
        </h1>

        {course.description && (
          <p className="line-clamp-2 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {course.description}
          </p>
        )}

        {meta.length > 0 && (
          <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-sm text-slate-300">
            {meta.map((m, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {m.icon}
                <span>{m.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
