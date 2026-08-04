"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Play } from "lucide-react";
import gsap from "gsap";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
}

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ContinueLearningHero({ enrollment }: ContinueLearningHeroProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const blobARef = useRef<HTMLDivElement>(null);
  const blobBRef = useRef<HTMLDivElement>(null);

  const progress = Math.max(0, Math.min(100, enrollment.progress));
  const course = enrollment.course;

  // Entrance + progress fill, runs once on mount.
  useEffect(() => {
    if (prefersReducedMotion()) {
      if (barRef.current) barRef.current.style.width = `${progress}%`;
      if (percentRef.current) percentRef.current.textContent = `${progress}%`;
      return;
    }

    const ctx: gsap.Context = gsap.context(() => {
      const tl: gsap.core.Timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.from(cardRef.current, { y: 18, opacity: 0, duration: 0.5 });

      if (barRef.current) {
        tl.fromTo(
          barRef.current,
          { width: "0%" },
          { width: `${progress}%`, duration: 0.9, ease: "power2.out" },
          "-=0.2",
        );
      }

      const counter = { val: 0 };
      tl.to(
        counter,
        {
          val: progress,
          duration: 0.9,
          ease: "power2.out",
          onUpdate: () => {
            if (percentRef.current) {
              percentRef.current.textContent = `${Math.round(counter.val)}%`;
            }
          },
        },
        "<",
      );

      // Very slow, gentle ambient drift on the glass blobs — barely perceptible,
      // just enough so the card doesn't feel static.
      if (blobARef.current) {
        gsap.to(blobARef.current, {
          x: 14,
          y: -10,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
      if (blobBRef.current) {
        gsap.to(blobBRef.current, {
          x: -12,
          y: 10,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.4,
        });
      }
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card
      ref={cardRef}
      className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-900/20"
    >
      {/* Decorative glass blobs — subtle, kept behind content */}
      <div
        ref={blobARef}
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl"
      />
      <div
        ref={blobBRef}
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-teal-300/10 blur-3xl"
      />

      <CardContent className="relative z-10 flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="group relative h-40 w-full flex-shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm sm:h-32 sm:w-48">
          {course?.thumbnail ? (
            <>
              <Image
                src={course.thumbnail}
                alt={course.title ?? "Course thumbnail"}
                fill
                sizes="(min-width: 640px) 192px, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Soft diagonal shine sweep on hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <GraduationCap className="h-10 w-10 text-white/70" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <Badge className="border-white/30 bg-white/15 text-white backdrop-blur-sm hover:bg-white/20">
              Continue Learning
            </Badge>
            <h2 className="mt-2 line-clamp-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {course?.title ?? "Untitled course"}
            </h2>
            <p className="mt-1 text-sm text-emerald-100">
              Current Topic: Continue from your next available topic
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-emerald-100">
              <span>Progress</span>
              <span ref={percentRef} className="font-bold tabular-nums text-white">
                0%
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-white/20"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Course progress: ${progress}%`}
            >
              <div
                ref={barRef}
                className="h-full rounded-full bg-white"
                style={{ width: "0%" }}
              />
            </div>
          </div>

          <Button
            asChild
            variant="secondary"
            size="sm"
            className="group/btn bg-white text-emerald-700 shadow-sm transition-transform duration-150 hover:-translate-y-0.5 hover:bg-white/90 active:scale-95"
          >
            <Link href={`/dashboard/courses/${course?.id ?? ""}`}>
              <Play className="mr-1.5 h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              Continue Learning
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}