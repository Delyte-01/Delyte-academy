"use client";

export function SummaryCard({ summary }: { summary: string }) {
  if (!summary) return null;

  return (
    <section className="rounded-r-2xl border-l-4 border-emerald-500 bg-emerald-500/5 p-5 sm:p-6">
      <h2 className="mb-2 text-base font-semibold">Summary</h2>
      <p className="text-[15px] leading-7 text-foreground/80">{summary}</p>
    </section>
  );
}
