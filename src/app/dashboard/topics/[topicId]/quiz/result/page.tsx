"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import FullPageLoader from "@/components/loading/Loading";

import {
getQuizAttempt,
getQuizAttemptAnswers,
} from "@/services/quiz-attempt";

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
options: {
id: string;
option_text: string;
is_correct: boolean;
}[];
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
topic: {
id: string;
title: string;
course: {
id: string;
title: string;
};
};
};
};

export default function QuizResultsPage() {
const searchParams = useSearchParams();

const attemptId = searchParams.get("attempt") ?? "";
const autoSubmitted = searchParams.get("auto") === "true";

const reviewRef = useRef<HTMLDivElement>(null);

const [attempt, setAttempt] = useState<AttemptData | null>(null);
const [answers, setAnswers] = useState<AttemptAnswer[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
if (!attemptId) return;


async function loadAttempt() {
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
}

void loadAttempt();

}, [attemptId]);

const result = useMemo(() => {
if (!attempt) return null;


return {
  score: attempt.score,
  correctAnswers: attempt.correct_answers,
  incorrectAnswers: attempt.total_questions - attempt.correct_answers,
  totalPoints: answers.reduce(
    (sum, a) => sum + (a.question?.points ?? 0),
    0
  ),
  passed: attempt.score >= (attempt.quiz?.passing_score ?? 70),
  accuracy: attempt.score,
  timeSpent: autoSubmitted
    ? "Time Expired"
    : `${Math.floor(attempt.time_spent / 60)}:${String(
        attempt.time_spent % 60
      ).padStart(2, "0")}`,
  difficulty: "Mixed",
  attemptNumber: attempt.attempt_number,
  questionCount: attempt.total_questions,
};


}, [attempt, answers, autoSubmitted]);

const reviewQuestions = useMemo(
() =>
answers.map((a, index) => {
const selectedOption = a.question.options.find(
(o) => o.id === a.selected_option_id
);

    const correctOption = a.question.options.find(
      (o) => o.is_correct
    );

    return {
      question: {
        id: a.question.id,
        number: index + 1,
        text: a.question.question,
        type: "Multiple Choice",
        difficulty: a.question.difficulty,
        points: a.question.points,
        options: [],
        correctAnswer: correctOption?.option_text ?? "",
        explanation: a.question.explanation,
      },
      userAnswer: selectedOption?.option_text ?? "No answer",
      isCorrect: a.is_correct,
    };
  }),
[answers]


);

const scrollToReview = () => {
reviewRef.current?.scrollIntoView({
behavior: "smooth",
block: "start",
});
};

if (loading) {
return <FullPageLoader />;
}

if (!attempt || !result) {
return <div className="p-8">Quiz attempt not found.</div>;
}

const topic = attempt.quiz.topic;
const course = topic.course;

return ( <div className="space-y-6 sm:space-y-8"> <QuizHeader
     courseName={course.title}
     courseId={course.id}
     topicTitle={topic.title}
     topicId={topic.id}
     quizTitle={attempt.quiz.title}
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
        <Link href={`/dashboard/topics/${topic.id}/quiz/player`}>
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
        <Link href={`/dashboard/topics/${topic.id}`}>
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
      <Link href={`/dashboard/topics/${topic.id}`}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Topic
      </Link>
    </Button>
  </div>
</div>


);
}
