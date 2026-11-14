"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { Magnetic, Reveal, RevealText } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { HeroDemo } from "./hero-demo";
import { QuizPreview } from "./quiz-preview";

const POINTS = [
  "Free to join",
  "Phone, tablet and laptop",
  "Light and dark themes",
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-linked depth (desktop, motion-safe): the product block drifts
  // slower than the page and the copy eases back as you leave the hero.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const scrollTrigger = {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        };
        gsap.to("[data-hero-preview]", { yPercent: -6, ease: "none", scrollTrigger });
        gsap.to("[data-hero-copy]", { yPercent: 6, opacity: 0.4, ease: "none", scrollTrigger });
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-background pb-16 pt-28 sm:pb-24 sm:pt-36 lg:pb-28 lg:pt-40"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
        <div data-hero-copy className="lg:col-span-6">
          <RevealText
            as="h1"
            text={"Study smarter,\nTrack every step forward"}
            className="font-headline text-[2.5rem] font-extrabold leading-[1] tracking-[-0.035em] text-foreground min-[400px]:text-[2.85rem] sm:text-6xl lg:text-[3.7rem] xl:text-[4.5rem]"
          />

          <Reveal on="mount" delay={0.35} y={14}>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-xl sm:leading-relaxed">
              Structured courses, timed quizzes in a computer-based test format,
              and a clear record of your progress. All in your browser.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Magnetic className="max-sm:block">
                <Button
                  asChild
                  variant="brand"
                  size="lg"
                  className="h-14 w-full rounded-full px-8 text-base sm:w-auto"
                >
                  <Link href="/sign-up">
                    Create free account
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
              </Magnetic>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 w-full rounded-full border-foreground/15 px-8 text-base sm:w-auto"
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </div>

            <p className="mt-8 text-sm font-semibold text-muted-foreground">
              {POINTS.join("  ·  ")}
            </p>
          </Reveal>
        </div>

        <Reveal
          on="mount"
          delay={0.25}
          y={32}
          className="relative mx-auto w-full max-w-md lg:col-span-6 lg:max-w-[35rem] lg:justify-self-end"
        >
          <div data-hero-preview className="relative">
            {/* solid violet stage the product window sits on */}
            <div className="relative rounded-tr-[2rem] rounded-bl-[2rem] bg-primary p-2 hidden md:block">
              <div className="relative z-10">
                <div className="hidden lg:block">
                  <HeroDemo />
                </div>
                <div className="lg:hidden">
                  <QuizPreview />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
