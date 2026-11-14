"use client";

import { Check } from "lucide-react";

export function LearningObjectives({ objectives }: { objectives: string[] }) {
  if (!objectives || objectives.length === 0) return null;

  return (
    <section className="space-y-4 rounded-2xl bg-primary-soft/60 p-6 sm:p-7">
      <h2 className="font-heading text-lg font-extrabold tracking-tight">What you&apos;ll learn</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {objectives.map((objective, i) => (
          <li key={`${i}-${objective}`} className="flex items-start gap-3 text-[15px] leading-relaxed">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="size-3" strokeWidth={3} />
            </span>
            <span className="[&::first-letter]:capitalize">{objective}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
