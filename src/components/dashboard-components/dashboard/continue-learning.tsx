"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Play } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Button } from "@/components/ui/button";

interface ContinueLearningCourse {
  id: string;
  title: string;
  thumbnail?: string | null;
}

interface ContinueLearningEnrollment {
  progress: number;
  course?: ContinueLearningCourse | null;
}

interface ContinueLearningHeroProps {
  enrollment: ContinueLearningEnrollment;
  /**
   * Optional name of the next topic. When omitted the line is hidden
   * (the old version always showed a placeholder sentence).
   */
  currentTopic?: string | null;
}

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ContinueLearningHero({
  enrollment,
  currentTopic,
}: ContinueLearningHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  const progress = Math.max(0, Math.min(100, Math.round(enrollment.progress)));
  const course = enrollment.course;

  // Progress fill + count-up. The entrance fade is handled by the page,
  // so this component only animates what belongs to it.
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        if (barRef.current) barRef.current.style.width = `${progress}%`;
        if (percentRef.current) percentRef.current.textContent = `${progress}%`;
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      if (barRef.current) {
        tl.fromTo(
          barRef.current,
          { width: "0%" },
          { width: `${progress}%`, duration: 1 },
        );
      }

      const counter = { val: 0 };
      tl.to(
        counter,
        {
          val: progress,
          duration: 1,
          onUpdate: () => {
            if (percentRef.current) {
              percentRef.current.textContent = `${Math.round(counter.val)}%`;
            }
          },
        },
        "<",
      );

      // One very slow ambient drift so the card never feels frozen.
      if (blobRef.current) {
        gsap.to(blobRef.current, {
          x: 18,
          y: -12,
          duration: 9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    },
    { scope: sectionRef, dependencies: [progress] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden rounded-3xl bg-emerald-950 text-white shadow-xl shadow-emerald-950/20 ring-1 ring-white/10"
    >
      {/* Backdrop: soft colour fields + a faint grid that fades out */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_120%_at_0%_0%,rgba(20,184,166,0.38),transparent_60%),radial-gradient(70%_100%_at_100%_100%,rgba(16,185,129,0.26),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]"
      />
      <div
        ref={blobRef}
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 -z-10 h-64 w-64 rounded-full bg-teal-300/10 blur-3xl"
      />

      <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[240px_minmax(0,1fr)] md:items-center md:gap-8">
        {/* Thumbnail */}
        <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/15">
          {course?.thumbnail ? (
            <>
              <Image
                src={course.thumbnail}
                alt={course.title ?? "Course thumbnail"}
                fill
                sizes="(min-width: 768px) 240px, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-950/50 via-transparent to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <GraduationCap className="h-10 w-10 text-white/60" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="min-w-0 space-y-5">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-emerald-300 motion-safe:animate-pulse"
              />
              Continue learning
            </span>
            <h2 className="mt-3 line-clamp-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {course?.title ?? "Untitled course"}
            </h2>
            {currentTopic && (
              <p className="mt-1.5 text-sm text-emerald-100/80">
                Up next:{" "}
                <span className="font-medium text-white">{currentTopic}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-100/80">
              <span>Course progress</span>
              <span
                ref={percentRef}
                className="text-sm font-semibold tabular-nums text-white"
              >
                {progress}%
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-white/15"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Course progress: ${progress}%`}
            >
              <div
                ref={barRef}
                className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-teal-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Button
            asChild
            size="lg"
            className="group/btn w-full rounded-full bg-white px-6 text-emerald-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-50 active:scale-95 sm:w-auto"
          >
            <Link href={`/dashboard/courses/${course?.id ?? ""}`}>
              <Play className="mr-2 h-4 w-4 fill-current transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              Resume course
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}