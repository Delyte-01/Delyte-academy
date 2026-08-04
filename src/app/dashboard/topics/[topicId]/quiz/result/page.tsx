"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  RotateCcw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ListChecks,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuizHeader } from "@/components/dashboard-components/Quiz-component/quiz-header";
import { QuizResultsHero } from "@/components/dashboard-components/Quiz-component/quiz-result-hero";
import { ResultsSummaryCard } from "@/components/dashboard-components/Quiz-component/results-summary-card";
import { QuestionReviewCard } from "@/components/dashboard-components/Quiz-component/question-review-card";

import { useQuiz } from "@/hooks/useQuiz";
import { useQuestion } from "@/hooks/useQuestion";
import FullPageLoader from "@/components/loading/Loading";
import { useTopic } from "@/hooks/useTopics";
import { useCourse } from "@/hooks/useCourse";

export default function QuizResultsPage() {
  const { topicId } = useParams();
  const searchParams = useSearchParams();
  const { topic } = useTopic(topicId as string);

  const { course } = useCourse(topic?.course_id as string);
  const reviewRef = useRef<HTMLDivElement>(null);

  const quizId = searchParams.get("quizId") ?? "";
  const score = Number(searchParams.get("score") ?? 0);
  const total = Number(searchParams.get("total") ?? 0);
  const autoSubmitted = searchParams.get("auto") === "true";

  const rawAnswers = searchParams.get("answers");

  const userAnswers: Record<string, string> = useMemo(() => {
    if (!rawAnswers) return {};

    try {
      return JSON.parse(decodeURIComponent(rawAnswers));
    } catch {
      return {};
    }
  }, [rawAnswers]);

  const { quiz, loading: quizLoading } = useQuiz(topicId as string);
  const { questions, loading: questionLoading } = useQuestion(quizId);

  if (quizLoading || questionLoading) {
    return <FullPageLoader />;
  }

  if (!quiz) {
    return <div className="p-8">Quiz not found.</div>;
  }

  const passed =
    total > 0 ? (score / total) * 100 >= quiz.passing_score : false;

  const result = {
    score: total > 0 ? Math.round((score / total) * 100) : 0,
    correctAnswers: score,
    incorrectAnswers: total - score,
    totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
    passed,
    accuracy: total > 0 ? Math.round((score / total) * 100) : 0,
    timeSpent: autoSubmitted ? "Time Expired" : "Completed",
    difficulty: "Mixed",
    attemptNumber: 1,
    questionCount: total,
  };

  const reviewQuestions = questions.map((q, index) => {
    const selected = userAnswers[q.id];
    const options = q.options ?? [];

    const selectedOption = options.find((o) => o.id === selected);
    const correctOption = options.find((o) => o.is_correct);

    return {
      question: {
        id: q.id,
        number: index + 1,
        text: q.question,
        type: "Multiple Choice",
        difficulty: q.difficulty,
        points: q.points,
        options: [],
        correctAnswer: correctOption?.option_text ?? "",
        explanation: q.explanation,
      },
      userAnswer: selectedOption?.option_text ?? "No answer",
      isCorrect: selectedOption?.is_correct ?? false,
    };
  });

  const scrollToReview = () => {
    reviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <QuizHeader
        courseName={course?.title ?? ""}
        courseId={course?.id ?? ""}
        topicTitle={topic?.title ?? ""}
        topicId={topicId as string}
        quizTitle={quiz.title}
      />

      <QuizResultsHero result={result} />
      <ResultsSummaryCard
        accuracy={result.accuracy}
        timeSpent={result.timeSpent}
        difficulty={result.difficulty}
        attemptNumber={result.attemptNumber}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button size="lg" className="w-full shadow-sm sm:w-auto">
          <ArrowRight className="mr-2 h-4 w-4" />
          Continue to Next Topic
        </Button>

        <div className="grid grid-cols-3 gap-2 sm:contents">
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href={`/dashboard/topics/${topicId}/quiz/player`}>
              <RotateCcw className="mr-0 h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Retry Quiz</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={scrollToReview}
          >
            <ListChecks className="mr-0 h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Review Answers</span>
          </Button>

          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href={`/dashboard/topics/${topicId}`}>
              <BookOpen className="mr-0 h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Back to Topic</span>
            </Link>
          </Button>
        </div>
      </div>

      <div ref={reviewRef} className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
          <ListChecks className="h-5 w-5 shrink-0 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Question Review</h2>
          <Badge variant="outline" className="ml-auto font-semibold">
            {reviewQuestions.length} questions
          </Badge>
        </div>

        <div className="space-y-4">
          {reviewQuestions.map((item) => (
            <QuestionReviewCard
              key={item.question.id}
              question={item.question}
              userAnswer={item.userAnswer}
              isCorrect={item.isCorrect}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button variant="outline" asChild>
          <Link href={`/dashboard/topics/${topicId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Topic
          </Link>
        </Button>
      </div>
    </div>
  );
}
