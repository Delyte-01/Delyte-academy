"use client";

export function IntroductionCard({ introduction }: { introduction: string }) {
  if (!introduction) return null;

  return (
    <p className="max-w-prose text-lg leading-8 text-foreground/80 [&::first-letter]:capitalize">
      {introduction}
    </p>
  );
}
