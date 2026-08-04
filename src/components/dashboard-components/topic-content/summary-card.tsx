"use client";

import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SummaryCard({ summary }: { summary: string }) {
  if (!summary) return null;

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/[0.07] via-card to-emerald-500/[0.04] shadow-sm">
      <div className="pointer-events-none absolute -left-8 -bottom-8 h-36 w-36 rounded-full bg-emerald-500/10 blur-3xl" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {summary}
        </p>
      </CardContent>
    </Card>
  );
}
