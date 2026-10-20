"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Topic } from "@/types/topic";
import type { Heading } from "./richcontent-viewer";

function useActiveHeading(headings: Heading[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -65% 0px" },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  return active ?? headings[0]?.id ?? null;
}

function scrollToHeading(id: string) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({
    behavior: reduce ? "auto" : "smooth",
    block: "start",
  });
}

function OutlineList({
  headings,
  onSelect,
}: {
  headings: Heading[];
  onSelect?: () => void;
}) {
  const active = useActiveHeading(headings);

  return (
    <ol className="border-l border-border">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToHeading(h.id);
              onSelect?.();
            }}
            aria-current={active === h.id ? "location" : undefined}
            className={cn(
              "-ml-px block border-l-2 py-1.5 pr-2 text-sm leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
              h.level === 3 ? "pl-6" : "pl-3",
              active === h.id
                ? "border-emerald-500 font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

/* Mobile: collapsible outline at the top of the lesson */
export function MobileOutline({ headings }: { headings: Heading[] }) {
  const [open, setOpen] = useState(false);
  if (headings.length < 3) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
      >
        On this page
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform motion-reduce:transition-none",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-t border-border/60 px-4 py-3">
          <OutlineList headings={headings} onSelect={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

interface TopicSidebarProps {
  topic: Topic;
  headings: Heading[];
  progress: number;
  completedCount: number;
  totalTopics: number;
}

/* Desktop: sticky rail */
export function TopicSidebar({
  topic,
  headings,
  progress,
  completedCount,
  totalTopics,
}: TopicSidebarProps) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-6 max-h-[calc(100vh-3rem)] space-y-5 overflow-y-auto pb-2">
        <section className="space-y-4 rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold">Your progress</h2>
            <span className="text-sm font-semibold tabular-nums">
              {progress}%
            </span>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Course progress"
          >
            <div
              className="h-full rounded-full bg-emerald-500 transition-[width] duration-700 motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {totalTopics} topics done
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/dashboard/courses/${topic.course_id}`}>
              <BookOpen className="mr-2 size-4" />
              Back to course
            </Link>
          </Button>
        </section>

        {headings.length >= 2 && (
          <nav aria-label="On this page" className="space-y-3 px-1">
            <h2 className="text-sm font-semibold">On this page</h2>
            <OutlineList headings={headings} />
          </nav>
        )}

        <section className="space-y-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold">Test yourself</h2>
            <p className="text-sm text-muted-foreground">
              Check what you&apos;ve learned with a short quiz.
            </p>
          </div>
          <Button
            className="w-full bg-emerald-600 text-white hover:bg-emerald-500"
            asChild
          >
            <Link href={`/dashboard/topics/${topic.id}/quiz`}>
              <ClipboardCheck className="mr-2 size-4" />
              Take quiz
            </Link>
          </Button>
        </section>
      </div>
    </aside>
  );
}
