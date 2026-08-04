"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { useEnrollment } from "@/hooks/useEnrollment";
import { Course } from "@/types/course";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function CourseCard({
  id,
  title,
  course_code: code,
  thumbnail,
  description,
}: Course) {
  const { user } = useAuth();
  const { enrollments } = useEnrollment(user?.id);
  const enrollment = enrollments.find((e) => e.course_id === id);
  const progress = enrollment?.progress ?? 0;
  const isEnrolled = Boolean(enrollment);
  const isCompleted = progress === 100;
  const linkHref = `/dashboard/courses/${id}`;
  const router = useRouter();


  const handleCardClick = () => {
    router.push(linkHref);
  };

  return (
    <Card className="group relative flex flex-col overflow-hidden border-border/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-36 flex-shrink-0 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 sm:h-40">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <BookOpen className="h-6 w-6 text-white/70" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-foreground/95 px-2.5 py-1 text-[11px] font-semibold text-background shadow-sm">
            {code}
          </span>
        </div>

        {isCompleted && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald-500/95 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col p-4 sm:p-5">
        <h1 className="line-clamp-1 text-sm font-bold capitalize text-foreground">
          {title}
        </h1>
        <p className="mt-1.5 line-clamp-2 text-sm capitalize leading-relaxed tracking-normal text-muted-foreground">
          {description}
        </p>

        <div className="mt-auto pt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-foreground">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <Button
            variant={isEnrolled ? "default" : "outline"}
            size="sm"
            className="mt-4 w-full transition-transform group-hover:scale-[1.02]"
            onClick={handleCardClick}
          >
            <span className="flex items-center justify-center gap-1.5">
              {isEnrolled ? "Continue Learning" : "View Course"}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
