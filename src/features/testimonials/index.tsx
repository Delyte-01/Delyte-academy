"use client";

import { useRef } from "react";
import { Star, Quote } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const INK = "#0B1220";
const BLUE = "#2454FF";
const SKY = "#F8F8F8";
const SLATE = "#64748B";
const GOLD = "#F5A623";

const TESTIMONIALS = [
  {
    name: "Chiamaka O.",
    role: "WAEC Candidate",
    quote:
      "StudyHub helped me score 8 A1s in WAEC. The past questions and study guides are incredibly detailed and easy to understand.",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    name: "David A.",
    role: "JAMB Aspirant",
    quote:
      "The CBT mock tests are exactly like the real JAMB exam. I improved my score by 50+ points, genuinely life-changing for exam prep.",
    avatar:
      "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    name: "Fatima M.",
    role: "University Student",
    quote:
      "The progress tracking feature helped me see exactly where I was weak and focus my time. This platform inspired me to love learning.",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    name: "Emeka N.",
    role: "SS3 Student",
    quote:
      "I never thought I could keep up with revision on my own, but the study guides gave me the structure and confidence to take exams head-on.",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    name: "Amara L.",
    role: "NECO Candidate",
    quote:
      "The past questions bank gave me exactly what I needed to prepare properly. Thoughtful and practical from day one.",
    avatar:
      "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    name: "Kemi S.",
    role: "University 200L",
    quote:
      "This platform didn't just help me pass — it changed how I study. I actually look forward to revision now.",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
];

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const cards = gridRef.current ? Array.from(gridRef.current.children) : [];

      if (reduceMotion) {
        gsap.set([eyebrowRef.current, headingRef.current, ...cards], {
          clearProps: "all",
          opacity: 1,
        });
        return;
      }

      // Start hidden immediately (autoAlpha = opacity + visibility, avoids
      // any flash-of-content or stray-click-on-invisible-element issues).
      gsap.set([eyebrowRef.current, headingRef.current], {
        autoAlpha: 0,
        y: 24,
      });
      gsap.set(cards, { autoAlpha: 0, y: 32 });

      // Heading + eyebrow: their own dedicated reveal, staggered.
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

      // Cards: ScrollTrigger.batch gives EACH card its own trigger instead
      // of one shared trigger for the whole grid. This is what actually
      // fixes the "last row sometimes stays invisible" bug — a single
      // shared trigger can miscalculate if the grid's height changes
      // (e.g. avatar images loading late), silently leaving elements
      // below the fold stuck at their `from` state. Batching removes that
      // single point of failure entirely.
      ScrollTrigger.batch(cards, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            overwrite: true,
          }),
      });

      // Safety net: if anything is still hidden after everything has had
      // a chance to load and settle, reveal it — never leave content
      // permanently invisible due to a missed trigger.
      const revealAll = () => {
        ScrollTrigger.refresh();
        window.setTimeout(() => {
          gsap.to([eyebrowRef.current, headingRef.current, ...cards], {
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

  return (
    <section ref={sectionRef} className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-xl text-center sm:mb-16">
          <p
            ref={eyebrowRef}
            className="mb-2 text-xs font-semibold uppercase tracking-widest"
            style={{ color: BLUE }}
          >
            Testimonials
          </p>
          <h2
            ref={headingRef}
            className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl"
            style={{ color: INK }}
          >
            What our learners <span style={{ color: BLUE }}>are saying</span>
          </h2>
        </div>

        <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map(({ name, role, quote, avatar }) => (
            <div
              key={name}
              className="group relative flex flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-sm shadow-slate-900/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-900/[0.06]"
            >
              <div
                className="mb-5 flex h-9 w-9 items-center justify-center rounded-full"
                style={{ background: SKY }}
              >
                <Quote
                  className="h-4 w-4"
                  style={{ color: BLUE }}
                  fill="currentColor"
                />
              </div>

              <div className="mb-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-current"
                    style={{ color: GOLD }}
                  />
                ))}
              </div>

              <p
                className="mb-7 flex-1 text-[15px] leading-relaxed"
                style={{ color: SLATE }}
              >
                &ldquo;{quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
                <img
                  src={avatar}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-white transition-transform duration-300 group-hover:scale-105"
                />
                <div>
                  <p className="text-sm font-bold" style={{ color: INK }}>
                    {name}
                  </p>
                  <p className="text-xs" style={{ color: SLATE }}>
                    {role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
