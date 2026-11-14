"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  ListChecks,
  RotateCcw,
  TimerOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-states";
import { Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";
import FullPageLoader from "@/components/loading/Loading";
import { useTopics } from "@/hooks/useTopic";
import { getQuizAttempt, getQuizAttemptAnswers } from "@/services/quiz-attempt";

import { QuizHeader } from "@/components/dashboard-components/Quiz-component/quiz-header";
import { QuizResultsHero } from "@/components/dashboard-components/Quiz-component/quiz-result-hero";
import { ResultsSummaryCard } from "@/components/dashboard-components/Quiz-component/results-summary-card";
import {
  QuestionReviewCard,
  ReviewItem,
} from "@/components/dashboard-components/Quiz-component/question-review-card";

type AttemptAnswer = {
  id: string;
  is_correct: boolean;
  selected_option_id: string | null;
  question: {
    id: string;
    question: string;
    difficulty: "Easy" | "Medium" | "Hard";
    points: number;
    explanation: string | null;
    options: { id: string; option_text: string; is_correct: boolean }[];
  };
};

type AttemptData = {
  id: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  time_spent: number;
  attempt_number: number;
  completed_at: string;
  quiz: {
    id: string;
    title: string;
    passing_score: number;
    topic: { id: string; title: string; course: { id: string; title: string } };
  };
};

type Filter = "all" | "incorrect" | "correct";

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
};

export default function QuizResultsPage() {
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attempt") ?? "";
  const autoSubmitted = searchParams.get("auto") === "true";

  const reviewRef = useRef<HTMLDivElement>(null);
  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [answers, setAnswers] = useState<AttemptAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  const { topics } = useTopics(attempt?.quiz.topic.course.id ?? "");

  useEffect(() => {
    if (!attemptId) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const [attemptData, answerData] = await Promise.all([
          getQuizAttempt(attemptId),
          getQuizAttemptAnswers(attemptId),
        ]);
        setAttempt(attemptData as AttemptData);
        setAnswers(answerData as AttemptAnswer[]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [attemptId]);

  const result = useMemo(() => {
    if (!attempt) return null;
    const passingScore = attempt.quiz?.passing_score ?? 70;
    return {
      score: attempt.score,
      passingScore,
      passed: attempt.score >= passingScore,
      correctAnswers: attempt.correct_answers,
      incorrectAnswers: attempt.total_questions - attempt.correct_answers,
      earnedPoints: answers.reduce(
        (sum, a) => sum + (a.is_correct ? (a.question?.points ?? 0) : 0),
        0,
      ),
      totalPoints: answers.reduce(
        (sum, a) => sum + (a.question?.points ?? 0),
        0,
      ),
    };
  }, [attempt, answers]);

  const reviewItems: ReviewItem[] = useMemo(
    () =>
      answers.map((a, i) => ({
        id: a.question.id,
        number: i + 1,
        text: a.question.question,
        explanation: a.question.explanation,
        isCorrect: a.is_correct,
        selectedOptionId: a.selected_option_id,
        options: a.question.options.map((o) => ({
          id: o.id,
          text: o.option_text,
          isCorrect: o.is_correct,
        })),
      })),
    [answers],
  );

  const incorrectCount = reviewItems.filter((r) => !r.isCorrect).length;
  const correctCount = reviewItems.length - incorrectCount;
  const visible = reviewItems.filter((r) =>
    filter === "all"
      ? true
      : filter === "incorrect"
        ? !r.isCorrect
        : r.isCorrect,
  );

  const showReview = (f: Filter) => {
    setFilter(f);
    requestAnimationFrame(() =>
      reviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  if (loading) return <FullPageLoader />;

  if (!attempt || !result) {
    return (
      <EmptyState
        title="Result not found"
        description="We couldn't load this quiz attempt."
        action={
          <Button asChild>
            <Link href="/dashboard/courses">Back to my courses</Link>
          </Button>
        }
      />
    );
  }

  const topic = attempt.quiz.topic;
  const course = topic.course;
  const idx = topics.findIndex((t) => t.id === topic.id);
  const nextTopic =
    idx >= 0 && idx < topics.length - 1 ? topics[idx + 1] : null;
  const nextHref = nextTopic
    ? `/dashboard/topics/${nextTopic.id}`
    : `/dashboard/courses/${course.id}`;
  const nextLabel = nextTopic ? "Next topic" : "Back to course";
  const retryHref = `/dashboard/topics/${topic.id}/quiz/player`;

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: reviewItems.length },
    { key: "incorrect", label: "Incorrect", count: incorrectCount },
    { key: "correct", label: "Correct", count: correctCount },
  ];

  return (
    <Reveal on="mount" selector="[data-reveal]" stagger={0.08} className="mx-auto w-full max-w-5xl space-y-6 pb-10">
      <QuizHeader
        courseName={course.title}
        courseId={course.id}
        topicTitle={topic.title}
        topicId={topic.id}
        quizTitle={attempt.quiz.title}
      />

      {autoSubmitted && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning-soft p-4 text-[15px]"
        >
          <TimerOff className="mt-0.5 size-4 shrink-0 text-warning" />
          <p>Time ran out, so your answers were submitted automatically.</p>
        </div>
      )}

      <div data-reveal>
        <QuizResultsHero result={result} />
      </div>

      <div data-reveal>
        <ResultsSummaryCard
          timeSpent={formatDuration(attempt.time_spent)}
          attemptNumber={attempt.attempt_number}
          passingScore={result.passingScore}
        />
      </div>

      {/* The primary action depends on the outcome */}
      <div data-reveal className="flex flex-col gap-3 sm:flex-row">
        {result.passed ? (
          <>
            <Button
              variant="brand"
              size="lg"
              className="sm:flex-1"
              asChild
            >
              <Link href={nextHref}>
                {nextLabel}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="sm:flex-1" asChild>
              <Link href={retryHref}>
                <RotateCcw className="mr-2 size-4" />
                Retake quiz
              </Link>
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="brand"
              size="lg"
              className="sm:flex-1"
              asChild
            >
              <Link href={retryHref}>
                <RotateCcw className="mr-2 size-4" />
                Retake quiz
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="sm:flex-1" asChild>
              <Link href={`/dashboard/topics/${topic.id}`}>
                <BookOpen className="mr-2 size-4" />
                Review the topic
              </Link>
            </Button>
          </>
        )}
      </div>

      <section
        data-reveal
        ref={reviewRef}
        aria-labelledby="review-heading"
        className="scroll-mt-24 space-y-4 pt-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            id="review-heading"
            className="flex items-center gap-2 font-heading text-xl font-extrabold tracking-tight"
          >
            <ListChecks className="size-5 text-primary" />
            Review your answers
          </h2>

          <div
            role="tablist"
            aria-label="Filter answers"
            className="inline-flex rounded-xl bg-muted p-1"
          >
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "min-h-9 rounded-lg px-3 text-sm font-semibold outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/40",
                  filter === f.key
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}{" "}
                <span className="tabular-nums text-muted-foreground">
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {incorrectCount > 0 && filter === "all" && (
          <button
            type="button"
            onClick={() => showReview("incorrect")}
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Show only the {incorrectCount} I got wrong
          </button>
        )}

        {visible.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Nothing to show here.
          </p>
        ) : (
          <div className="space-y-3">
            {visible.map((item) => (
              <QuestionReviewCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </Reveal>
  );
}
