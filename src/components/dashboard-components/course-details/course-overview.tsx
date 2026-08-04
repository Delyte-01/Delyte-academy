"use client";

import { BookOpen, CheckCircle2, GraduationCap, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseOverviewProps {
  description: string;
  learningOutcomes: string[];
  prerequisites: string[];
}

export function CourseOverview({
  description,
  learningOutcomes,
  prerequisites,
}: CourseOverviewProps) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen className="h-4 w-4" />
          </span>
          About this Course
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {description && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}

        {learningOutcomes.length > 0 && (
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
              <Target className="h-4 w-4 text-primary" />
              Learning Outcomes
            </h3>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {learningOutcomes.map((outcome) => (
                <div
                  key={outcome}
                  className="flex items-start gap-2.5 rounded-xl border border-transparent p-2 text-sm text-muted-foreground transition-colors hover:border-border/60 hover:bg-emerald-500/[0.04]"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {prerequisites.length > 0 && (
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
              <GraduationCap className="h-4 w-4 text-amber-600" />
              Prerequisites
            </h3>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {prerequisites.map((prereq) => (
                <div
                  key={prereq}
                  className="flex items-start gap-2.5 rounded-xl border border-amber-500/15 bg-amber-500/[0.03] p-2.5 text-sm text-muted-foreground transition-colors hover:bg-amber-500/[0.07]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                  <span>{prereq}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
