"use client";

import { CheckCircle2, ClipboardCheck, Flame, TrendingUp } from "lucide-react";

import { CountUp } from "@/components/motion/count-up";
import { ProgressRing } from "@/components/motion/progress-ring";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressSummary } from "@/types/progress";

interface ProgressOverviewProps {
  summary: ProgressSummary;
  courseCount: number;
}

/** Headline: one big ring for "how far am I", four stat tiles for "what have I done". */
export function ProgressOverview({ summary, courseCount }: ProgressOverviewProps) {
  const topicPct = summary.totalTopics
    ? Math.round((summary.completedTopics / summary.totalTopics) * 100)
    : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <section
        aria-label="Overall progress"
        className="bg-brand-wash flex flex-col items-center justify-center gap-5 rounded-2xl border bg-card p-8 text-center shadow-card"
      >
        <ProgressRing value={summary.overallPercent} size={176} stroke={12} label="Overall progress">
          <span className="flex flex-col items-center">
            <span className="font-heading text-5xl font-extrabold tabular-nums tracking-tight">
              <CountUp value={summary.overallPercent} suffix="%" />
            </span>
            <span className="text-xs font-semibold text-muted-foreground">Overall</span>
          </span>
        </ProgressRing>
        <p className="text-[15px] text-muted-foreground">
          {courseCount === 0
            ? "Enroll in a course to start tracking."
            : `Average across ${courseCount} enrolled ${courseCount === 1 ? "course" : "courses"}`}
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Topics completed"
          value={summary.completedTopics}
          icon={CheckCircle2}
          tone="success"
          hint={`of ${summary.totalTopics} in your courses`}
          progress={topicPct}
        />
        <StatCard
          label="Quizzes passed"
          value={summary.quizzesPassed}
          icon={ClipboardCheck}
          tone="brand"
          hint={summary.quizzesTaken ? `of ${summary.quizzesTaken} taken` : "No quizzes taken yet"}
        />
        <StatCard
          label="Average quiz score"
          value={summary.averageScore ?? "—"}
          suffix={summary.averageScore === null ? undefined : "%"}
          icon={TrendingUp}
          tone="info"
          hint={summary.averageScore === null ? "Take a quiz to see this" : "Across all attempts"}
        />
        <StatCard
          label="Learning streak"
          value={summary.currentStreak}
          suffix={summary.currentStreak === 1 ? " day" : " days"}
          icon={Flame}
          tone="warning"
          hint={summary.currentStreak > 0 ? "Keep it going today" : "Finish a topic to start one"}
        />
      </div>
    </div>
  );
}
