"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Bookmark, Clock, Send } from "lucide-react";
import gsap from "gsap";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useQuiz } from "@/hooks/useQuiz";
import { useQuestion } from "@/hooks/useQuestion";
import { QuizProgress } from "@/components/dashboard-components/Quiz-component/quiz-progress";
import { QuestionCard } from "@/components/dashboard-components/Quiz-component/question-card";
import { OptionCard } from "@/components/dashboard-components/Quiz-component/option-card";
import { QuizSidebar } from "@/components/dashboard-components/Quiz-component/quiz-sidebar";
import { QuizHeader } from "@/components/dashboard-components/Quiz-component/quiz-header";
import FullPageLoader from "@/components/loading/Loading";
import { QuizOption } from "@/types/quiz";
import { useCourse } from "@/hooks/useCourse";
import { useTopic } from "@/hooks/useTopics";
import { QuestionState } from "@/components/dashboard-components/Quiz-component/question-navigator";

const letters = ["A", "B", "C", "D", "E", "F"];

// Respect users who've asked their OS to reduce motion.
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function QuizPlayerPage() {
  const { topicId } = useParams();
  const router = useRouter();

  const { quiz, loading: quizLoading } = useQuiz(topicId as string);
  const { questions, loading: questionLoading } = useQuestion(quiz?.id ?? "");

  const { topic } = useTopic(topicId as string);

  const { course } = useCourse(topic?.course_id as string);

  const [current, setCurrent] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(
    new Set(),
  );

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // --- Animation refs ---
  const headerRowRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const questionSectionRef = useRef<HTMLDivElement>(null);
  const optionsListRef = useRef<HTMLDivElement>(null);
  const footerCardRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const timerBadgeRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);
  const hasAnimatedInRef = useRef(false);

  useEffect(() => {
    if (!quiz) return;

    // convert minutes to seconds
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(quiz.time_limit * 60);
  }, [quiz]);

  useEffect(() => {
    if ((timeLeft !== null && timeLeft <= 0) || submitted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev ?? 0) - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, submitted]);

  const mappedQuestions = useMemo(
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
          isCorrect: opt.is_correct ?? "",
        })),
        explanation: q.explanation,
      })),
    [questions],
  );

  const handleSubmit = (auto = false) => {
    if (submitted) return;

    setSubmitted(true);

    let score = 0;

    mappedQuestions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      const correct = q.options.find((o) => o.isCorrect)?.id;

      if (selected === correct) {
        score++;
      }
    });

    const encodedAnswers = encodeURIComponent(JSON.stringify(selectedAnswers));

    router.push(
      `/dashboard/topics/${topicId}/quiz/result?score=${score}&total=${mappedQuestions.length}&quizId=${quiz?.id}&auto=${auto}&answers=${encodedAnswers}`,
    );
  };

  useEffect(() => {
    if (timeLeft === 0 && !submitted && quiz) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleSubmit(true);
    }
  }, [timeLeft, submitted, quiz]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // --- Entrance animation: runs once, when the quiz + questions are ready ---
  useEffect(() => {
    if (quizLoading || questionLoading) return;
    if (!quiz || mappedQuestions.length === 0) return;
    if (hasAnimatedInRef.current) return;
    hasAnimatedInRef.current = true;

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(headerRowRef.current, { y: -14, opacity: 0, duration: 0.45 })
        .from(progressRef.current, { opacity: 0, duration: 0.35 }, "-=0.2")
        .from(
          questionSectionRef.current,
          { y: 14, opacity: 0, duration: 0.45 },
          "-=0.15",
        )
        .from(
          optionsListRef.current ? optionsListRef.current.children : [],
          { y: 10,  duration: 0.35, stagger: 0.06 },
          "-=0.25",
        )
        .from(
          footerCardRef.current,
          { y: 10, opacity: 0, duration: 0.35 },
          "-=0.2",
        )
        .from(
          sidebarRef.current,
          { x: 16, opacity: 0, duration: 0.45 },
          "-=0.5",
        );
    });

    return () => ctx.revert();
  }, [quizLoading, questionLoading, quiz, mappedQuestions.length]);

  // --- Transition animation: plays each time the active question changes ---
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        questionSectionRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
      );
      if (optionsListRef.current) {
        gsap.fromTo(
          optionsListRef.current.children,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out",
          },
        );
      }
    });

    return () => ctx.revert();

  }, [current]);

  // --- Subtle pulse on the timer badge once time is running low ---
  useEffect(() => {
    const isCritical = timeLeft !== null && timeLeft <= 60 && timeLeft > 0;

    if (!isCritical || submitted || prefersReducedMotion()) {
      if (timerBadgeRef.current) gsap.set(timerBadgeRef.current, { scale: 1 });
      return;
    }

    const tween = gsap.to(timerBadgeRef.current, {
      scale: 1.04,
      duration: 0.55,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      tween.kill();
      if (timerBadgeRef.current) gsap.set(timerBadgeRef.current, { scale: 1 });
    };
  }, [timeLeft !== null && timeLeft <= 60 && timeLeft > 0, submitted]);

  if (quizLoading || questionLoading) {
    return <FullPageLoader />;
  }

  if (!quiz || mappedQuestions.length === 0) {
    return <div className="p-8">No questions found.</div>;
  }

  const total = mappedQuestions.length;
  const question = mappedQuestions[current];

  const states: QuestionState[] = mappedQuestions.map((q, i) => {
    if (i === current) return "current";
    if (markedForReview.has(q.id)) return "marked";
    if (selectedAnswers[q.id]) return "answered";
    return "unanswered";
  });

  const answeredCount = Object.keys(selectedAnswers).length;
  const markedCount = markedForReview.size;
  const isTimeCritical = timeLeft !== null && timeLeft <= 60;

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: optionId,
    }));
  };

  const toggleMarkForReview = () => {
    setMarkedForReview((prev) => {
      const next = new Set(prev);

      if (next.has(question.id)) {
        next.delete(question.id);
      } else {
        next.add(question.id);
      }

      return next;
    });
  };

  const handleNavigatorSelect = (index: number) => {
    setCurrent(index);
  };

  return (
    <div className="space-y-6 pb-10">
      <QuizHeader
        courseName={course?.title ?? "Course"}
        courseId={course?.id ?? ""}
        topicTitle={topic?.title ?? "Topic"}
        topicId={topicId as string}
        quizTitle={quiz.title}
      />

      {/* Sticky title + timer strip so the countdown stays visible while scrolling on mobile */}
      <div className="sticky top-0 z-20 -mx-4 space-y-4 border-b border-border/60 bg-background/85 px-4 pb-4 pt-2 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 sm:mx-0 sm:border-none sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-0 sm:backdrop-blur-none">
        <div
          ref={headerRowRef}
          className="flex items-center justify-between gap-4"
        >
          <h1 className="truncate text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
            {quiz.title}
          </h1>

          <div
            ref={timerBadgeRef}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm transition-colors duration-300 ${
              isTimeCritical
                ? "border-red-500/60 bg-red-500/10 shadow-red-500/10"
                : "border-border bg-muted/40"
            }`}
          >
            <Clock
              className={`h-4 w-4 ${
                isTimeCritical ? "text-red-600" : "text-muted-foreground"
              }`}
            />
            <span
              className={`font-mono text-sm font-bold tabular-nums ${
                isTimeCritical ? "text-red-600" : "text-foreground"
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div ref={progressRef}>
          <QuizProgress current={current + 1} total={total} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-10 lg:items-start">
        <div className="space-y-4 lg:col-span-7">
          <div ref={questionSectionRef}>
            <QuestionCard question={question} />
          </div>

          <div ref={optionsListRef} className="space-y-3 ">
            {question.options.map((option, i) => (
              <OptionCard
                key={option.id}
                option={option}
                letter={letters[i]}
                selected={selectedAnswers[question.id] === option.id}
                onSelect={() => handleSelectOption(option.id)}
              />
            ))}
          </div>

          <Card
            ref={footerCardRef}
            className="border-border/70 shadow-sm transition-shadow duration-300 hover:shadow-md"
          >
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl transition-transform duration-150 active:scale-95"
                  disabled={current === 0}
                  onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                >
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>

                <Button
                  variant="outline"
                  className="rounded-xl transition-transform duration-150 active:scale-95"
                  onClick={toggleMarkForReview}
                >
                  <Bookmark
                    className={`mr-1.5 h-4 w-4 transition-colors duration-200 ${
                      markedForReview.has(question.id)
                        ? "fill-amber-400 text-amber-500"
                        : ""
                    }`}
                  />
                  {markedForReview.has(question.id)
                    ? "Marked"
                    : "Mark for Review"}
                </Button>
              </div>

              <div className="flex gap-2">
                {current < total - 1 ? (
                  <Button
                    className="rounded-xl transition-transform duration-150 hover:-translate-y-0.5 active:scale-95"
                    onClick={() =>
                      setCurrent((c) => Math.min(total - 1, c + 1))
                    }
                  >
                    Next
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-md shadow-emerald-600/20 transition-transform duration-150 hover:-translate-y-0.5 hover:from-emerald-500 hover:to-emerald-600 active:scale-95"
                    onClick={() => handleSubmit()}
                  >
                    <Send className="mr-1.5 h-4 w-4" />
                    Submit Quiz
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div ref={sidebarRef} className="lg:sticky lg:top-24 lg:col-span-3">
          <QuizSidebar
            total={total}
            states={states}
            current={current}
            onSelect={handleNavigatorSelect}
            answeredCount={answeredCount}
            markedCount={markedCount}
          />
        </div>
      </div>
    </div>
  );
}
