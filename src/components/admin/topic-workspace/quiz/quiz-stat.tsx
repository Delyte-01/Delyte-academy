"use client";

import { QuizStatus } from "@/types/quiz";
import { HelpCircle, Clock, Target, CircleDot } from "lucide-react";

interface QuizStatsProps {
  questionCount: number;
  estimatedDuration: number;
  passingScore: number;
  status: QuizStatus;
}

export function QuizStats({
  questionCount,
  estimatedDuration,
  passingScore,
  status,
}: QuizStatsProps) {


  const stats = [
    {
      label: "Questions",
      value: String(questionCount),
      icon: HelpCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Duration",
      value: `${estimatedDuration} min`,
      icon: Clock,
      color: "text-violet-600",
      bgColor: "bg-violet-500/10",
    },
    {
      label: "Pass Score",
      value: `${passingScore}%`,
      icon: Target,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Status",
      value: status,
      icon: CircleDot,
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, color, bgColor }) => (
        <div
          key={label}
          className="flex flex-col gap-2 rounded-2xl border bg-card p-4 transition-shadow hover:shadow-sm"
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${bgColor}`}
          >
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <div>
            <p className="text-xl font-extrabold tracking-tight text-foreground">
              {value}
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
