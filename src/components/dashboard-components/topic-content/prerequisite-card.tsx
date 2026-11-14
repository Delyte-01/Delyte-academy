"use client";

import { Info } from "lucide-react";

export function PrerequisitesCard({ prerequisites }: { prerequisites: string[] }) {
  if (!prerequisites || prerequisites.length === 0) return null;

  return (
    <section className="flex items-start gap-3.5 rounded-xl border border-warning/30 bg-warning-soft/60 p-4 sm:p-5">
      <Info className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
      <div className="space-y-2">
        <h2 className="text-[15px] font-bold">Before you begin</h2>
        <ul className="space-y-1.5 text-[15px] text-muted-foreground">
          {prerequisites.map((prereq) => (
            <li key={prereq} className="[&::first-letter]:capitalize">
              {prereq}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
