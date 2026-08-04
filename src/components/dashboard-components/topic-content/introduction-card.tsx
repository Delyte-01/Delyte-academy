"use client";

import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function IntroductionCard({ introduction }: { introduction: string }) {
  if (!introduction) return null;

  return (
    <Card className="relative overflow-hidden border-primary/15 bg-gradient-to-br from-primary/[0.06] via-card to-card shadow-sm">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Info className="h-4 w-4" />
          </span>
          Introduction
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <p className="text-sm leading-relaxed text-muted-foreground first-letter:text-base first-letter:font-semibold first-letter:text-foreground [&::first-letter]:capitalize">
          {introduction}
        </p>
      </CardContent>
    </Card>
  );
}
