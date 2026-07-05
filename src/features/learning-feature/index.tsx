"use client";

import { useRef } from "react";
import {
  TrendingUp,
  FileText,
  PlayCircle,
  BarChart2,
  Users,
  type LucideIcon,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const INK = "#0B1220";
const BLUE = "#2454FF";
const SKY = "#F8F8F8";
const SLATE = "#64748B";
const TINT = SKY;

type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const FEATURES: Feature[] = [
  {
    icon: FileText,
    title: "Personalized learning paths",
    desc: "Courses and study materials tailored to your specific exam type, level, and learning style.",
  },
  {
    icon: PlayCircle,
    title: "Live sessions & webinars",
    desc: "Join expert-led live study sessions and interactive webinars for key subjects.",
  },
  {
    icon: BarChart2,
    title: "Student dashboard",
    desc: "Track progress, review scores, and monitor improvement with a comprehensive personal dashboard.",
  },
  {
    icon: Users,
    title: "Community & networking",
    desc: "Connect with thousands of students, share study tips, and build your academic network.",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const improvementRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const improvementValueRef = useRef<HTMLParagraphElement>(null);
  const successBarRef = useRef<HTMLDivElement>(null);
  const successCopyRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            ".feat-eyebrow",
            ".feat-line",
            ".feat-copy",
            ".feat-item",
            imageWrapRef.current,
            improvementRef.current,
            successRef.current,
          ],
          { clearProps: "all", opacity: 1 }
        );
        gsap.set(successBarRef.current, { scaleX: 1 });
        if (improvementValueRef.current)
          improvementValueRef.current.textContent = "+25.0%";
        if (successCopyRef.current)
          successCopyRef.current.textContent = "55% above average";
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
        const cleanups: Array<() => void> = [];

        // ---- Initial states ----
        gsap.set(".feat-eyebrow", { y: 14, opacity: 0 });
        gsap.set(".feat-line", { yPercent: 110, opacity: 0 });
        gsap.set(".feat-copy", { y: 14, opacity: 0 });
        gsap.set(".feat-item", { x: -24, opacity: 0 });
        gsap.set(".feat-icon-chip", { scale: 0 });

        if (isDesktop) {
          gsap.set(imageWrapRef.current, {
            clipPath: "inset(0% 100% 0% 0%)",
          });
          gsap.set([improvementRef.current, successRef.current], {
            scale: 0,
            opacity: 0,
          });
        } else {
          gsap.set(imageWrapRef.current, { y: 24, opacity: 0 });
          gsap.set([improvementRef.current, successRef.current], {
            y: 14,
            opacity: 0,
          });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        });

        // ---- Image side ----
        if (isDesktop) {
          tl.to(imageWrapRef.current, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            ease: "expo.inOut",
          });
        } else {
          tl.to(imageWrapRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
          });
        }

        // ---- Text side, in parallel with the image ----
        tl.to(
          ".feat-eyebrow",
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
          "-=0.9"
        )
          .to(
            ".feat-line",
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.9,
              stagger: 0.1,
              ease: "expo.out",
            },
            "-=0.35"
          )
          .to(
            ".feat-copy",
            { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
            "-=0.55"
          )
          .to(
            ".feat-item",
            {
              x: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.12,
              ease: "power3.out",
            },
            "-=0.4"
          )
          .to(
            ".feat-icon-chip",
            { scale: 1, duration: 0.45, stagger: 0.12, ease: "back.out(1.8)" },
            "-=0.7"
          );

        // ---- Floating stat cards: pop in, then idle float, then count up ----
        if (isDesktop) {
          tl.to(
            improvementRef.current,
            { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
            "-=0.9"
          ).to(
            successRef.current,
            { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
            "-=0.45"
          );
        } else {
          tl.to(
            [improvementRef.current, successRef.current],
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power3.out",
            },
            "-=0.3"
          );
        }

        tl.add(() => {
          // Count-up, decoupled from entrance timing so it always finishes clean.
          const counter = { val: 0 };
          gsap.to(counter, {
            val: 25,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: () => {
              if (improvementValueRef.current) {
                improvementValueRef.current.textContent = `+${counter.val.toFixed(
                  1
                )}%`;
              }
            },
          });

          if (successBarRef.current) {
            gsap.to(successBarRef.current, {
              scaleX: 1,
              duration: 1,
              ease: "power2.out",
            });
          }

          const successCounter = { val: 0 };
          gsap.to(successCounter, {
            val: 55,
            duration: 1,
            ease: "power2.out",
            onUpdate: () => {
              if (successCopyRef.current) {
                successCopyRef.current.textContent = `${Math.round(
                  successCounter.val
                )}% above average`;
              }
            },
          });

          if (isDesktop) {
            gsap.to(improvementRef.current, {
              y: "+=10",
              duration: 2.6,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
            gsap.to(successRef.current, {
              y: "+=10",
              duration: 2.8,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: 0.4,
            });
          }
        }, "-=0.2");

        // ---- Cursor tilt on the image, same physics as hero/courses ----
        if (isDesktop && imageWrapRef.current) {
          const el = imageWrapRef.current;
          const rotateX = gsap.quickTo(el, "rotateX", {
            duration: 0.6,
            ease: "power3",
          });
          const rotateY = gsap.quickTo(el, "rotateY", {
            duration: 0.6,
            ease: "power3",
          });

          const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            rotateY(px * 6);
            rotateX(-py * 6);
          };
          const onLeave = () => {
            rotateX(0);
            rotateY(0);
          };

          el.addEventListener("mousemove", onMove);
          el.addEventListener("mouseleave", onLeave);
          cleanups.push(() => {
            el.removeEventListener("mousemove", onMove);
            el.removeEventListener("mouseleave", onLeave);
          });
        }

        // ---- Feature row hover: nudge + icon chip fill ----
        const items = gsap.utils.toArray<HTMLElement>(".feat-item");
        items.forEach((item) => {
          const chip = item.querySelector<HTMLElement>(".feat-icon-chip");
          const icon = item.querySelector<HTMLElement>(".feat-icon");
          const onEnter = () => {
            gsap.to(item, { x: 6, duration: 0.3, ease: "power3.out" });
            if (chip) gsap.to(chip, { backgroundColor: BLUE, duration: 0.3 });
            if (icon) gsap.to(icon, { color: "#FFFFFF", duration: 0.3 });
          };
          const onLeave = () => {
            gsap.to(item, { x: 0, duration: 0.35, ease: "power3.out" });
            if (chip)
              gsap.to(chip, { backgroundColor: "#FFFFFF", duration: 0.3 });
            if (icon) gsap.to(icon, { color: BLUE, duration: 0.3 });
          };
          item.addEventListener("mouseenter", onEnter);
          item.addEventListener("mouseleave", onLeave);
          cleanups.push(() => {
            item.removeEventListener("mouseenter", onEnter);
            item.removeEventListener("mouseleave", onLeave);
          });
        });

        return () => cleanups.forEach((fn) => fn());
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28"
      style={{ background: TINT }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* ── Left: image + floating stat cards ── */}
          <div className="relative" style={{ perspective: "1000px" }}>
            <div
              ref={imageWrapRef}
              className="overflow-hidden rounded-2xl shadow-xl shadow-slate-900/10"
              style={{ willChange: "transform" }}
            >
              <Image
                src="https://res.cloudinary.com/dk5mfu099/image/upload/v1783273126/23557_muizqi.jpg"
                alt="Learning features"
                width={500}
                height={500}
                className="h-[340px] w-full object-cover sm:h-[420px]"
              />
            </div>

            <div
              ref={improvementRef}
              className="absolute top-6 -right-5 hidden items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg shadow-slate-900/5 sm:flex"
              style={{ willChange: "transform" }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm shadow-slate-900/5 ring-1 ring-slate-100">
                <TrendingUp className="h-4 w-4" style={{ color: BLUE }} />
              </div>
              <div>
                <p className="text-xs leading-none" style={{ color: SLATE }}>
                  Improvement
                </p>
                <p
                  ref={improvementValueRef}
                  className="text-lg font-extrabold leading-tight tabular-nums"
                  style={{ color: INK }}
                >
                  +0.0%
                </p>
              </div>
            </div>

            <div
              ref={successRef}
              className="absolute bottom-6 -left-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg shadow-slate-900/5"
              style={{ willChange: "transform" }}
            >
              <p className="mb-1 text-xs" style={{ color: SLATE }}>
                Success rate
              </p>
              <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100">
                <div
                  ref={successBarRef}
                  className="h-full origin-left rounded-full"
                  style={{
                    background: BLUE,
                    transform: "scaleX(0)",
                    width: "80%",
                  }}
                />
              </div>
              <p
                ref={successCopyRef}
                className="mt-1 text-sm font-bold tabular-nums"
                style={{ color: INK }}
              >
                0% above average
              </p>
            </div>
          </div>

          {/* ── Right: copy + feature list ── */}
          <div className="space-y-6">
            <div>
              <p
                className="feat-eyebrow mb-2 text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: SLATE }}
              >
                Our features
              </p>
              <h2
                className="text-3xl font-extrabold leading-tight  sm:text-4xl md:text-[40px]"
                style={{ color: INK }}
              >
                <span className="block overflow-hidden">
                  <span className="feat-line inline-block capitalize">
                    Powerful features for
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span className="feat-line inline-block capitalize">
                    your learning <span style={{ color: BLUE }}>journey</span>
                  </span>
                </span>
              </h2>
              <p
                className="feat-copy mt-3 text-sm leading-relaxed"
                style={{ color: SLATE }}
              >
                StudyHub brings together everything you need for exam success in
                one seamless platform.
              </p>
            </div>

            <div className="space-y-5">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="feat-item flex items-start gap-4 rounded-xl p-1.5"
                >
                  <div className="feat-icon-chip flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm shadow-slate-900/5 ring-1 ring-slate-100 transition-colors">
                    <Icon
                      className="feat-icon h-5 w-5 transition-colors"
                      style={{ color: BLUE }}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold" style={{ color: INK }}>
                      {title}
                    </h4>
                    <p
                      className="mt-0.5 text-xs leading-relaxed"
                      style={{ color: SLATE }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
