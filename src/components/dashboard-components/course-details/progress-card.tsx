"use client";

import { CheckCircle2, Clock, Award, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgressCardProps {
  progress: number;
  completedTopics: number;
  totalTopics: number;
  certificateStatus: "locked" | "in-progress" | "ready";
  estimatedCompletion: string;
  lastActivity: string;
}

const certificateConfig = {
  locked: { label: "Locked", color: "text-muted-foreground", icon: Award },
  "in-progress": { label: "In Progress", color: "text-amber-600", icon: Award },
  ready: { label: "Ready to Claim", color: "text-emerald-600", icon: Award },
};

export function ProgressCard({
  progress,
  completedTopics,
  totalTopics,
  certificateStatus,
  estimatedCompletion,
  lastActivity,
}: ProgressCardProps) {
  const remaining = totalTopics - completedTopics;
  const cert = certificateConfig[certificateStatus];
  const CertIcon = cert.icon;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold">Course Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
        <div>
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-bold text-foreground">{progress}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Completed
            </div>
            <p className="mt-1 text-lg font-extrabold text-foreground">
              {completedTopics}
            </p>
          </div>
          <div className="rounded-xl border p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Remaining
            </div>
            <p className="mt-1 text-lg font-extrabold text-foreground">
              {remaining}
            </p>
          </div>
        </div>

        <div className="space-y-2.5 rounded-xl border p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <CertIcon className={`h-3.5 w-3.5 ${cert.color}`} />
              Certificate
            </span>
            <span className={`font-semibold ${cert.color}`}>{cert.label}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              Est. Completion
            </span>
            <span className="font-semibold text-foreground">
              {estimatedCompletion}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Last Activity
            </span>
            <span className="font-semibold text-foreground">
              {lastActivity}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
