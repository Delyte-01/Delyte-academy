"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Reveal } from "@/components/motion";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { Button } from "@/components/ui/button";
import { SectionIntro } from "../section-intro";

const STEPS = [
  {
    title: "Create your free account",
    body: "Sign up with your email or Google. It takes less than a minute.",
  },
  {
    title: "Enroll and study",
    body: "Pick a course and work through its topics at your own pace. Your progress is saved as you go.",
  },
  {
    title: "Test yourself and track it",
    body: "Take timed CBT quizzes, review your results and watch your progress build.",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-linked: each numeral fades from dim to full as its step crosses
  // the middle of the viewport, so the sequence reads as you move through it.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-step-number]").forEach((num) => {
        gsap.fromTo(
          num,
          { opacity: 0.22, x: -10 },
          {
            opacity: 1,
            x: 0,
            ease: "none",
            scrollTrigger: {
              trigger: num,
              start: "top 85%",
              end: "top 50%",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative isolate scroll-mt-16 overflow-hidden bg-ink py-16 sm:py-24 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionIntro
              tone="ink"
              title="From sign-up to your first quiz in three steps"
              description="No setup, nothing to install. Open it in your browser and start."
            />
            <Button
              asChild
              size="lg"
              className="mt-8 h-14 w-full rounded-full bg-pop px-8 text-base text-pop-foreground hover:bg-pop/90 sm:mt-9 sm:w-auto"
            >
              <Link href="/sign-up">
                Create free account
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>

        <Reveal
          as="ol"
          selector="[data-step]"
          stagger={0.12}
          className="lg:col-span-7"
        >
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              data-step
              className="grid grid-cols-[3.5rem_1fr] items-start gap-5 border-t border-ink-line py-7 last:border-b sm:grid-cols-[6rem_1fr] sm:gap-8 sm:py-10"
            >
              <span
                aria-hidden
                data-step-number
                className="font-headline text-5xl font-bold leading-none tracking-[-0.05em] text-pop sm:text-7xl"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-headline text-2xl font-bold tracking-[-0.02em] text-ink-foreground sm:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-ink-muted sm:text-lg">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
