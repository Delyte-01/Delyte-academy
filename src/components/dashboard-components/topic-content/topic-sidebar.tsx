"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ClipboardCheck, ListTree } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/motion/progress-ring";
import { EASE, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { Topic } from "@/types/topic";
import type { Heading } from "./richcontent-viewer";

/** Scroll-spy: the heading nearest the top of the reading area. */
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
  document.getElementById(id)?.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
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
  const list = useRef<HTMLOListElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const items = useRef<Record<string, HTMLAnchorElement | null>>({});
  const placed = useRef(false);

  // A single brand marker slides to the active entry (transform + height only).
  useGSAP(
    () => {
      const el = active ? items.current[active] : null;
      const mark = indicator.current;
      if (!el || !mark) return;
      const to = { y: el.offsetTop, height: el.offsetHeight, opacity: 1 };
      if (!placed.current || prefersReducedMotion()) {
        gsap.set(mark, to);
        placed.current = true;
        return;
      }
      gsap.to(mark, { ...to, duration: 0.35, ease: EASE.out });
    },
    { dependencies: [active, headings], scope: list },
  );

  return (
    <ol ref={list} className="relative border-l border-border">
      <span
        ref={indicator}
        aria-hidden
        className="bg-brand-gradient absolute -left-px top-0 w-0.5 rounded-full opacity-0"
      />
      {headings.map((h) => (
        <li key={h.id}>
          <a
            ref={(node) => {
              items.current[h.id] = node;
            }}
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToHeading(h.id);
              onSelect?.();
            }}
            aria-current={active === h.id ? "location" : undefined}
            className={cn(
              "block rounded-r-lg py-2 pr-2 text-[14px] leading-snug transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
              h.level === 3 ? "pl-7" : "pl-4",
              active === h.id
                ? "font-semibold text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Below xl: collapsible outline at the top of the lesson. */
export function MobileOutline({ headings }: { headings: Heading[] }) {
  const [open, setOpen] = useState(false);
  if (headings.length < 3) return null;

  return (
    <div className="rounded-xl border bg-card shadow-soft xl:hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-12 w-full items-center justify-between gap-2 rounded-xl px-4 text-[15px] font-semibold outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
      >
        <span className="flex items-center gap-2">
          <ListTree className="size-4 text-primary" aria-hidden />
          On this page
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform motion-reduce:transition-none",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-t px-4 py-3">
          <OutlineList headings={headings} onSelect={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

interface LessonRailProps {
  topic: Topic;
  headings: Heading[];
  progress: number;
  completedCount: number;
  totalTopics: number;
}

/** xl and up: sticky left rail with course progress, scroll-spy outline and the quiz entry. */
export function LessonRail({
  topic,
  headings,
  progress,
  completedCount,
  totalTopics,
}: LessonRailProps) {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] space-y-7 overflow-y-auto pb-2 pr-1">
        <Link
          href={`/dashboard/courses/${topic.course_id}`}
          className="group inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none" />
          Back to course
        </Link>

        <section
          aria-label="Course progress"
          className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-card"
        >
          <ProgressRing value={progress} size={60} stroke={6} label="Course progress">
            <span className="text-[13px] font-extrabold tabular-nums">{progress}%</span>
          </ProgressRing>
          <div className="min-w-0">
            <p className="text-sm font-bold">Your progress</p>
            <p className="text-[13px] text-muted-foreground">
              {completedCount} of {totalTopics} topics done
            </p>
          </div>
        </section>

        {headings.length >= 2 && (
          <nav aria-label="On this page" className="space-y-3">
            <h2 className="px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              On this page
            </h2>
            <OutlineList headings={headings} />
          </nav>
        )}

        <Button variant="soft" className="w-full" asChild>
          <Link href={`/dashboard/topics/${topic.id}/quiz`}>
            <ClipboardCheck />
            Test yourself
          </Link>
        </Button>
      </div>
    </aside>
  );
}
