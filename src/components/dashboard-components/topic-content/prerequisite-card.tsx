"use client";

export function PrerequisitesCard({
  prerequisites,
}: {
  prerequisites: string[];
}) {
  if (!prerequisites || prerequisites.length === 0) return null;

  return (
    <section className="space-y-2.5 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 sm:p-5">
      <h2 className="text-sm font-semibold">Before you begin</h2>
      <ul className="space-y-1.5 text-sm text-muted-foreground">
        {prerequisites.map((prereq) => (
          <li key={prereq} className="flex items-start gap-2.5">
            <span
              className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500"
              aria-hidden
            />
            <span className="[&::first-letter]:capitalize">{prereq}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
