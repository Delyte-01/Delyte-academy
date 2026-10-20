"use client";

import { useEffect, useRef, useState, type Ref } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  PlayCircle,
  Sparkles,
  Star,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

/* Light palette: near-white base, ink text, one restrained accent. */
const PAPER = "#FCFCFD";
const INK = "#0F1115";
const MUTED = "#5B6270";
const ACCENT = "#2454FF";
const GOLD = "#F5A623";

/**
 * Background photo: bright, natural-light study scene from Pexels
 * (free licence). Swap by changing this one constant.
 * Other bright options: 4778635, 4778636, 4778401 (same collection).
 */
const HERO_IMAGE =
  "https://images.pexels.com/photos/4778634/pexels-photo-4778634.jpeg?auto=compress&cs=tinysrgb&w=2000";

const AVATARS = [
  "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=80",
  "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=80",
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80",
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80",
];

const MARQUEE_ITEMS = [
  "Study guides",
  "Past questions",
  "Timed CBT practice tests",
  "Track your progress",
  "Know what to study next",
];

const SURFACE =
  "border border-black/[0.06] bg-white/80 backdrop-blur-xl shadow-[0_24px_60px_-24px_rgba(15,17,21,0.22)]";

const RING_PERCENT = 34;
const RING_RADIUS = 30;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;
const RING_OFFSET = RING_CIRC - (RING_PERCENT / 100) * RING_CIRC;

/* ------------------------------------------------------------------ */
/* Interactive mini CBT card                                           */
/* ------------------------------------------------------------------ */

const TEST_SECONDS = 24 * 60 + 59;

const QUESTIONS = [
  {
    q: "Which of these numbers is prime?",
    options: ["15", "21", "23", "27"],
    answer: 2,
    why: "23 can only be divided evenly by 1 and itself.",
  },
  {
    q: "Which gas do plants absorb for photosynthesis?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
    answer: 2,
    why: "Plants take in carbon dioxide and release oxygen.",
  },
  {
    q: "Solve for x: 3x + 5 = 20",
    options: ["3", "5", "15", "25"],
    answer: 1,
    why: "Subtract 5 to get 3x = 15, then divide both sides by 3.",
  },
];

function MockTestCard() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(TEST_SECONDS);

  useEffect(() => {
    const id = setInterval(
      () => setSecondsLeft((s) => (s <= 1 ? TEST_SECONDS : s - 1)),
      1000,
    );
    return () => clearInterval(id);
  }, []);

  const question = QUESTIONS[idx];
  const number = 12 + idx;
  const answered = picked !== null;
  const correct = picked === question.answer;
  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  const optionClass = (i: number): string => {
    if (!answered)
      return "border-black/10 bg-white hover:border-black/30 hover:shadow-sm";
    if (i === question.answer) return "border-emerald-500/60 bg-emerald-50";
    if (i === picked) return "border-rose-500/60 bg-rose-50";
    return "border-black/5 bg-white opacity-50";
  };

  return (
    <div className={cn("rounded-[1.75rem] p-5 text-left sm:p-6", SURFACE)}>
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F1115]">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse"
          />
          Try a sample question
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full bg-[#0F1115] px-3 py-1 text-xs font-semibold tabular-nums text-white"
          aria-label={`Time remaining ${mins} minutes ${secs} seconds`}
        >
          <Clock className="h-3.5 w-3.5 text-white/70" />
          {mins}:{secs}
        </span>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[11px] text-[#5B6270]">
          <span>Question {number} of 40</span>
          <span className="tabular-nums">
            {Math.round((number / 40) * 100)}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.07]">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{ width: `${(number / 40) * 100}%`, background: INK }}
          />
        </div>
      </div>

      <h3 className="mt-5 text-lg font-semibold leading-snug text-[#0F1115]">
        {question.q}
      </h3>

      <div className="mt-4 grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
        {question.options.map((option, i) => (
          <button
            key={option}
            type="button"
            disabled={answered}
            onClick={() => setPicked(i)}
            className={cn(
              "flex min-h-12 items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm font-medium text-[#0F1115] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F1115]/60 enabled:active:scale-[0.97]",
              optionClass(i),
            )}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-black/[0.06] text-[11px] font-bold">
              {String.fromCharCode(65 + i)}
            </span>
            <span className="min-w-0 flex-1 truncate">{option}</span>
            {answered && i === question.answer && (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            )}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="mt-4 min-h-[5.25rem]">
        {answered ? (
          <>
            <p
              className={cn(
                "text-sm font-semibold",
                correct ? "text-emerald-600" : "text-rose-600",
              )}
            >
              {correct ? "Correct!" : "Not quite."}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-[#5B6270]">
              {question.why}
            </p>
            <button
              type="button"
              onClick={() => {
                setIdx((i) => (i + 1) % QUESTIONS.length);
                setPicked(null);
              }}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#0F1115] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F1115]/60"
            >
              Next question
              <ArrowRight className="h-3 w-3" />
            </button>
          </>
        ) : (
          <p className="text-xs text-[#5B6270]">
            Pick an answer to see how it works.
          </p>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between gap-3 border-t border-black/[0.06] pt-4">
        <p className="text-xs text-[#5B6270]">
          Timed, just like the real thing
        </p>
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F1115] hover:underline underline-offset-4"
        >
          Take a full mock test
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

function ProgressRing({
  label,
  arcRef,
}: {
  label: string;
  arcRef: Ref<SVGCircleElement>;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3.5 py-3 sm:px-4",
        SURFACE,
      )}
    >
      <svg
        width="56"
        height="56"
        viewBox="0 0 68 68"
        className="-rotate-90 sm:h-[64px] sm:w-[64px]"
        role="img"
        aria-label={`${RING_PERCENT}% average improvement`}
      >
        <circle
          cx="34"
          cy="34"
          r={RING_RADIUS}
          fill="none"
          stroke="rgba(15,17,21,0.08)"
          strokeWidth="6"
        />
        <circle
          ref={arcRef}
          cx="34"
          cy="34"
          r={RING_RADIUS}
          fill="none"
          stroke={ACCENT}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={RING_CIRC}
          strokeDashoffset={RING_OFFSET}
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
          {RING_PERCENT}%
        </text>
      </svg>
      <div>
        <p className="text-[11px] font-medium leading-tight text-[#5B6270]">
          {label}
        </p>
        <p className="text-sm font-bold leading-tight text-[#0F1115]">
          Avg. improvement
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export function Hero({ loaderFinished }: { loaderFinished: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const cardGroupRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const ringWrapRef = useRef<HTMLDivElement>(null);
  const ringArcRef = useRef<SVGCircleElement>(null);
  const flameWrapRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!loaderFinished) return;

      const mm = gsap.matchMedia();
      let safetyTimer: ReturnType<typeof setTimeout> | undefined;

      mm.add(
        {
          isDesktop: "(min-width: 1024px) and (hover: hover)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            reduceMotion: boolean;
          };

          const lines = gsap.utils.toArray<HTMLElement>(".hero-line");
          const ctaChildren = ctaRef.current
            ? gsap.utils.toArray<HTMLElement>(ctaRef.current.children)
            : [];

          const revealTargets = [
            badgeRef.current,
            ...lines,
            paragraphRef.current,
            ...ctaChildren,
            socialRef.current,
            cardRef.current,
            ringWrapRef.current,
            flameWrapRef.current,
            marqueeRef.current,
          ].filter(Boolean) as HTMLElement[];

          if (reduceMotion) {
            gsap.set(revealTargets, { clearProps: "opacity,transform" });
            return;
          }

          gsap.set(badgeRef.current, { y: -16, opacity: 0 });
          gsap.set(lines, { yPercent: 120, opacity: 0 });
          gsap.set(paragraphRef.current, { y: 18, opacity: 0 });
          gsap.set(ctaChildren, { y: 18, opacity: 0 });
          gsap.set(socialRef.current, { y: 14, opacity: 0 });
          gsap.set(cardRef.current, { y: 40, opacity: 0, scale: 0.96 });
          gsap.set(ringWrapRef.current, { scale: 0.6, opacity: 0 });
          gsap.set(flameWrapRef.current, { scale: 0.6, opacity: 0 });
          gsap.set(marqueeRef.current, { y: 20, opacity: 0 });
          gsap.set(ringArcRef.current, { strokeDashoffset: RING_CIRC });
          gsap.set(imgWrapRef.current, { scale: 1.15, opacity: 0 });

          safetyTimer = setTimeout(() => {
            gsap.set(revealTargets, { clearProps: "opacity,transform" });
            gsap.set(imgWrapRef.current, { opacity: 1 });
            gsap.set(ringArcRef.current, { strokeDashoffset: RING_OFFSET });
          }, 4000);

          const tl = gsap.timeline({
            defaults: { ease: "power4.out" },
            onComplete: () => {
              if (safetyTimer) clearTimeout(safetyTimer);
              gsap.set(
                [
                  badgeRef.current,
                  ...lines,
                  paragraphRef.current,
                  ...ctaChildren,
                  socialRef.current,
                  marqueeRef.current,
                ],
                { clearProps: "transform,opacity" },
              );
            },
          });

          tl.to(
            imgWrapRef.current,
            { scale: 1.06, opacity: 1, duration: 1.8, ease: "power3.out" },
            0,
          )
            .to(badgeRef.current, { y: 0, opacity: 1, duration: 0.6 }, 0.25)
            .to(
              lines,
              {
                yPercent: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.12,
                ease: "expo.out",
              },
              0.4,
            )
            .to(paragraphRef.current, { y: 0, opacity: 1, duration: 0.7 }, 0.9)
            .to(
              ctaChildren,
              { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
              1.05,
            )
            .to(socialRef.current, { y: 0, opacity: 1, duration: 0.6 }, 1.25)
            .to(
              cardRef.current,
              { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: "expo.out" },
              0.7,
            )
            .to(
              ringWrapRef.current,
              { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.7)" },
              1.3,
            )
            .to(
              ringArcRef.current,
              {
                strokeDashoffset: RING_OFFSET,
                duration: 1.4,
                ease: "power3.out",
              },
              1.35,
            )
            .to(
              flameWrapRef.current,
              { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.7)" },
              1.45,
            )
            .to(marqueeRef.current, { y: 0, opacity: 1, duration: 0.7 }, 1.4);

          // Ambient: very slow drift on the photo + marquee.
          gsap.to(imgWrapRef.current, {
            scale: 1.12,
            x: -18,
            duration: 28,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: 1.8,
          });
          gsap.to(".hero-marquee-track", {
            xPercent: -50,
            duration: 36,
            ease: "none",
            repeat: -1,
          });

          const cleanups: Array<() => void> = [];

          if (isDesktop) {
            gsap.to(ringWrapRef.current, {
              y: "+=8",
              duration: 2.4,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: 2.8,
            });
            gsap.to(flameWrapRef.current, {
              y: "+=8",
              duration: 2.6,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: 3.1,
            });

            const buttons = ctaRef.current
              ? (Array.from(
                  ctaRef.current.querySelectorAll("a"),
                ) as HTMLElement[])
              : [];

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
                xTo((e.clientX - rect.left - rect.width / 2) * 0.25);
                yTo((e.clientY - rect.top - rect.height / 2) * 0.35);
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
                gsap.set(btn, { clearProps: "transform" });
              });
            });

            const section = sectionRef.current;
            const bgEl = bgRef.current;
            const group = cardGroupRef.current;

            if (section && bgEl && group) {
              const opts = { duration: 1.2, ease: "power3" };
              const bgX = gsap.quickTo(bgEl, "x", opts);
              const bgY = gsap.quickTo(bgEl, "y", opts);
              const grX = gsap.quickTo(group, "x", opts);
              const grY = gsap.quickTo(group, "y", opts);

              const onSectionMove = (e: MouseEvent) => {
                const rect = section.getBoundingClientRect();
                const nx = (e.clientX - rect.left) / rect.width - 0.5;
                const ny = (e.clientY - rect.top) / rect.height - 0.5;
                bgX(-nx * 24);
                bgY(-ny * 16);
                grX(nx * 10);
                grY(ny * 8);
              };
              const onSectionLeave = () => {
                bgX(0);
                bgY(0);
                grX(0);
                grY(0);
              };

              section.addEventListener("mousemove", onSectionMove);
              section.addEventListener("mouseleave", onSectionLeave);
              cleanups.push(() => {
                section.removeEventListener("mousemove", onSectionMove);
                section.removeEventListener("mouseleave", onSectionLeave);
              });
            }
          }

          return () => {
            if (safetyTimer) clearTimeout(safetyTimer);
            cleanups.forEach((fn) => fn());
          };
        },
      );

      return () => {
        if (safetyTimer) clearTimeout(safetyTimer);
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [loaderFinished] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden rounded-b-[2rem] text-[#0F1115] lg:rounded-b-[3rem]"
      style={{ background: PAPER }}
    >
      {/* ── Background photo: kept faint so the page reads as white ── */}
      <div
        ref={bgRef}
        className="absolute -inset-[5%] -z-30 will-change-transform"
      >
        <div
          ref={imgWrapRef}
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[65%_center] opacity-[0.55] saturate-[0.85] lg:object-center"
          />
        </div>
      </div>

      {/* ── Overlays: white wash for legibility, neutral glow, soft grain ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(252,252,253,0.94)_0%,rgba(252,252,253,0.82)_45%,rgba(252,252,253,0.94)_100%)] lg:hidden"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 hidden bg-[linear-gradient(90deg,rgba(252,252,253,1)_0%,rgba(252,252,253,0.94)_38%,rgba(252,252,253,0.55)_72%,rgba(252,252,253,0.35)_100%)] lg:block"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(55%_70%_at_88%_10%,rgba(255,255,255,0.9),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-20 h-40 bg-gradient-to-t from-[#FCFCFD] to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(rgba(15,17,21,0.10)_1px,transparent_1px)] bg-[size:26px_26px] opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-16 pt-28 sm:px-8 lg:pb-20 lg:pt-36">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* Left: copy */}
          <div className="flex flex-col items-center space-y-6 text-center sm:space-y-7 lg:items-start lg:space-y-8 lg:text-left">
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/90 px-4 py-1.5 text-xs font-semibold text-[#0F1115] shadow-sm backdrop-blur-md"
            >
              <Sparkles
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: ACCENT }}
              />
              Built for students preparing for exams
            </div>

            <h1 className="max-w-xl text-[2.6rem] font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-6xl lg:text-[3.75rem] xl:text-7xl">
              <span className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
                <span className="hero-line inline-block">Study smarter,</span>
              </span>
              <span className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
                <span className="hero-line inline-block">track every</span>
              </span>
              <span className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
                <span
                  className="hero-line inline-block bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${INK}, #4B5160 60%, #8A90A0)`,
                  }}
                >
                  step forward
                </span>
              </span>
            </h1>

            <p
              ref={paragraphRef}
              className="max-w-md text-base leading-relaxed sm:text-lg lg:max-w-lg"
              style={{ color: MUTED }}
            >
              Study guides, past questions, and timed CBT practice tests, all in
              one place. See exactly where you stand and what to study next.
            </p>

            <div ref={ctaRef} className="w-full sm:w-fit">
              <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                <Link
                  href="/sign-up"
                  className="inline-flex h-13 min-h-[3.25rem] items-center justify-center gap-2 whitespace-nowrap rounded-full px-8 text-[15px] font-bold text-white shadow-[0_14px_30px_-10px_rgba(15,17,21,0.5)] transition-all hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F1115]/60 focus-visible:ring-offset-2 active:scale-[0.97]"
                  style={{ background: INK }}
                >
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard/courses"
                  className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 whitespace-nowrap rounded-full border border-black/10 bg-white px-8 text-[15px] font-semibold text-[#0F1115] shadow-sm transition-colors hover:border-black/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F1115]/60 focus-visible:ring-offset-2 active:scale-[0.97]"
                >
                  <PlayCircle className="h-4 w-4" style={{ color: ACCENT }} />
                  Try a mock test
                </Link>
              </div>
            </div>

            <div
              ref={socialRef}
              className="flex items-center gap-4 pt-1 sm:gap-5"
            >
              <div className="flex -space-x-2.5">
                {AVATARS.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt=""
                    loading="lazy"
                    className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm sm:h-8 sm:w-8"
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
                  <span className="ml-1 text-sm font-bold">4.9</span>
                </div>
                <p className="text-xs" style={{ color: MUTED }}>
                  Free for every student, no card required
                </p>
              </div>
            </div>
          </div>

          {/* Right: playable card + floating chips */}
          <div
            ref={cardGroupRef}
            className="relative mx-auto w-full max-w-md pb-6 lg:ml-auto lg:mr-0 lg:pb-0 hidden lg:block"
          >
            <div ref={cardRef}>
              <MockTestCard />
            </div>

            <div
              ref={ringWrapRef}
              className="absolute -bottom-2 left-2 sm:-bottom-7 sm:-left-8"
            >
              <ProgressRing label="This term" arcRef={ringArcRef} />
            </div>

            <div
              ref={flameWrapRef}
              className={cn(
                "absolute -right-5 -top-6 hidden items-center gap-3 rounded-2xl px-5 py-4 sm:flex",
                SURFACE,
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/[0.05]">
                <Flame className="h-5 w-5" style={{ color: GOLD }} />
              </div>
              <div>
                <p className="text-[11px]" style={{ color: MUTED }}>
                  Questions practiced
                </p>
                <p className="text-lg font-extrabold">12,400+</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Feature marquee ── */}
      <div
        ref={marqueeRef}
        className="relative z-10 border-t border-black/[0.06] bg-white/70 py-4 backdrop-blur-sm [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        <div className="hero-marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center gap-10 pr-10"
            >
              {MARQUEE_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 whitespace-nowrap text-sm font-medium"
                  style={{ color: MUTED }}
                >
                  <Sparkles
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: ACCENT }}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
