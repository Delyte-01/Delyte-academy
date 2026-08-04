"use client";

import { Target, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LearningObjectives({ objectives }: { objectives: string[] }) {
  if (!objectives || objectives.length === 0) return null;

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Target className="h-4 w-4" />
          </span>
          What You Will Learn
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2.5">
          {objectives.map((objective, i) => (
            <div
              key={`${i}-${objective}`}
              className="group flex items-start gap-3 rounded-xl border border-transparent p-2.5 text-sm text-muted-foreground transition-colors hover:border-border/60 hover:bg-emerald-500/[0.04]"
            >
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 transition-transform duration-200 group-hover:scale-110">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>
              <span className="leading-relaxed [&::first-letter]:capitalize">
                {objective}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
