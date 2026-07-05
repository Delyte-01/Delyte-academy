"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const INK = "#0B1220";
const BLUE = "#2454FF";
const SKY = "#F8F8F8";
const SLATE = "#64748B";
const TINT = "#F8FAFC";

const FAQS = [
  {
    q: "Is StudyHub really free to use?",
    a: "Yes. Every course, study guide, past question, and CBT mock test is free — no card required. We may introduce optional premium features later, but the core platform stays free for students.",
  },
  {
    q: "Which exams does StudyHub cover?",
    a: "We cover WAEC, NECO, and JAMB prep, along with university-level course support. New subjects and past question sets are added regularly based on what students request most.",
  },
  {
    q: "How does progress tracking work?",
    a: "Every test you take is scored automatically and saved to your profile. You can see your score history per course, spot which topics you're weakest in, and track improvement over time.",
  },
  {
    q: "Are the CBT tests similar to the real exam?",
    a: "Yes — our CBT tests mirror the timing, format, and question style of the real JAMB and WAEC computer-based tests, so you build familiarity with the actual exam experience, not just the content.",
  },
  {
    q: "Can I access StudyHub on my phone?",
    a: "Yes, StudyHub works on any device with a browser — phone, tablet, or laptop. There's nothing to install, and your progress stays synced to your account either way.",
  },
  {
    q: "Do I need an account to start practicing?",
    a: "You can browse study guides without one, but you'll need a free account to take CBT tests and save your progress — that's how we track your scores over time.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const chevronRefs = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const items = listRef.current ? Array.from(listRef.current.children) : [];

      if (reduceMotion) {
        gsap.set([eyebrowRef.current, headingRef.current, ...items], {
          clearProps: "all",
          opacity: 1,
        });
        return;
      }

      gsap.set([eyebrowRef.current, headingRef.current], {
        autoAlpha: 0,
        y: 24,
      });
      gsap.set(items, { autoAlpha: 0, y: 24 });

      gsap.to([eyebrowRef.current, headingRef.current], {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      ScrollTrigger.batch(items, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
            overwrite: true,
          }),
      });

      const revealAll = () => {
        ScrollTrigger.refresh();
        window.setTimeout(() => {
          gsap.to([eyebrowRef.current, headingRef.current, ...items], {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            overwrite: false,
          });
        }, 1200);
      };
      window.addEventListener("load", revealAll);

      return () => window.removeEventListener("load", revealAll);
    },
    { scope: sectionRef }
  );

  const toggle = (index: number) => {
    const isOpening = openIndex !== index;
    const nextOpenIndex = isOpening ? index : null;

    // Close the currently open item (if different from the one clicked)
    if (openIndex !== null && openIndex !== index) {
      const prevEl = contentRefs.current[openIndex];
      const prevChevron = chevronRefs.current[openIndex];
      if (prevEl) {
        gsap.to(prevEl, { height: 0, duration: 0.3, ease: "power2.inOut" });
      }
      if (prevChevron) {
        gsap.to(prevChevron, {
          rotate: 0,
          duration: 0.3,
          ease: "power2.inOut",
        });
      }
    }

    const el = contentRefs.current[index];
    const chevron = chevronRefs.current[index];
    if (!el) {
      setOpenIndex(nextOpenIndex);
      return;
    }

    if (isOpening) {
      gsap.set(el, { height: "auto" });
      const targetHeight = el.offsetHeight;
      gsap.fromTo(
        el,
        { height: 0 },
        {
          height: targetHeight,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => gsap.set(el, { height: "auto" }),
        }
      );
      if (chevron)
        gsap.to(chevron, { rotate: 180, duration: 0.4, ease: "power2.out" });
    } else {
      gsap.to(el, { height: 0, duration: 0.3, ease: "power2.inOut" });
      if (chevron)
        gsap.to(chevron, { rotate: 0, duration: 0.3, ease: "power2.inOut" });
    }

    setOpenIndex(nextOpenIndex);
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28"
      style={{ background: TINT }}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-14">
          <p
            ref={eyebrowRef}
            className="mb-2 text-xs font-semibold uppercase tracking-widest"
            style={{ color: BLUE }}
          >
            FAQ
          </p>
          <h2
            ref={headingRef}
            className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl"
            style={{ color: INK }}
          >
            Your questions, <span style={{ color: BLUE }}>answered</span>
          </h2>
        </div>

        <div ref={listRef} className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm shadow-slate-900/[0.02] transition-colors"
                style={{ borderColor: isOpen ? "#BFD6FF" : undefined }}
              >
                <button
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50"
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-sm font-semibold"
                    style={{ color: INK }}
                  >
                    {faq.q}
                  </span>
                  <div
                    ref={(node) => {
                      chevronRefs.current[i] = node;
                    }}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{ background: isOpen ? BLUE : SKY }}
                  >
                    <ChevronDown
                      className="h-3.5 w-3.5"
                      style={{ color: isOpen ? "white" : BLUE }}
                    />
                  </div>
                </button>
                <div
                  ref={(node) => {
                    contentRefs.current[i] = node;
                  }}
                  style={{ height: 0, overflow: "hidden" }}
                >
                  <p
                    className="px-6 pb-5 text-sm leading-relaxed"
                    style={{ color: SLATE }}
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
