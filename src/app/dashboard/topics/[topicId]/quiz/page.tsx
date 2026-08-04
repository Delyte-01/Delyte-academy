"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
ArrowLeft,
ClipboardList,
Clock,
Award,
Target,
RotateCcw,
ListChecks,

} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useQuiz } from "@/hooks/useQuiz";
import { useQuestion } from "@/hooks/useQuestion";
import FullPageLoader from "@/components/loading/Loading";

export default function QuizLandingPage() {
const { topicId } = useParams();
const router = useRouter();

const { quiz, loading } = useQuiz(topicId as string);
const { questions } = useQuestion(quiz?.id ?? "");

if (loading) {
return <FullPageLoader />;
}

if (!quiz) {
return ( <div className="p-8 text-center"> <h2 className="text-xl font-semibold">No Quiz Available</h2> <p className="text-muted-foreground mt-2">
This topic does not have a quiz yet. </p> </div>
);
}

const stats = [
{
icon: ListChecks,
label: "Questions",
value: `${questions.length}`,
color: "text-blue-600",
bgColor: "bg-blue-500/10",
},
{
icon: Clock,
label: "Estimated Time",
value: `${quiz.time_limit} min`,
color: "text-emerald-600",
bgColor: "bg-emerald-500/10",
},
{
icon: Award,
label: "Total Points",
value: `${questions.reduce((sum, q) => sum + q.points, 0)}`,
color: "text-amber-600",
bgColor: "bg-amber-500/10",
},
{
icon: Target,
label: "Passing Score",
value: `${quiz.passing_score}%`,
color: "text-rose-600",
bgColor: "bg-rose-500/10",
},
];

return ( <div className="space-y-6">
{/* <QuizHeader
courseName="Course"
courseId=""
topicTitle="Topic"
topicId={topicId as string}
quizTitle={quiz.title}
/> */}


  <div className="flex justify-center">
    <div className="w-full max-w-3xl space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-emerald-900 text-white shadow-xl">
        <CardContent className="relative p-8 text-center lg:p-12">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm">
              <ClipboardList className="h-8 w-8 text-emerald-300" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">
                {quiz.title}
              </h1>

              <p className="mx-auto max-w-lg text-sm leading-relaxed text-emerald-100">
                {quiz.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {/* <Badge
                variant="outline"
                className="border-white/20 bg-white/10 text-white"
              >
                <Target className="mr-1 h-3 w-3" />
                {quiz.description}
              </Badge> */}

              <Badge
                variant="outline"
                className="border-white/20 bg-white/10 text-white"
              >
                <Clock className="mr-1 h-3 w-3" />
                {quiz.time_limit} min
              </Badge>

              <Badge
                variant="outline"
                className="border-white/20 bg-white/10 text-white"
              >
                <ListChecks className="mr-1 h-3 w-3" />
                {questions.length} Questions
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label}>
              <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bgColor}`}
                >
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>

                <p className="text-xl font-extrabold text-foreground">
                  {stat.value}
                </p>

                <p className="text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader >
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <ClipboardList className="h-5 w-5 text-primary" />
            Instructions
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground whitespace-pre-line">
            {quiz.instructions}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-3 p-4">
          <RotateCcw className="h-5 w-5 flex-shrink-0 text-primary" />

          <p className="text-sm text-muted-foreground">
            You have
            <span className="font-bold text-foreground mx-1">
              {quiz.attempt_limit}
            </span>
            attempts allowed for this quiz.
          </p>
        </CardContent>
      </Card>

      <div className="flex  gap-3 sm:flex-row sm:justify-center">
        <Button
          size="lg"
          className="flex-1 sm:flex-none"
          onClick={() =>
            router.push(`/dashboard/topics/${topicId}/quiz/player`)
          }
        >
          <ClipboardList className="mr-2 h-4 w-4" />
          Start Quiz
        </Button>

        <Button variant="outline" size="lg" asChild className="flex-1 sm:flex-none" >
          <Link href={`/dashboard/topics/${topicId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Topic
          </Link>
        </Button>
      </div>
    </div>
  </div>
</div>


);
}
