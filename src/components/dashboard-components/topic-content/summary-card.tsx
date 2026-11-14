"use client";

import { Sparkles } from "lucide-react";

export function SummaryCard({ summary }: { summary: string }) {
  if (!summary) return null;

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-card sm:p-7">
      <h2 className="mb-2 flex items-center gap-2 font-heading text-lg font-extrabold tracking-tight">
        <Sparkles className="size-4 text-primary" aria-hidden />
        Key takeaways
      </h2>
      <p className="text-[16px] leading-7 text-foreground/85">{summary}</p>
    </section>
  );
}
