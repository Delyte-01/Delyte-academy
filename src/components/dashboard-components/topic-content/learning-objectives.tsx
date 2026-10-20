"use client";

import { Check } from "lucide-react";

export function LearningObjectives({ objectives }: { objectives: string[] }) {
  if (!objectives || objectives.length === 0) return null;

  return (
    <section className="space-y-4 rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
      <h2 className="text-base font-semibold">What you&apos;ll learn</h2>
      <ul className="space-y-3">
        {objectives.map((objective, i) => (
          <li
            key={`${i}-${objective}`}
            className="flex items-start gap-3 text-[15px] leading-relaxed"
          >
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
              <Check className="size-3" strokeWidth={3} />
            </span>
            <span className="[&::first-letter]:capitalize">{objective}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
