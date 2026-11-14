"use client";

import {
  Bell,
  Check,
  Clock,
  Lock,
  Play,
} from "lucide-react";
import { useRef } from "react";
import { Reveal } from "@/components/motion";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { SectionIntro } from "../section-intro";

type Surface = "tint" | "ink" | "card" | "pop" | "primary";

const SURFACE: Record<Surface, { box: string; icon: string; title: string; body: string }> = {
  tint: {
    box: "bg-tint border-transparent",
    icon: "bg-card text-primary shadow-soft",
    title: "text-foreground",
    body: "text-muted-foreground",
  },
  ink: {
    box: "bg-ink border-transparent",
    icon: "bg-ink-2 text-ink-foreground ring-1 ring-ink-line",
    title: "text-ink-foreground",
    body: "text-ink-muted",
  },
  card: {
    box: "bg-card border-border shadow-card",
    icon: "bg-primary-soft text-primary-soft-foreground",
    title: "text-foreground",
    body: "text-muted-foreground",
  },
  pop: {
    box: "bg-pop border-transparent",
    icon: "bg-ink text-ink-foreground",
    title: "text-pop-foreground",
    body: "text-pop-foreground/75",
  },
  primary: {
    box: "bg-primary border-transparent",
    icon: "bg-primary-foreground/15 text-primary-foreground",
    title: "text-primary-foreground",
    body: "text-primary-foreground/80",
  },
};

function FeatureCard({
  title,
  children,
  surface,
  className,
  visual,
}: {
  title: string;
  children: React.ReactNode;
  surface: Surface;
  className?: string;
  visual?: React.ReactNode;
}) {
  const s = SURFACE[surface];
  return (
    <div data-reveal-card className={cn("h-full", className)}>
      <div
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-[1.75rem] border p-6 sm:p-8",
          s.box,
        )}
      >
        <h3
          className={cn(
            "font-headline text-2xl font-extrabold tracking-[-0.025em]",
            s.title,
          )}
        >
          {title}
        </h3>
        <p className={cn("mt-2.5 max-w-md text-[15px] leading-relaxed", s.body)}>
          {children}
        </p>
        {visual && <div className="mt-6 flex flex-1 flex-col justify-end sm:mt-8">{visual}</div>}
      </div>
    </div>
  );
}

/** Generic curriculum illustration. Labels are placeholders, not course data. */
function CurriculumVisual() {
  const rows: { label: string; state: "done" | "next" | "locked" }[] = [
    { label: "Introduction", state: "done" },
    { label: "Core concepts", state: "next" },
    { label: "Worked examples", state: "locked" },
  ];
  return (
    <ul
      aria-hidden
      data-visual
      className="divide-y overflow-hidden rounded-2xl border bg-card shadow-card"
    >
      {rows.map((row) => (
        <li key={row.label} data-row className="flex items-center gap-3.5 px-4 py-3.5">
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-full",
              row.state === "done" && "bg-success-soft text-success",
              row.state === "next" && "bg-primary text-primary-foreground",
              row.state === "locked" && "bg-muted text-muted-foreground",
            )}
          >
            {row.state === "done" ? (
              <Check className="size-3.5" />
            ) : row.state === "next" ? (
              <Play className="size-3 fill-current" />
            ) : (
              <Lock className="size-3" />
            )}
          </span>
          <span className="text-sm font-bold text-foreground">{row.label}</span>
          {row.state === "next" && (
            <span className="ml-auto rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-bold text-primary-soft-foreground">
              Up next
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Question navigator, drawn the way the quiz player shows it. */
function NavigatorVisual() {
  const states = [
    "done", "done", "done", "current", "idle",
    "idle", "idle", "idle", "idle", "idle",
  ] as const;
  return (
    <div aria-hidden data-visual className="rounded-2xl bg-ink-2 p-4 ring-1 ring-ink-line">
      <div className="mb-3 flex items-center justify-between text-xs font-bold text-ink-muted">
        <span>Questions</span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" />
          Timed
        </span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {states.map((state, i) => (
          <span
            key={i}
            data-cell
            className={cn(
              "flex h-9 items-center justify-center rounded-lg text-xs font-bold tabular-nums",
              state === "done" && "bg-primary/25 text-ink-foreground",
              state === "current" && "bg-primary text-primary-foreground",
              state === "idle" && "bg-ink text-ink-muted",
            )}
          >
            {i + 1}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Weekly activity bars. Purely illustrative shapes, no numbers. */
function WeekVisual() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const heights = [34, 56, 42, 80, 50, 66, 28]; // px
  return (
    <div aria-hidden data-visual className="flex items-end gap-2.5">
      {days.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center justify-end gap-2">
          <span
            data-bar
            className={cn(
              "w-full rounded-md",
              i === 3 ? "bg-primary" : "bg-primary-soft",
            )}
            style={{ height: heights[i] }}
          />
          <span className="text-[11px] font-bold text-muted-foreground">{d}</span>
        </div>
      ))}
    </div>
  );
}

function NotificationVisual() {
  const items = ["A new topic was published", "A new quiz is ready"];
  return (
    <ul aria-hidden data-visual className="space-y-2.5">
      {items.map((text, i) => (
        <li
          key={text}
          data-row
          className={cn(
            "flex items-center gap-3 rounded-xl bg-card px-3.5 py-3 shadow-card",
            i === 1 && "ml-5 opacity-80",
          )}
        >
          <span className="relative flex size-8 items-center justify-center rounded-lg bg-ink text-ink-foreground">
            <Bell className="size-4" />
            {i === 0 && (
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-card bg-primary" />
            )}
          </span>
          <span className="text-sm font-bold text-foreground">{text}</span>
        </li>
      ))}
    </ul>
  );
}

function ResumeVisual() {
  return (
    <div
      aria-hidden
      data-visual
      className="flex items-center gap-3.5 rounded-2xl bg-card p-3.5 shadow-card"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Play className="size-4 fill-current" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-foreground">Core concepts</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div data-fill className="h-full w-3/5 origin-left rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Each card's illustration plays once as it scrolls in: bars grow, cells pop,
  // rows slide in, the progress bar fills.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const root = sectionRef.current;
      if (!root) return;
      root.querySelectorAll<HTMLElement>("[data-visual]").forEach((visual) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: visual, start: "top 88%", once: true },
          defaults: { ease: "power3.out" },
        });
        const bars = visual.querySelectorAll("[data-bar]");
        const cells = visual.querySelectorAll("[data-cell]");
        const rows = visual.querySelectorAll("[data-row]");
        const fill = visual.querySelectorAll("[data-fill]");
        if (bars.length)
          tl.from(bars, { scaleY: 0, transformOrigin: "bottom", duration: 0.8, stagger: 0.07, clearProps: "transform" });
        if (cells.length)
          tl.from(cells, { scale: 0.5, opacity: 0, duration: 0.45, stagger: 0.04, clearProps: "transform,opacity" });
        if (rows.length)
          tl.from(rows, { x: -18, opacity: 0, duration: 0.6, stagger: 0.12, clearProps: "transform,opacity" });
        if (fill.length)
          tl.from(fill, { scaleX: 0, duration: 1, clearProps: "transform" });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="features" className="scroll-mt-16 bg-background py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <SectionIntro
            className="lg:col-span-7 lg:max-w-none"
            title="Everything you need to prepare, in one place"
          />
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground lg:col-span-5 lg:justify-self-end">
            Study the material, test yourself, and see where you stand.
          </p>
        </div>

        <Reveal
          selector="[data-reveal-card]"
          stagger={0.08}
          className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 lg:mt-16 lg:grid-cols-6"
        >
          <FeatureCard
            surface="tint"
            title="Courses organized by topic"
            className="lg:col-span-4"
            visual={<CurriculumVisual />}
          >
            Enroll in a course and work through it topic by topic. Lessons can
            include text, video, maths notation and extra resources.
          </FeatureCard>

          <FeatureCard
            surface="ink"
            title="CBT-style quizzes"
            className="lg:col-span-2"
            visual={<NavigatorVisual />}
          >
            Timed attempts, a question navigator and automatic scoring get you
            used to computer-based exams.
          </FeatureCard>

          <FeatureCard
            surface="card"
            title="Progress you can see"
            className="lg:col-span-2"
            visual={<WeekVisual />}
          >
            Completed topics, quiz scores, streaks and a weekly goal, all drawn
            from your own activity.
          </FeatureCard>

          <FeatureCard
            surface="pop"
            title="Stay in the loop"
            className="lg:col-span-2"
            visual={<NotificationVisual />}
          >
            Get notified in your dashboard when new courses, topics or quizzes
            are published.
          </FeatureCard>

          <FeatureCard
            surface="primary"
            title="Pick up where you left off"
            className="lg:col-span-2"
            visual={<ResumeVisual />}
          >
            Your dashboard puts the next lesson front and center, so you can
            start studying right away.
          </FeatureCard>
        </Reveal>
      </div>
    </section>
  );
}
