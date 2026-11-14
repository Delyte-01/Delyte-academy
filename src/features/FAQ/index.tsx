"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionIntro } from "../section-intro";

const FAQS = [
  {
    q: "Is Delyte Academy free to use?",
    a: "Yes. Students can create an account, enroll in available courses, study topics, and take quizzes for free. We may introduce optional premium features in the future, but the current learning experience is free.",
  },
  {
    q: "What can I do on Delyte Academy right now?",
    a: "You can enroll in courses, study organized topics, take quizzes, track your progress, and receive notifications when new learning content becomes available.",
  },
  {
    q: "How does progress tracking work?",
    a: "Your quiz attempts and learning activity are saved to your account. You can monitor completed topics, quiz scores, and overall progress within each enrolled course from your dashboard.",
  },
  {
    q: "Can I practice CBT-style quizzes?",
    a: "Yes. Quizzes are delivered in a computer-based testing format with timed attempts and automatic scoring, helping you build familiarity with digital exam environments.",
  },
  {
    q: "Will I receive updates when new content is added?",
    a: "Yes. When instructors publish new courses, topics, quizzes, or announcements, enrolled students receive notifications directly in their dashboard so they don’t miss important updates.",
  },
  {
    q: "Can I use Delyte Academy on my phone?",
    a: "Absolutely. Delyte Academy is designed to work in any modern web browser, so you can study from your phone, tablet, or laptop without installing an app.",
  },
  {
    q: "Do I need an account to start learning?",
    a: "Yes. A free account is required to enroll in courses, take quizzes, save your progress, and receive personalized notifications and performance tracking.",
  },
];

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  const id = useId();
  return (
    <div
      className={cn(
        "mb-3 rounded-2xl border bg-card px-5 transition-[border-color,box-shadow] duration-300 sm:px-7",
        open ? "border-primary/40 shadow-card" : "hover:border-foreground/20",
      )}
    >
      <h3>
        <button
          type="button"
          id={`${id}-button`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex min-h-16 w-full items-center justify-between gap-6 rounded-lg py-5 text-left font-headline text-lg font-extrabold tracking-[-0.015em] text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/40 sm:text-xl"
        >
          {q}
          <span
            aria-hidden
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 motion-reduce:transition-none",
              open
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-secondary text-foreground",
            )}
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-300 motion-reduce:transition-none",
                open && "rotate-180",
              )}
            />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-5 pr-6 text-base sm:pb-6 sm:pr-14 leading-relaxed text-muted-foreground">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-16 bg-background py-16 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:gap-10 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionIntro eyebrow="FAQ" title="Questions, answered" />
            <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground sm:mt-8">
              Can’t find what you’re looking for?
            </p>
            <a
              href="mailto:delyte780@gmail.com"
              className="mt-2 inline-flex items-center gap-2 rounded-lg text-[15px] font-bold text-primary outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/40"
            >
              <Mail className="size-4" aria-hidden />
              Email us
            </a>
          </div>
        </div>

        <div className="lg:col-span-8">
          {FAQS.map((item, i) => (
            <FaqItem
              key={item.q}
              q={item.q}
              a={item.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
