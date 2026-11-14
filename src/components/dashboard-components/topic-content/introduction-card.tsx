"use client";

export function IntroductionCard({ introduction }: { introduction: string }) {
  if (!introduction) return null;

  return (
    <p className="max-w-prose text-[19px] leading-8 text-foreground/85 [&::first-letter]:capitalize">
      {introduction}
    </p>
  );
}
