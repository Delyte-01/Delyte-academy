"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { useQuiz } from "@/hooks/useQuiz";
import { useQuestion } from "@/hooks/useQuestion";
import { useCourse } from "@/hooks/useCourse";
import { useTopic } from "@/hooks/useTopics";
import { useProfile } from "@/context/profile-context";
import { QuizOption } from "@/types/quiz";
import {
  submitQuizAttempt,
  submitQuizAttemptAnswers,
} from "@/services/quiz-attempt";
import { studentNotificationService } from "@/services/student-notification";

import FullPageLoader from "@/components/loading/Loading";
import { EmptyQuizState } from "@/components/dashboard-components/Quiz-component/empty-quiz-state";
import { OptionCard } from "@/components/dashboard-components/Quiz-component/option-card";
import { QuestionCard } from "@/components/dashboard-components/Quiz-component/question-card";
import { NavItem } from "@/components/dashboard-components/Quiz-component/question-navigator";
import { QuizHeader } from "@/components/dashboard-components/Quiz-component/quiz-header";
import { QuizProgress } from "@/components/dashboard-components/Quiz-component/quiz-progress";
import { QuizSidebar } from "@/components/dashboard-components/Quiz-component/quiz-sidebar";

const LETTERS = ["A", "B", "C", "D", "E", "F"];
const STALE_AFTER_MS = 30 * 60 * 1000; // an abandoned session older than this starts fresh

type Session = {
  startedAt: number;
  answers: Record<string, string>;
  marked: string[];
  current: number;
};

const formatTime = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export default function QuizPlayerPage() {
  const { topicId } = useParams();
  const router = useRouter();
  const { profile } = useProfile();

  const { quiz, loading: quizLoading } = useQuiz(topicId as string);
  const { questions, loading: questionLoading } = useQuestion(quiz?.id ?? "");
  const { topic } = useTopic(topicId as string);
  const { course } = useCourse(topic?.course_id as string);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [nowSec, setNowSec] = useState(() => Math.floor(Date.now() / 1000));
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submittingRef = useRef(false);
  const autoTriedRef = useRef(false);
  const submitRef = useRef<(auto?: boolean) => Promise<void>>(async () => {});

  const mapped = useMemo(
    () =>
      questions.map((q, index) => ({
        id: q.id,
        number: index + 1,
        text: q.question,
        type: "Multiple Choice",
        difficulty: q.difficulty,
        points: q.points,
        options: (q.options ?? []).map((opt: QuizOption) => ({
          id: opt.id,
          text: opt.option_text ?? "",
          isCorrect: Boolean(opt.is_correct),
        })),
        explanation: q.explanation,
      })),
    [questions],
  );

  const timeLimitSec = (quiz?.time_limit ?? 0) * 60;
  const timed = timeLimitSec > 0;
  const storageKey =
    quiz && profile ? `quiz-session:${quiz.id}:${profile.id}` : null;

  /* ---- Start or resume. The clock is a start timestamp, so it survives refreshes and throttled tabs. ---- */
  useEffect(() => {
    if (!storageKey || mapped.length === 0 || startedAt !== null) return;

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const s = JSON.parse(raw) as Session;
        const expiredFor = timed
          ? Date.now() - (s.startedAt + timeLimitSec * 1000)
          : 0;
        const tooOld = timed
          ? expiredFor > STALE_AFTER_MS
          : Date.now() - s.startedAt > 24 * 60 * 60 * 1000;

        if (!tooOld) {
          const ids = new Set(mapped.map((q) => q.id));
          setAnswers(
            Object.fromEntries(
              Object.entries(s.answers ?? {}).filter(([id]) => ids.has(id)),
            ),
          );
          setMarked(new Set((s.marked ?? []).filter((id) => ids.has(id))));
          setCurrent(Math.min(Math.max(s.current ?? 0, 0), mapped.length - 1));
          setStartedAt(s.startedAt);
          toast.message("Welcome back", {
            description: timed
              ? "Your answers were restored. The timer kept running."
              : "Your answers were restored.",
          });
          return;
        }
        localStorage.removeItem(storageKey);
      }
    } catch {
      /* storage unavailable: start a plain session */
    }
    setStartedAt(Date.now());
  }, [storageKey, mapped, startedAt, timed, timeLimitSec]);

  /* ---- Save progress on every change ---- */
  useEffect(() => {
    if (!storageKey || startedAt === null || submittingRef.current) return;
    try {
      const session: Session = {
        startedAt,
        answers,
        marked: [...marked],
        current,
      };
      localStorage.setItem(storageKey, JSON.stringify(session));
    } catch {
      /* ignore */
    }
  }, [storageKey, startedAt, answers, marked, current]);

  /* ---- Clock ---- */
  useEffect(() => {
    if (!timed || startedAt === null) return;
    const tick = () => setNowSec(Math.floor(Date.now() / 1000));
    tick();
    const id = setInterval(tick, 500);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [timed, startedAt]);

  const timeLeft =
    timed && startedAt !== null
      ? Math.max(
          0,
          timeLimitSec - Math.max(0, nowSec - Math.floor(startedAt / 1000)),
        )
      : null;

  /* ---- Submit ---- */
  const handleSubmit = async (auto = false) => {
    if (
      submittingRef.current ||
      !quiz ||
      !profile ||
      mapped.length === 0 ||
      startedAt === null
    )
      return;

    submittingRef.current = true;
    setSubmitting(true);
    setConfirmOpen(false);

    let correctAnswers = 0;
    const answerRows = mapped.map((q) => {
      const selected = answers[q.id] ?? null;
      const correctId = q.options.find((o) => o.isCorrect)?.id ?? null;
      const isCorrect = selected !== null && selected === correctId;
      if (isCorrect) correctAnswers++;
      return { questionId: q.id, selectedOptionId: selected, isCorrect };
    });

    const score = Math.round((correctAnswers / mapped.length) * 100);
    const elapsed = Math.round((Date.now() - startedAt) / 1000);
    const timeSpent = timed ? Math.min(timeLimitSec, elapsed) : elapsed;

    try {
      const attempt = await submitQuizAttempt({
        quizId: quiz.id,
        studentId: profile.id,
        score,
        correctAnswers,
        totalQuestions: mapped.length,
        timeSpent,
        attemptNumber: 1, // TODO: derive from the student's previous attempts
      });
      await submitQuizAttemptAnswers(attempt.id, answerRows);

      try {
        await studentNotificationService.createStudentNotification({
          studentId: profile.id,
          type: "quiz_result",
          title: "Quiz completed",
          message: `You scored ${score}% on ${quiz.title}.`,
          courseId: course?.id,
          link: `/dashboard/courses/${course?.id}`,
        });
      } catch (error) {
        console.error(error); // a failed notification must not block the result
      }

      if (storageKey) localStorage.removeItem(storageKey);
      router.push(
        `/dashboard/topics/${topicId}/quiz/result?attempt=${attempt.id}&auto=${auto}`,
      );
    } catch (error) {
      console.error(error);
      submittingRef.current = false;
      setSubmitting(false);
      toast.error(
        "Couldn't submit your quiz. Your answers are saved, so try again.",
      );
    }
  };

  useEffect(() => {
    submitRef.current = handleSubmit;
  });

  // Time is up: submit once automatically. If it fails the student can retry by hand.
  useEffect(() => {
    if (timeLeft === 0 && startedAt !== null && !autoTriedRef.current) {
      autoTriedRef.current = true;
      void submitRef.current(true);
    }
  }, [timeLeft, startedAt]);

  /* ---- Keyboard: A–F answer, ← → move, M mark ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (confirmOpen || submitting || e.metaKey || e.ctrlKey || e.altKey)
        return;
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable)
      )
        return;

      const q = mapped[current];
      if (!q) return;
      const key = e.key.toLowerCase();
      const idx = LETTERS.findIndex((l) => l.toLowerCase() === key);

      if (idx >= 0 && idx < q.options.length) {
        setAnswers((prev) => ({ ...prev, [q.id]: q.options[idx].id }));
      } else if (e.key === "ArrowRight") {
        setCurrent((c) => Math.min(mapped.length - 1, c + 1));
      } else if (e.key === "ArrowLeft") {
        setCurrent((c) => Math.max(0, c - 1));
      } else if (key === "m") {
        setMarked((prev) => {
          const next = new Set(prev);
          if (next.has(q.id)) next.delete(q.id);
          else next.add(q.id);
          return next;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmOpen, submitting, mapped, current]);

  /* ---- Render ---- */
  if (quizLoading || questionLoading) return <FullPageLoader />;
  if (!quiz || mapped.length === 0)
    return <EmptyQuizState topicId={topicId as string} />;
  if (startedAt === null) return <FullPageLoader />;

  const total = mapped.length;
  const question = mapped[current];
  const isLast = current === total - 1;

  const items: NavItem[] = mapped.map((q) => ({
    answered: Boolean(answers[q.id]),
    marked: marked.has(q.id),
  }));
  const answeredCount = items.filter((i) => i.answered).length;
  const markedCount = items.filter((i) => i.marked).length;
  const unansweredCount = total - answeredCount;
  const firstUnanswered = items.findIndex((i) => !i.answered);

  const critical = timeLeft !== null && timeLeft <= 60;
  const announce =
    timeLeft === 300
      ? "5 minutes remaining"
      : timeLeft === 60
        ? "1 minute remaining"
        : "";

  const select = (optionId: string) =>
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  const toggleMark = () =>
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(question.id)) next.delete(question.id);
      else next.add(question.id);
      return next;
    });
  const next = () => setCurrent((c) => Math.min(total - 1, c + 1));
  const prev = () => setCurrent((c) => Math.max(0, c - 1));

  return (
    <div className="mx-auto w-full max-w-6xl pb-28 lg:pb-10">
      <QuizHeader
        courseName={course?.title ?? "Course"}
        courseId={course?.id ?? ""}
        topicTitle={topic?.title ?? "Topic"}
        topicId={topicId as string}
        quizTitle={quiz.title}
      />

      {/* Title, timer and progress stay in view while scrolling */}
      <div className="sticky top-0 z-20 -mx-4 mt-4 space-y-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
        <div className="flex items-center justify-between gap-4">
          <h1 className="truncate text-base font-semibold sm:text-lg">
            {quiz.title}
          </h1>

          {timeLeft !== null && (
            <div
              role="timer"
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 transition-colors",
                critical
                  ? "border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-400"
                  : "border-border bg-muted/40",
              )}
            >
              <Clock
                className={cn(
                  "size-4",
                  critical && "motion-safe:animate-pulse",
                )}
              />
              <span className="font-mono text-sm font-semibold tabular-nums">
                {formatTime(timeLeft)}
              </span>
              <span className="sr-only" aria-live="polite">
                {announce}
              </span>
            </div>
          )}
        </div>
        <QuizProgress
          current={current + 1}
          total={total}
          answered={answeredCount}
        />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <div className="space-y-6">
          <QuestionCard
            question={question}
            marked={marked.has(question.id)}
            onToggleMark={toggleMark}
          />

          <div
            role="radiogroup"
            aria-labelledby="current-question"
            className="space-y-3"
          >
            {question.options.map((option, i) => (
              <OptionCard
                key={option.id}
                option={option}
                letter={LETTERS[i]}
                selected={answers[question.id] === option.id}
                onSelect={() => select(option.id)}
              />
            ))}
          </div>

          <div className="hidden items-center justify-between lg:flex">
            <Button variant="outline" onClick={prev} disabled={current === 0}>
              <ArrowLeft className="mr-2 size-4" />
              Previous
            </Button>
            {isLast ? (
              <Button
                className="bg-emerald-600 text-white hover:bg-emerald-500"
                onClick={() => setConfirmOpen(true)}
                disabled={submitting}
              >
                <Send className="mr-2 size-4" />
                {submitting ? "Submitting…" : "Finish quiz"}
              </Button>
            ) : (
              <Button onClick={next}>
                Next
                <ArrowRight className="ml-2 size-4" />
              </Button>
            )}
          </div>

          <p className="hidden text-xs text-muted-foreground lg:block">
            Shortcuts: {LETTERS[0]}–{LETTERS[question.options.length - 1]} to
            answer, ← → to move, M to mark.
          </p>
        </div>

        <QuizSidebar
          total={total}
          items={items}
          current={current}
          onSelect={setCurrent}
          answeredCount={answeredCount}
          markedCount={markedCount}
          onPrev={prev}
          onNext={next}
          onFinish={() => setConfirmOpen(true)}
          isLast={isLast}
          busy={submitting}
        />
      </div>

      <Sheet open={confirmOpen} onOpenChange={setConfirmOpen}>
        <SheetContent
          side="bottom"
          className="mx-auto w-full max-w-md rounded-t-2xl px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        >
          <SheetHeader className="px-0 text-left">
            <SheetTitle>Submit your quiz?</SheetTitle>
            <SheetDescription>
              {unansweredCount > 0
                ? `${unansweredCount} ${unansweredCount === 1 ? "question is" : "questions are"} still unanswered.`
                : "You've answered every question."}
              {markedCount > 0 && ` ${markedCount} marked for review.`}
              {" You can't change answers after submitting."}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-5 flex flex-col gap-2">
            <Button
              size="lg"
              className="bg-emerald-600 text-white hover:bg-emerald-500"
              onClick={() => handleSubmit()}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit quiz"}
            </Button>
            {unansweredCount > 0 && firstUnanswered >= 0 && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setCurrent(firstUnanswered);
                  setConfirmOpen(false);
                }}
              >
                Go to first unanswered
              </Button>
            )}
            <Button
              size="lg"
              variant="ghost"
              onClick={() => setConfirmOpen(false)}
            >
              Keep working
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
