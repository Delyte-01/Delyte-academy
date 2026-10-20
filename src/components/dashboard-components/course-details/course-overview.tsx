"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CourseOverviewProps {
  description: string;
}

export function CourseOverview({ description }: CourseOverviewProps) {
  const [open, setOpen] = useState(false);
  if (!description) return null;

  const isLong = description.length > 240;

  return (
    <section aria-labelledby="about-course" className="space-y-3">
      <h2 id="about-course" className="text-xl font-semibold tracking-tight">
        About this course
      </h2>
      <p
        className={cn(
          "max-w-prose whitespace-pre-line text-[15px] leading-7 text-muted-foreground",
          isLong && !open && "line-clamp-4 lg:line-clamp-none",
        )}
      >
        {description}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="text-sm font-medium text-emerald-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 lg:hidden dark:text-emerald-400"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </section>
  );
}
