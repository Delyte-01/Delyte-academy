"use client";

import { CircleDot, Clock, HelpCircle, Target } from "lucide-react";
import { QuizStatus } from "@/types/quiz";
import { StatStrip } from "@/components/admin/workspace/stat-strip";

interface QuizStatsProps {
  questionCount: number;
  estimatedDuration: number;
  passingScore: number;
  status: QuizStatus;
}

export function QuizStats({ questionCount, estimatedDuration, passingScore, status }: QuizStatsProps) {
  return (
    <StatStrip
      items={[
        { label: "Questions", value: questionCount, icon: HelpCircle, tone: "info" },
        { label: "Est. duration (min)", value: estimatedDuration, icon: Clock, tone: "brand" },
        { label: "Pass score (%)", value: passingScore, icon: Target, tone: "success" },
        {
          label: "Status",
          value: status === "published" ? "Published" : "Draft",
          icon: CircleDot,
          tone: status === "published" ? "success" : "warning",
        },
      ]}
    />
  );
}
