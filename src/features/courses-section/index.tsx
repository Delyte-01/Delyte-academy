"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Star, Video, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const INK = "#0B1220";
const BLUE = "#2454FF";
const SKY = "#EEF4FF";
const SLATE = "#64748B";

// ── Custom easing ──────────────────────────────────────────────
// Hand-written cubic-bezier solver (Newton-Raphson), so these are real
// custom curves rather than GSAP's named presets. GSAP accepts any
// function(progress) => easedProgress as an `ease`, no plugin required.
function cubicBezier(mX1: number, mY1: number, mX2: number, mY2: number) {
  const A = (a1: number, a2: number) => 1 - 3 * a2 + 3 * a1;
  const B = (a1: number, a2: number) => 3 * a2 - 6 * a1;
  const C = (a1: number) => 3 * a1;
  const calcBezier = (t: number, a1: number, a2: number) =>
    ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t;
  const calcSlope = (t: number, a1: number, a2: number) =>
    3 * A(a1, a2) * t * t + 2 * B(a1, a2) * t + C(a1);
  const getTForX = (x: number) => {
    let guess = x;
    for (let i = 0; i < 4; i++) {
      const slope = calcSlope(guess, mX1, mX2);
      if (slope === 0) return guess;
      guess -= (calcBezier(guess, mX1, mX2) - x) / slope;
    }
    return guess;
  };
  return (x: number) => calcBezier(getTForX(x), mY1, mY2);
}

// A long, confident deceleration — the page's signature "arrival" feel.
const EASE_PREMIUM = cubicBezier(0.16, 1, 0.3, 1);
// A tighter in-out for quick state changes like tab switches.
const EASE_SNAP = cubicBezier(0.65, 0, 0.35, 1);

// ── Data ───────────────────────────────────────────────────────
type Course = {
  title: string;
  image: string;
  category: string;
  badge: string;
  rating: number;
  reviews: number;
  videos: number;
  price: number;
  discountPercent: number;
};

const BADGE_PALETTE = [
  { bg: "#FFF3D6", text: "#8A5A00" }, // amber
  { bg: "#E3F6EC", text: "#0F6B45" }, // mint
  { bg: "#FCE7EF", text: "#A31258" }, // rose
  { bg: "#E6F0FF", text: "#1A47C4" }, // sky
  { bg: "#FFE9DE", text: "#B14A16" }, // peach
];

export function CoursesSection({ courses }: { courses: Course[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLAnchorElement>(null);

  const categories = useMemo(
    () => [
      "All courses",
      ...Array.from(new Set(courses.map((c) => c.category))),
    ],
    [courses]
  );
  const [activeCategory, setActiveCategory] = useState("All courses");
  const filtered = useMemo(
    () =>
      activeCategory === "All courses"
        ? courses
        : courses.filter((c) => c.category === activeCategory),
    [courses, activeCategory]
  );

  // ── Entrance: header + first grid paint ──
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            ".courses-eyebrow",
            ".courses-line",
            ".courses-copy",
            ".courses-tabs",
            ".course-card",
          ],
          { clearProps: "all", opacity: 1 }
        );
        gsap.set(".course-card-image", { clipPath: "inset(0% 0% 0% 0%)" });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".courses-line", { yPercent: 110, opacity: 0 });
        gsap.set([".courses-eyebrow", ".courses-copy", ".courses-tabs"], {
          y: 16,
          opacity: 0,
        });

        const headerTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
        });

        headerTl
          .to(".courses-eyebrow", {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: EASE_PREMIUM,
          })
          .to(
            ".courses-line",
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.9,
              stagger: 0.1,
              ease: EASE_PREMIUM,
            },
            "-=0.3"
          )
          .to(
            ".courses-copy",
            { y: 0, opacity: 1, duration: 0.6, ease: EASE_PREMIUM },
            "-=0.55"
          )
          .to(
            ".courses-tabs",
            { y: 0, opacity: 1, duration: 0.5, ease: EASE_PREMIUM },
            "-=0.4"
          );

        const cards = gsap.utils.toArray<HTMLElement>(".course-card");
        gsap.set(cards, { y: 40, opacity: 0 });
        gsap.set(".course-card-image", {
          clipPath: "inset(100% 0% 0% 0%)",
          scale: 1.08,
        });
        gsap.set(".course-badge", { scale: 0, opacity: 0 });

        ScrollTrigger.batch(cards, {
          start: "top 88%",
          once: true,
          onEnter: (batch) => {
            batch.forEach((card, idx) => {
              const img = card.querySelector(".course-card-image");
              const badge = card.querySelector(".course-badge");
              const tl = gsap.timeline({ delay: idx * 0.08 });
              tl.to(card, {
                y: 0,
                opacity: 1,
                duration: 0.7,
                ease: EASE_PREMIUM,
              })
                .to(
                  img,
                  {
                    clipPath: "inset(0% 0% 0% 0%)",
                    scale: 1,
                    duration: 1.1,
                    ease: EASE_PREMIUM,
                  },
                  "-=0.55"
                )
                .to(
                  badge,
                  {
                    scale: 1,
                    opacity: 1,
                    duration: 0.4,
                    ease: "back.out(1.7)",
                  },
                  "-=0.7"
                );
            });
          },
        });

        // Hover: quiet tilt + image parallax
        const cleanups: Array<() => void> = [];
        cards.forEach((card) => {
          const img = card.querySelector<HTMLElement>(".course-card-image");
          const arrow = card.querySelector<HTMLElement>(".course-arrow");
          const btn = card.querySelector<HTMLElement>(".course-btn");
          if (!img) return;

          const rotateX = gsap.quickTo(card, "rotateX", {
            duration: 0.5,
            ease: "power3",
          });
          const rotateY = gsap.quickTo(card, "rotateY", {
            duration: 0.5,
            ease: "power3",
          });
          const imgY = gsap.quickTo(img, "y", {
            duration: 0.6,
            ease: "power3",
          });

          const onMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            rotateY(px * 4);
            rotateX(-py * 4);
            imgY(py * -8);
          };
          const onEnter = () => {
            gsap.to(card, { y: -6, duration: 0.4, ease: EASE_PREMIUM });
            if (arrow)
              gsap.to(arrow, {
                x: 0,
                opacity: 1,
                duration: 0.35,
                ease: EASE_PREMIUM,
              });
            if (btn)
              gsap.to(btn, {
                backgroundColor: BLUE,
                color: "#FFFFFF",
                borderColor: BLUE,
                duration: 0.3,
                ease: EASE_SNAP,
              });
          };
          const onLeave = () => {
            rotateX(0);
            rotateY(0);
            imgY(0);
            gsap.to(card, { y: 0, duration: 0.5, ease: EASE_PREMIUM });
            if (arrow)
              gsap.to(arrow, {
                x: -6,
                opacity: 0,
                duration: 0.3,
                ease: EASE_PREMIUM,
              });
            if (btn)
              gsap.to(btn, {
                backgroundColor: "transparent",
                color: BLUE,
                borderColor: BLUE,
                duration: 0.3,
                ease: EASE_SNAP,
              });
          };

          card.addEventListener("mousemove", onMove);
          card.addEventListener("mouseenter", onEnter);
          card.addEventListener("mouseleave", onLeave);
          cleanups.push(() => {
            card.removeEventListener("mousemove", onMove);
            card.removeEventListener("mouseenter", onEnter);
            card.removeEventListener("mouseleave", onLeave);
          });
        });

        // Magnetic "Load more"
        const loadBtn = loadMoreRef.current;
        if (loadBtn) {
          const xTo = gsap.quickTo(loadBtn, "x", {
            duration: 0.4,
            ease: "power3",
          });
          const yTo = gsap.quickTo(loadBtn, "y", {
            duration: 0.4,
            ease: "power3",
          });
          const onBtnMove = (e: MouseEvent) => {
            const rect = loadBtn.getBoundingClientRect();
            xTo((e.clientX - rect.left - rect.width / 2) * 0.2);
            yTo((e.clientY - rect.top - rect.height / 2) * 0.3);
          };
          const onBtnLeave = () => {
            xTo(0);
            yTo(0);
          };
          loadBtn.addEventListener("mousemove", onBtnMove);
          loadBtn.addEventListener("mouseleave", onBtnLeave);
          cleanups.push(() => {
            loadBtn.removeEventListener("mousemove", onBtnMove);
            loadBtn.removeEventListener("mouseleave", onBtnLeave);
          });
        }

        return () => cleanups.forEach((fn) => fn());
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  // ── Tab switch: crossfade + re-stagger the grid ──
  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".course-card");
      if (!cards.length) return;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: EASE_SNAP }
      );
    },
    { dependencies: [activeCategory], scope: gridRef }
  );

  const handleTabClick = (cat: string) => {
    if (cat === activeCategory) return;
    const cards = gsap.utils.toArray<HTMLElement>(".course-card");
    gsap.to(cards, {
      opacity: 0,
      y: -10,
      duration: 0.25,
      ease: EASE_SNAP,
      stagger: 0.02,
      onComplete: () => setActiveCategory(cat),
    });
  };

  return (
    <section ref={sectionRef} className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Header: centered ── */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div
            className="courses-eyebrow mb-4 inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold"
            style={{ background: SKY, borderColor: "#BFD6FF", color: BLUE }}
          >
            Our courses
          </div>
          <h2
            className="text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl"
            style={{ color: INK }}
          >
            <span className="block overflow-hidden">
              <span className="courses-line inline-block">
                Courses designed
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="courses-line inline-block">
                for <span style={{ color: BLUE }}>success</span>
              </span>
            </span>
          </h2>
          <p
            className="courses-copy mt-4 text-sm leading-relaxed sm:text-base"
            style={{ color: SLATE }}
          >
            Start your journey with courses that build real-world skills and
            knowledge. Get access to high-quality courses taught by industry
            professionals.
          </p>
        </div>

        {/* ── Filter tabs ── */}
        <div className="courses-tabs mb-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-slate-100 pb-4">
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => handleTabClick(cat)}
                className="relative pb-3 text-sm font-semibold transition-colors duration-200"
                style={{ color: isActive ? BLUE : SLATE }}
              >
                {cat}
                {isActive && (
                  <span
                    className="absolute -bottom-[1px] left-0 h-[2px] w-full rounded-full"
                    style={{ background: BLUE }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Grid ── */}
        <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course, i) => {
            const palette = BADGE_PALETTE[i % BADGE_PALETTE.length];
            return (
              <Link
                href="/dashboard/courses/math-101"
                key={course.title}
                className="course-card group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-900/[0.03] transition-shadow duration-300 hover:shadow-2xl hover:shadow-slate-900/10"
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                }}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="course-card-image h-full w-full object-cover"
                    style={{ willChange: "transform" }}
                  />
                  <div className="absolute right-3 top-3">
                    <span
                      className="course-badge inline-block rounded-full px-3 py-1 text-xs font-bold"
                      style={{ background: palette.bg, color: palette.text }}
                    >
                      {course.badge}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div
                    className="mb-3 flex items-center justify-between text-xs font-medium"
                    style={{ color: SLATE }}
                  >
                    <span>{course.category}</span>
                    <span className="flex items-center gap-1.5">
                      <Video className="h-3.5 w-3.5" />
                      {course.videos} videos
                    </span>
                  </div>

                  <h3
                    className="mb-4 min-h-[2.6rem] font-bold leading-snug"
                    style={{ color: INK }}
                  >
                    {course.title}
                  </h3>

                  <div className="mb-4 flex items-end justify-between">
                    <div>
                      <p
                        className="text-[11px] font-medium"
                        style={{ color: SLATE }}
                      >
                        Price
                      </p>
                      <p className="flex items-baseline gap-1.5">
                        <span
                          className="text-lg font-extrabold"
                          style={{ color: INK }}
                        >
                          ${course.price}
                        </span>
                        <span
                          className="text-xs font-medium"
                          style={{ color: SLATE }}
                        >
                          {course.discountPercent}% off
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, s) => (
                          <Star
                            key={s}
                            className="h-3 w-3 fill-current"
                            style={{ color: "#F5A623" }}
                          />
                        ))}
                      </div>
                      <p
                        className="mt-0.5 text-[11px] font-medium"
                        style={{ color: SLATE }}
                      >
                        {course.rating.toFixed(1)} (
                        {course.reviews.toLocaleString()} reviews)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="course-btn flex-1 rounded-lg border-2 py-2.5 text-center text-xs font-bold transition-colors"
                      style={{
                        borderColor: BLUE,
                        color: BLUE,
                        background: "transparent",
                      }}
                    >
                      Enrol course
                    </span>
                    <span
                      className="course-arrow flex items-center gap-1 text-xs font-semibold opacity-0"
                      style={{ color: BLUE, transform: "translateX(-6px)" }}
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            ref={loadMoreRef}
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition-opacity hover:opacity-90"
            style={{ background: INK }}
          >
            Load more courses
          </Link>
        </div>
      </div>
    </section>
  );
}
