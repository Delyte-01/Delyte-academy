"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PlayCircle, Sparkles, Star, Flame } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const INK = "#0B1220";
const BLUE = "#2454FF";
const SKY = "#EEF4FF";
const SLATE = "#64748B";
const GOLD = "#F5A623";
const CYAN = "#06B6D4";

const AVATARS = [
  "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=80",
  "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=80",
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80",
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80",
];

/** Circular progress ring — the signature element. Shows avg score
 * improvement as an actual arc, tying the visual directly to the
 * product's core mechanic (progress tracking), not a generic stat card. */
function ProgressRing({ percent, label }: { percent: number; label: string }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-3.5 py-3 shadow-lg shadow-slate-900/5 sm:px-4">
      <svg
        width="60"
        height="60"
        viewBox="0 0 68 68"
        className="-rotate-90 sm:h-[68px] sm:w-[68px]"
      >
        <circle
          cx="34"
          cy="34"
          r={radius}
          fill="none"
          stroke={SKY}
          strokeWidth="6"
        />
        <circle
          cx="34"
          cy="34"
          r={radius}
          fill="none"
          stroke={BLUE}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <text
          x="34"
          y="34"
          textAnchor="middle"
          dominantBaseline="central"
          transform="rotate(90 34 34)"
          fontSize="16"
          fontWeight="700"
          fill={INK}
        >
          {percent}%
        </text>
      </svg>
      <div>
        <p
          className="text-[11px] font-medium leading-tight"
          style={{ color: SLATE }}
        >
          {label}
        </p>
        <p className="text-sm font-bold leading-tight" style={{ color: INK }}>
          Avg. improvement
        </p>
      </div>
    </div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);
  const ringWrapRef = useRef<HTMLDivElement>(null);
  const flameWrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const conditions = context.conditions as {
            isDesktop: boolean;
            reduceMotion: boolean;
          };
          const { isDesktop, reduceMotion } = conditions;

          const revealTargets = [
            badgeRef.current,
            ".hero-line",
            paragraphRef.current,
            ctaRef.current,
            socialRef.current,
            imageCardRef.current,
            ringWrapRef.current,
            flameWrapRef.current,
          ];

          // Respect reduced motion: snap everything into place, no animation.
          if (reduceMotion) {
            gsap.set(revealTargets, { clearProps: "all", opacity: 1 });
            return;
          }

          const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

          tl.from(badgeRef.current, { y: -16, opacity: 0, duration: 0.6 })
            .from(
              ".hero-line",
              { yPercent: 120, opacity: 0, duration: 1, stagger: 0.12 },
              "-=0.3"
            )
            .from(
              paragraphRef.current,
              { y: 18, opacity: 0, duration: 0.7 },
              "-=0.55"
            )
            .from(
              ctaRef.current ? Array.from(ctaRef.current.children) : [],
              { y: 18, opacity: 0, duration: 0.6, stagger: 0.1 },
              "-=0.45"
            )
            .from(
              socialRef.current,
              { y: 14, opacity: 0, duration: 0.6 },
              "-=0.35"
            );

          if (isDesktop) {
            // Awwwards-style clip reveal + scale-down on the hero image.
            tl.fromTo(
              imageCardRef.current,
              { clipPath: "inset(100% 0% 0% 0%)", scale: 1.15 },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: 1.3,
                ease: "power4.inOut",
              },
              "-=0.6"
            )
              .from(
                ringWrapRef.current,
                { scale: 0, opacity: 0, duration: 0.7, ease: "back.out(1.7)" },
                "-=0.5"
              )
              .from(
                flameWrapRef.current,
                { scale: 0, opacity: 0, duration: 0.7, ease: "back.out(1.7)" },
                "-=0.5"
              );

            // Idle float loop on the floating badges once they've landed.
            gsap.to(ringWrapRef.current, {
              y: "+=8",
              duration: 2.4,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
            gsap.to(flameWrapRef.current, {
              y: "+=8",
              duration: 2.6,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: 0.3,
            });

            // Magnetic buttons — CTA links pull toward the cursor.
            const buttons = ctaRef.current
              ? (Array.from(
                  ctaRef.current.querySelectorAll("a")
                ) as HTMLElement[])
              : [];
            const cleanups: Array<() => void> = [];

            buttons.forEach((btn) => {
              const xTo = gsap.quickTo(btn, "x", {
                duration: 0.4,
                ease: "power3",
              });
              const yTo = gsap.quickTo(btn, "y", {
                duration: 0.4,
                ease: "power3",
              });

              const onMove = (e: MouseEvent) => {
                const rect = btn.getBoundingClientRect();
                const relX = e.clientX - rect.left - rect.width / 2;
                const relY = e.clientY - rect.top - rect.height / 2;
                xTo(relX * 0.25);
                yTo(relY * 0.35);
              };
              const onLeave = () => {
                xTo(0);
                yTo(0);
              };

              btn.addEventListener("mousemove", onMove);
              btn.addEventListener("mouseleave", onLeave);
              cleanups.push(() => {
                btn.removeEventListener("mousemove", onMove);
                btn.removeEventListener("mouseleave", onLeave);
              });
            });

            // Subtle tilt on the hero image, following the cursor.
            const imageEl = imageCardRef.current;
            if (imageEl) {
              const rotateX = gsap.quickTo(imageEl, "rotateX", {
                duration: 0.6,
                ease: "power3",
              });
              const rotateY = gsap.quickTo(imageEl, "rotateY", {
                duration: 0.6,
                ease: "power3",
              });

              const onImageMove = (e: MouseEvent) => {
                const rect = imageEl.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width - 0.5;
                const py = (e.clientY - rect.top) / rect.height - 0.5;
                rotateY(px * 10);
                rotateX(-py * 10);
              };
              const onImageLeave = () => {
                rotateX(0);
                rotateY(0);
              };

              imageEl.addEventListener("mousemove", onImageMove);
              imageEl.addEventListener("mouseleave", onImageLeave);
              cleanups.push(() => {
                imageEl.removeEventListener("mousemove", onImageMove);
                imageEl.removeEventListener("mouseleave", onImageLeave);
              });
            }

            return () => cleanups.forEach((fn) => fn());
          }

          // Mobile: minimal — plain fade/slide, no tilt, no clip reveal, no idle loop.
          tl.from(
            imageCardRef.current,
            { y: 24, opacity: 0, duration: 0.7 },
            "-=0.3"
          ).from(
            ringWrapRef.current,
            { y: 16, opacity: 0, duration: 0.5 },
            "-=0.4"
          );
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-16 sm:py-24 lg:py-32"
    >
      {/* ambient tints — quiet, symmetric, not a decorative mesh */}
      <div
        className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full opacity-50 blur-3xl sm:h-[560px] sm:w-[560px]"
        style={{ background: SKY }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-[-10%] h-[360px] w-[360px] rounded-full opacity-40 blur-3xl"
        style={{ background: SKY }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-14">
          {/* ── Left: content ── */}
          <div className="flex flex-col items-center space-y-7 text-center lg:items-start lg:space-y-8 lg:text-left">
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold"
              style={{ background: SKY, borderColor: "#BFD6FF", color: BLUE }}
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              Built for students preparing for exams
            </div>

            <h1
              className="max-w-xl text-[2.75rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-[3.75rem] xl:text-7xl"
              style={{ color: INK }}
            >
              <span className="block overflow-hidden">
                <span className="hero-line inline-block">Study smarter,</span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-line inline-block">track every</span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className="hero-line inline-block"
                  style={{ color: BLUE }}
                >
                  step forward
                </span>
              </span>
            </h1>

            <p
              ref={paragraphRef}
              className="max-w-md text-base leading-relaxed sm:text-lg lg:max-w-lg"
              style={{ color: SLATE }}
            >
              Study guides, past questions, and timed CBT practice tests — in
              one place. See exactly where you stand and what to study next.
            </p>

            <div
              ref={ctaRef}
              className="flex w-full flex-col gap-3.5 xs:w-auto sm:gap-4 md:flex-row"
            >
              <Link
                href="/signup"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-slate-900/10 transition-opacity hover:opacity-90 active:scale-[0.97]"
                style={{ background: INK }}
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/courses/math-101/test"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-7 py-3.5 text-[15px] font-semibold transition-colors hover:border-blue-300 hover:bg-blue-50 active:scale-[0.97]"
                style={{ color: INK }}
              >
                <PlayCircle className="h-4 w-4" style={{ color: BLUE }} />
                Try a mock test
              </Link>
            </div>

            <div
              ref={socialRef}
              className="flex items-center gap-4 pt-1 sm:gap-5"
            >
              <div className="flex -space-x-2.5">
                {AVATARS.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="h-9 w-9 rounded-full border-2 border-white object-cover sm:h-8 sm:w-8"
                  />
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-current"
                      style={{ color: GOLD }}
                    />
                  ))}
                  <span
                    className="ml-1 text-sm font-bold"
                    style={{ color: INK }}
                  >
                    4.9
                  </span>
                </div>
                <p className="text-xs" style={{ color: SLATE }}>
                  Free for every student — no card required
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: image + floating cards ── */}
          <div
            className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
            style={{ perspective: "1000px" }}
          >
            <div
              ref={imageCardRef}
              className="overflow-hidden rounded-[28px] shadow-2xl shadow-slate-900/20 ring-1 ring-black/5"
              style={{ willChange: "transform" }}
            >
              <Image
                src="https://res.cloudinary.com/dk5mfu099/image/upload/v1783154244/university-student-woman-and-portrait-with-backpack-books-and-happy-for-back-to-school_xf78fh.jpg"
                width={800}
                height={1000}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                alt="Student studying"
                className="h-[340px] w-full object-cover sm:h-[400px] lg:h-[460px]"
                priority
              />
            </div>

            <div
              ref={ringWrapRef}
              className="absolute -bottom-5 -left-3 sm:-bottom-6 sm:-left-6"
            >
              <ProgressRing percent={34} label="This term" />
            </div>

            <div
              ref={flameWrapRef}
              className="absolute -top-4 -right-3 hidden items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-lg shadow-slate-900/5 sm:-right-5 sm:flex"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: SKY }}
              >
                <Flame className="h-5 w-5" style={{ color: CYAN }} />
              </div>
              <div>
                <p className="text-[11px]" style={{ color: SLATE }}>
                  Questions practiced
                </p>
                <p className="text-lg font-extrabold" style={{ color: INK }}>
                  12,400+
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
