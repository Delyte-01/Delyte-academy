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
      <h2 id="about-course" className="font-heading text-xl font-bold tracking-tight text-foreground">
        About this course
      </h2>
      <p
        className={cn(
          "max-w-prose whitespace-pre-line text-base leading-7 text-muted-foreground",
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
          className="min-h-11 rounded-lg text-sm font-semibold text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/40 lg:hidden"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </section>
  );
}
