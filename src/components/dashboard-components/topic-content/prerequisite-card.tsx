"use client";

import { GraduationCap, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PrerequisitesCard({
  prerequisites,
}: {
  prerequisites: string[];
}) {
  if (!prerequisites || prerequisites.length === 0) return null;

  return (
    <Card className="border-amber-500/20 bg-amber-500/[0.03] shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <GraduationCap className="h-4 w-4" />
          </span>
          Before You Begin
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-col gap-2">
          {prerequisites.map((prereq) => (
            <div
              key={prereq}
              className="flex w-full items-center gap-2.5 rounded-xl border border-amber-500/20 bg-card px-3.5 py-3 text-xs font-medium text-foreground transition-colors hover:bg-amber-500/[0.06] sm:text-sm"
            >
              <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-amber-600" />
              <span className="[&::first-letter]:capitalize">{prereq}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
