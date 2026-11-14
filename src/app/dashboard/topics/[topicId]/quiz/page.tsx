"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Award,
  ClipboardList,
  Clock,
  ListChecks,
  Play,
  RotateCcw,
  Target,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/motion";
import { EmptyQuizState } from "@/components/dashboard-components/Quiz-component/empty-quiz-state";
import { useQuiz } from "@/hooks/useQuiz";
import { useQuestion } from "@/hooks/useQuestion";

interface Fact {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: string;
}

export default function QuizLandingPage() {
  const { topicId } = useParams();
  const { quiz, loading } = useQuiz(topicId as string);
  const { questions, loading: questionsLoading } = useQuestion(quiz?.id ?? "");

  if (loading || (quiz && questionsLoading)) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-8" role="status" aria-label="Loading quiz">
        <Skeleton className="h-4 w-40" />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-12 w-44 rounded-xl" />
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!quiz) return <EmptyQuizState topicId={topicId as string} />;

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const timed = quiz.time_limit > 0;
  const playerHref = `/dashboard/topics/${topicId}/quiz/player`;
  const topicHref = `/dashboard/topics/${topicId}`;

  const facts: Fact[] = [
    {
      icon: ListChecks,
      label: "Questions",
      value: `${questions.length}`,
      tone: "bg-info-soft text-info",
    },
    {
      icon: Clock,
      label: "Time limit",
      value: timed ? `${quiz.time_limit} min` : "No time limit",
      tone: "bg-success-soft text-success",
    },
    {
      icon: Award,
      label: "Total points",
      value: `${totalPoints}`,
      tone: "bg-warning-soft text-warning",
    },
    {
      icon: Target,
      label: "Pass mark",
      value: `${quiz.passing_score}%`,
      tone: "bg-primary-soft text-primary-soft-foreground",
    },
  ];

  const shortcuts: { keys: string[]; label: string }[] = [
    { keys: ["A", "–", "D"], label: "Choose an answer" },
    { keys: ["←", "→"], label: "Previous / next question" },
    { keys: ["M"], label: "Mark for review" },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 pb-10">
      <Link
        href={topicHref}
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to topic
      </Link>

      <Reveal on="mount" selector="[data-reveal]" stagger={0.09} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-12">
        <div className="space-y-8">
          <div data-reveal className="space-y-5">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-soft-foreground">
              <ClipboardList className="size-3.5" aria-hidden />
              Quiz
            </p>
            <h1 className="text-balance font-heading text-[34px] font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              {quiz.title}
            </h1>
            {quiz.description && (
              <p className="max-w-xl text-[17px] leading-relaxed text-muted-foreground">
                {quiz.description}
              </p>
            )}
          </div>

          <div data-reveal className="flex flex-col gap-3 sm:flex-row">
            <Button variant="brand" size="lg" className="sm:min-w-44" asChild>
              <Link href={playerHref}>
                <Play className="fill-current" />
                Start quiz
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={topicHref}>Review the lesson first</Link>
            </Button>
          </div>

          {quiz.instructions && quiz.instructions.trim() && (
            <section data-reveal aria-labelledby="instructions-heading" className="space-y-3 border-t pt-8">
              <h2 id="instructions-heading" className="font-heading text-lg font-extrabold tracking-tight">
                Instructions
              </h2>
              <p className="whitespace-pre-line text-[15px] leading-relaxed text-muted-foreground">
                {quiz.instructions}
              </p>
            </section>
          )}
        </div>

        <aside data-reveal className="space-y-4 lg:sticky lg:top-24">
          <section aria-label="Quiz details" className="rounded-2xl border bg-card p-2 shadow-card">
            <dl className="divide-y">
              {facts.map(({ icon: Icon, label, value, tone }) => (
                <div key={label} className="flex items-center gap-3.5 px-3 py-3.5">
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <dt className="flex-1 text-[15px] font-semibold text-muted-foreground">{label}</dt>
                  <dd className="font-heading text-lg font-extrabold tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="flex items-start gap-3 rounded-xl bg-primary-soft p-4 text-[15px] text-primary-soft-foreground">
            <RotateCcw className="mt-0.5 size-5 shrink-0" aria-hidden />
            <span>
              <span className="font-bold">{quiz.attempt_limit}</span>{" "}
              {quiz.attempt_limit === 1 ? "attempt" : "attempts"} allowed for this quiz.
            </span>
          </p>

          <section aria-label="Keyboard shortcuts" className="hidden space-y-3 rounded-xl border p-4 lg:block">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Keyboard shortcuts
            </h2>
            <ul className="space-y-2.5">
              {shortcuts.map((s) => (
                <li key={s.label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="flex items-center gap-1">
                    {s.keys.map((k, i) => (
                      <Kbd key={i}>{k}</Kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </Reveal>
    </div>
  );
}
