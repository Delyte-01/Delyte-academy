"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Phone,
  Mail,
  MapPin,
  // Twitter,
  // Facebook,
  // Instagram,
  // Linkedin,
  // Youtube,
  ArrowRight,
  Check,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const INK = "#0B1220";
const BLUE = "#2454FF";

// Footer-specific neutrals — tuned for legibility on a dark background,
// distinct role from the light-background SLATE used elsewhere on the page.
const MUTED = "#8B96A8";
const FAINT = "#586174";
const CARD_BG = "#111A2B";
const INPUT_BG = "#161F2E";
const HAIRLINE = "rgba(255,255,255,0.08)";

const QUICK_LINKS: [string, string][] = [
  ["/", "Home"],
  ["/dashboard", "Courses"],
  ["/dashboard/progress", "Progress tracker"],
  ["/admin", "Admin panel"],
  ["/login", "Sign in"],
  ["/signup", "Register"],
];

const SUBJECTS = [
  "Mathematics",
  "English language",
  "Biology",
  "Physics",
  "Chemistry",
  "Economics",
];

// const SOCIALS = [Twitter, Facebook, Instagram, Linkedin, Youtube];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            ".foot-reveal",
            ".foot-line",
            ".foot-card",
            ".foot-col",
            ".foot-social",
          ],
          { clearProps: "all", opacity: 1 }
        );
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".foot-card", { y: 40, opacity: 0 });
        gsap.set(".foot-line", { yPercent: 110, opacity: 0 });
        gsap.set(".foot-reveal", { y: 16, opacity: 0 });
        gsap.set(".foot-social", { scale: 0, opacity: 0 });
        gsap.set(".foot-col", { y: 20, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            once: true,
          },
        });

        tl.to(".foot-card", {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power4.out",
        })
          .to(
            ".foot-line",
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.08,
              ease: "expo.out",
            },
            "-=0.55"
          )
          .to(
            ".foot-reveal",
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.08,
              ease: "power3.out",
            },
            "-=0.5"
          )
          .to(
            ".foot-social",
            {
              scale: 1,
              opacity: 1,
              duration: 0.45,
              stagger: 0.06,
              ease: "back.out(1.8)",
            },
            "-=0.5"
          )
          .to(
            ".foot-col",
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power3.out",
            },
            "-=0.6"
          );

        // Magnetic subscribe button — same physics as CTAs elsewhere on the page.
        const btn = submitBtnRef.current;
        const cleanups: Array<() => void> = [];
        if (btn) {
          const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3" });
          const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3" });
          const onMove = (e: MouseEvent) => {
            const rect = btn.getBoundingClientRect();
            xTo((e.clientX - rect.left - rect.width / 2) * 0.3);
            yTo((e.clientY - rect.top - rect.height / 2) * 0.3);
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
        }

        // Social icons: scale + color pop, replacing the old inline-style JS handlers.
        const socialButtons = gsap.utils.toArray<HTMLElement>(".foot-social");
        socialButtons.forEach((el) => {
          const onEnter = () =>
            gsap.to(el, {
              scale: 1.08,
              backgroundColor: BLUE,
              borderColor: BLUE,
              duration: 0.3,
              ease: "back.out(2)",
            });
          const onLeave = () =>
            gsap.to(el, {
              scale: 1,
              backgroundColor: INPUT_BG,
              borderColor: HAIRLINE,
              duration: 0.3,
            });
          el.addEventListener("mouseenter", onEnter);
          el.addEventListener("mouseleave", onLeave);
          cleanups.push(() => {
            el.removeEventListener("mouseenter", onEnter);
            el.removeEventListener("mouseleave", onLeave);
          });
        });

        return () => cleanups.forEach((fn) => fn());
      });

      return () => mm.revert();
    },
    { scope: footerRef }
  );

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire to real subscribe endpoint.
    setSubmitted(true);
    gsap.fromTo(
      ".foot-success-icon",
      { scale: 0, rotate: -45 },
      { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2.2)" }
    );
  };

  return (
    <footer ref={footerRef} style={{ background: INK }}>
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        {/* ═══ CTA capsule — the signature element ═══ */}
        <div
          className="foot-card relative overflow-hidden rounded-3xl border px-6 py-10 sm:px-10 sm:py-12 lg:px-14"
          style={{ background: CARD_BG, borderColor: HAIRLINE }}
        >
          {/* quiet ambient glow, consistent with the light-tint treatment used elsewhere */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(500px circle at 50% 0%, rgba(36,84,255,0.12), transparent 70%)",
            }}
            aria-hidden
          />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.4fr_1fr] lg:items-center lg:gap-8">
            {/* Contact — left on desktop, below CTA on mobile */}
            <div className="foot-reveal order-2 flex flex-col items-center gap-3 text-center lg:order-1 lg:items-start lg:text-left">
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: MUTED }}
              >
                Contact us
              </p>
              <a
                href="tel:+2347012345678"
                className="flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-blue-400"
              >
                <Phone className="h-3.5 w-3.5" style={{ color: BLUE }} />
                +234 701 234 5678
              </a>
              <a
                href="mailto:hello@studyhub.ng"
                className="flex items-center gap-2 text-sm"
                style={{ color: MUTED }}
              >
                <Mail className="h-3.5 w-3.5" style={{ color: BLUE }} />
                hello@studyhub.ng
              </a>
            </div>

            {/* Headline + email capture — center, the focal point */}
            <div className="order-1 flex flex-col items-center gap-5 text-center lg:order-2">
              <h2 className="max-w-sm text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
                <span className="block overflow-hidden">
                  <span className="foot-line inline-block">
                    Start your exam prep
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span className="foot-line inline-block">
                    journey <span style={{ color: BLUE }}>today</span>
                  </span>
                </span>
              </h2>
              <p
                className="foot-reveal max-w-xs text-sm leading-relaxed"
                style={{ color: MUTED }}
              >
                Get study tips, new course drops, and exam-prep resources —
                straight to your inbox.
              </p>

              <form
                onSubmit={handleSubscribe}
                className="foot-reveal flex w-full max-w-sm items-center gap-2 rounded-full border p-1.5 pl-5"
                style={{ background: INPUT_BG, borderColor: HAIRLINE }}
              >
                <input
                  ref={emailRef}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  aria-label="Email address"
                  className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                />
                <button
                  ref={submitBtnRef}
                  type="submit"
                  disabled={submitted}
                  aria-label={submitted ? "Subscribed" : "Subscribe"}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-bold text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-default"
                  style={{ background: submitted ? "#16A34A" : BLUE }}
                >
                  {submitted ? (
                    <Check className="foot-success-icon h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </button>
              </form>
            </div>

            {/* Social — right on desktop, below CTA on mobile */}
            <div className="foot-reveal order-3 flex flex-col items-center gap-3 lg:items-end">
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: MUTED }}
              >
                Follow us
              </p>
              {/* <div className="flex items-center gap-2.5">
                {SOCIALS.map((Icon, i) => (
                  <button
                    key={i}
                    aria-label="Social link"
                    className="foot-social flex h-9 w-9 items-center justify-center rounded-full border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    style={{ background: INPUT_BG, borderColor: HAIRLINE }}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </button>
                ))}
              </div> */}
            </div>
          </div>
        </div>

        {/* ═══ Link grid ═══ */}
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:mt-16">
          <div className="foot-col col-span-2 space-y-4 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: BLUE }}
              >
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Study<span style={{ color: BLUE }}>Hub</span>
              </span>
            </Link>
            <p
              className="max-w-xs text-sm leading-relaxed"
              style={{ color: MUTED }}
            >
              A cutting-edge learning platform offering comprehensive study
              tools to help students gain skills, pass exams, and achieve more.
            </p>
            <div
              className="flex items-start gap-2 text-sm"
              style={{ color: MUTED }}
            >
              <MapPin
                className="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
                style={{ color: BLUE }}
              />
              <span>123 Education Avenue, Lagos, Nigeria</span>
            </div>
          </div>

          <div className="foot-col">
            <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
              Quick links
            </h4>
            <ul className="space-y-3 text-sm">
              {QUICK_LINKS.map(([href, label]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group flex items-center gap-2 transition-colors hover:text-white"
                    style={{ color: MUTED }}
                  >
                    <span className="h-1 w-1 rounded-full bg-slate-600 transition-colors group-hover:bg-blue-400" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="foot-col col-span-2 sm:col-span-2">
            <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
              Courses
            </h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {SUBJECTS.map((s) => (
                <li key={s}>
                  <Link
                    href="/dashboard/courses/math-101"
                    className="group flex items-center gap-2 transition-colors hover:text-white"
                    style={{ color: MUTED }}
                  >
                    <span className="h-1 w-1 rounded-full bg-slate-600 transition-colors group-hover:bg-blue-400" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ═══ Bottom bar ═══ */}
        <div className="mt-12 h-px" style={{ background: HAIRLINE }} />
        <div
          className="mt-6 flex flex-col items-center justify-between gap-4 text-xs sm:flex-row"
          style={{ color: FAINT }}
        >
          <p>© {new Date().getFullYear()} StudyHub. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <span className="cursor-pointer transition-colors hover:text-white">
              Privacy policy
            </span>
            <span className="cursor-pointer transition-colors hover:text-white">
              Terms of service
            </span>
            <span className="cursor-pointer transition-colors hover:text-white">
              Cookie policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
