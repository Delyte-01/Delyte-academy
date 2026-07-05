"use client";

import { useRef } from "react";
import { Heart, Award, Users, BookOpen, type LucideIcon } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const INK = "#0B1220";
const BLUE = "#2454FF";
const SKY = "#F8F8F8";
const SLATE = "#64748B";
const GOLD = "#F5A623";
const CYAN = "#06B6D4";
const TINT = SKY;

type Stat = {
  value: number;
  suffix: string;
  label: string;
  icon: LucideIcon;
  accent: string;
  decimals?: number;
};

const STATS: Stat[] = [
  {
    value: 100,
    suffix: "%",
    label: "Satisfaction rate",
    icon: Heart,
    accent: BLUE,
  },
  {
    value: 12,
    suffix: "+",
    label: "Years of excellence",
    icon: Award,
    accent: GOLD,
  },
  {
    value: 20,
    suffix: "K+",
    label: "Total students",
    icon: Users,
    accent: CYAN,
  },
  {
    value: 90,
    suffix: "+",
    label: "Courses available",
    icon: BookOpen,
    accent: BLUE,
  },
];

export function StatsStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const barRefs = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".stat-card");
      const dividers = gsap.utils.toArray<HTMLElement>(".stat-divider");
      const icons = gsap.utils.toArray<HTMLElement>(".stat-icon");

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Snap to final state, still show real numbers, no motion.
        STATS.forEach((s, i) => {
          const el = numberRefs.current[i];
          if (el) el.textContent = `${s.value}${s.suffix}`;
        });
        gsap.set([cards, dividers, icons], { clearProps: "all", opacity: 1 });
        gsap.set(barRefs.current, { scaleX: 1 });
        return;
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(cards, { y: 28, opacity: 0 });
        gsap.set(icons, { scale: 0, opacity: 0 });
        gsap.set(dividers, { scaleY: 0 });
        gsap.set(barRefs.current, { scaleX: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        });

        tl.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
        })
          .to(
            icons,
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              stagger: 0.12,
              ease: "back.out(2)",
            },
            "-=0.5"
          )
          .to(
            dividers,
            { scaleY: 1, duration: 0.6, stagger: 0.12, ease: "power2.out" },
            "-=0.6"
          )
          .add(() => {
            // Count-up + bar fill run together, driven by the same progress.
            STATS.forEach((stat, i) => {
              const el = numberRefs.current[i];
              const bar = barRefs.current[i];
              const counter = { val: 0 };

              gsap.to(counter, {
                val: stat.value,
                duration: 1.4,
                ease: "power2.out",
                delay: i * 0.08,
                onUpdate: () => {
                  if (!el) return;
                  const display = stat.decimals
                    ? counter.val.toFixed(stat.decimals)
                    : Math.round(counter.val).toString();
                  el.textContent = `${display}${stat.suffix}`;
                },
              });

              if (bar) {
                gsap.to(bar, {
                  scaleX: 1,
                  duration: 1.4,
                  ease: "power2.out",
                  delay: i * 0.08,
                });
              }
            });
          }, "-=0.3");

        return () => {
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative border-y border-slate-100 py-16 sm:py-20"
      style={{ background: TINT }}
    >
      {/* quiet ambient tint, consistent with hero language */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(600px circle at 15% 20%, rgba(36,84,255,0.05), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-y-0">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            const isLast = i === STATS.length - 1;

            return (
              <div key={stat.label} className="relative flex justify-center">
                {/* divider — vertical wipe on desktop, hidden on mobile */}
                {!isLast && (
                  <div
                    className="stat-divider absolute right-0 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-slate-200 md:block"
                    style={{ transformOrigin: "center" }}
                    aria-hidden
                  />
                )}

                <div className="stat-card group flex flex-col items-center px-4 text-center transition-transform duration-300 will-change-transform hover:-translate-y-1">
                  <div
                    className="stat-icon mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300"
                    style={{
                      background: "#FFFFFF",
                      boxShadow: "0 1px 2px rgba(11,18,32,0.06)",
                    }}
                  >
                    <Icon
                      className="h-4.5 w-4.5"
                      style={{ color: stat.accent }}
                      strokeWidth={2.25}
                    />
                  </div>

                  <p
                    ref={(el) => {
                      numberRefs.current[i] = el;
                    }}
                    className="text-3xl font-extrabold tabular-nums tracking-tight sm:text-4xl"
                    style={{ color: INK }}
                  >
                    0{stat.suffix}
                  </p>

                  <p
                    className="mt-1.5 text-xs font-medium sm:text-sm"
                    style={{ color: SLATE }}
                  >
                    {stat.label}
                  </p>

                  {/* signature element — progress fill, echoes the hero's tracking motif */}
                  <div className="mt-3 h-[3px] w-12 overflow-hidden rounded-full bg-slate-200/70">
                    <div
                      ref={(el) => {
                        barRefs.current[i] = el;
                      }}
                      className="h-full origin-left rounded-full"
                      style={{
                        background: stat.accent,
                        transform: "scaleX(0)",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
