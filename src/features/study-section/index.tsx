import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { PEXELS } from "@/lib/pexels";
import { SectionIntro } from "../section-intro";

const BENEFITS = [
  {
    title: "Study anywhere",
    body: "Open it on your phone, tablet or laptop. Nothing to install.",
  },
  {
    title: "Practice like exam day",
    body: "Timed CBT quizzes get you comfortable before it counts.",
  },
  {
    title: "Keep a steady rhythm",
    body: "Streaks and a weekly goal make it easier to show up every day.",
  },
];

/**
 * Landing section between "Features" and "How it works": a photo of students
 * studying plus three short benefits. Server component; the photo comes from
 * Pexels (see `@/lib/pexels`).
 */
export function StudySection() {
  return (
    <section
      id="study"
      className="scroll-mt-16 bg-tint py-16 sm:py-24 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        {/* copy */}
        <div className="lg:col-span-6">
          <SectionIntro
            title="Built for the way students really study"
            description="Short sessions, steady progress and a place to practice before the real thing."
          />

          <Reveal
            as="ul"
            selector="[data-benefit]"
            stagger={0.1}
            className="mt-8 sm:mt-10"
          >
            {BENEFITS.map(({ title, body }) => (
              <li
                key={title}
                data-benefit
                className="border-t border-foreground/15 py-5 first:border-t-0 first:pt-0"
              >
                <h3 className="font-headline text-xl font-extrabold tracking-[-0.015em] text-foreground">
                  {title}
                </h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </li>
            ))}
          </Reveal>

          <Button
            asChild
            variant="brand"
            size="lg"
            className="mt-8 w-full sm:mt-10 sm:w-auto"
          >
            <Link href="/sign-up">
              Start studying free
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>

        {/* photo */}
        <Reveal y={28} className="relative lg:col-span-6">
          <div className="relative hidden rounded-tr-[2rem] rounded-bl-[2rem] bg-primary p-2 md:block">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-primary p-3 sm:aspect-[3/2] lg:aspect-[4/4.2]">
              <div className="relative h-full w-full overflow-hidden rounded-2xl">
                <Image
                  src={
                    "https://res.cloudinary.com/dk5mfu099/image/upload/v1794657099/wmremove-transformed_5_iqo2ox.jpg"
                  }
                  alt={PEXELS.studyGroup.alt}
                  fill
                  sizes="(min-width: 1024px) 560px, (min-width: 640px) 640px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
