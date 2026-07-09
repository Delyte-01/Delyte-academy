"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const INK = "#0B1220";
const BLUE = "#2454FF";
const SLATE = "#64748B";

// Same custom bezier utility as Hero/Courses — a candidate for
// extraction to a shared lib/easing.ts now that 3 files duplicate it.
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

const EASE_PREMIUM = cubicBezier(0.16, 1, 0.3, 1);
const EASE_SNAP = cubicBezier(0.65, 0, 0.35, 1);

const NAV_LINKS: [string, string][] = [
  ["/", "Home"],
  ["/dashboard", "Courses"],
  ["/dashboard/progress", "Progress"],
  ["/admin", "Admin"],
];

const SCROLL_THRESHOLD = 24;

export function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const barTopRef = useRef<HTMLSpanElement>(null);
  const barMidRef = useRef<HTMLSpanElement>(null);
  const barBotRef = useRef<HTMLSpanElement>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ── Scroll-driven chrome: transparent-over-hero → solid/compact ──
  useGSAP(
    () => {
      const header = headerRef.current;
      const inner = header?.querySelector(".nav-inner");
      if (!header || !inner) return;

      const applyState = (isScrolled: boolean, animate: boolean) => {
        const dur = animate ? 0.5 : 0;
        gsap.to(header, {
          backgroundColor: isScrolled
            ? "rgba(255,255,255,0.92)"
            : "rgba(255,255,255,0)",
          boxShadow: isScrolled
            ? "0 8px 24px -14px rgba(11,18,32,0.18)"
            : "0 0 0 rgba(0,0,0,0)",
          borderBottomColor: isScrolled
            ? "rgba(226,232,240,1)"
            : "rgba(226,232,240,0)",
          duration: dur,
          ease: EASE_PREMIUM,
          overwrite: "auto",
        });
        gsap.to(inner, {
          height: isScrolled ? 60 : 72,
          duration: dur,
          ease: EASE_PREMIUM,
          overwrite: "auto",
        });
        (header as HTMLElement).style.backdropFilter = isScrolled
          ? "blur(12px)"
          : "blur(0px)";
        (header as HTMLElement).style.setProperty(
          "-webkit-backdrop-filter",
          isScrolled ? "blur(12px)" : "blur(0px)"
        );
      };

      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const isScrolled = window.scrollY > SCROLL_THRESHOLD;
          setScrolled((prev) => {
            if (prev !== isScrolled) applyState(isScrolled, true);
            return isScrolled;
          });
          ticking = false;
        });
      };

      applyState(window.scrollY > SCROLL_THRESHOLD, false);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    },
    { scope: headerRef }
  );

  // ── Hamburger → X morph ──
  useGSAP(() => {
    const top = barTopRef.current;
    const mid = barMidRef.current;
    const bot = barBotRef.current;
    if (!top || !mid || !bot) return;

    if (mobileOpen) {
      gsap.to(top, { rotate: 45, y: 6, duration: 0.4, ease: EASE_PREMIUM });
      gsap.to(mid, { opacity: 0, duration: 0.2, ease: EASE_SNAP });
      gsap.to(bot, { rotate: -45, y: -6, duration: 0.4, ease: EASE_PREMIUM });
    } else {
      gsap.to(top, { rotate: 0, y: 0, duration: 0.4, ease: EASE_PREMIUM });
      gsap.to(mid, { opacity: 1, duration: 0.3, delay: 0.1, ease: EASE_SNAP });
      gsap.to(bot, { rotate: 0, y: 0, duration: 0.4, ease: EASE_PREMIUM });
    }
  }, [mobileOpen]);

  // ── Mobile panel: clip-path wipe + staggered content ──
  useGSAP(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) return;

    const links = gsap.utils.toArray<HTMLElement>(".mobile-link");
    const ctas = gsap.utils.toArray<HTMLElement>(".mobile-cta");

    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      gsap.set(panel, { display: "block" });
      gsap.set(backdrop, { display: "block" });
      gsap.set(links, { y: 16, opacity: 0 });
      gsap.set(ctas, { y: 16, opacity: 0 });

      gsap.to(backdrop, { opacity: 1, duration: 0.4, ease: EASE_SNAP });

      const tl = gsap.timeline();
      tl.fromTo(
        panel,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: EASE_PREMIUM }
      )
        .to(
          links,
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            stagger: 0.06,
            ease: EASE_PREMIUM,
          },
          "-=0.35"
        )
        .to(
          ctas,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: EASE_PREMIUM,
          },
          "-=0.3"
        );
    } else {
      gsap.to(backdrop, {
        opacity: 0,
        duration: 0.3,
        ease: EASE_SNAP,
        onComplete: () => gsap.set(backdrop, { display: "none" }),
      });
      gsap.to(panel, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.45,
        ease: EASE_SNAP,
        onComplete: () => gsap.set(panel, { display: "none" }),
      });
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  // Escape key + route-change safety: always release scroll lock on unmount.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b"
      style={{
        borderColor: "transparent",
        willChange: "background-color, height",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="nav-inner flex items-center justify-between"
          style={{ height: 72 }}
        >
          <Link href="/" className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: INK }}
            >
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-extrabold" style={{ color: INK }}>
              Study<span style={{ color: BLUE }}>Hub</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map(([href, label]) => (
              <Link
                key={label}
                href={href}
                className="text-sm font-medium transition-colors hover:text-[--hover]"
                style={{ color: SLATE, ["--hover" as string]: INK }}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition-colors hover:border-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: INK }}
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg px-5 py-2 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background: INK }}
            >
              Sign up
            </Link>
          </div>

          {/* Custom 3-bar hamburger — morphs into an X, not a crossfade */}
          <button
            className="relative flex h-9 w-9 items-center justify-center md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span className="flex h-4 w-5 flex-col justify-between">
              <span
                ref={barTopRef}
                className="block h-[2px] w-full rounded-full"
                style={{ background: INK, transformOrigin: "center" }}
              />
              <span
                ref={barMidRef}
                className="block h-[2px] w-full rounded-full"
                style={{ background: INK }}
              />
              <span
                ref={barBotRef}
                className="block h-[2px] w-full rounded-full"
                style={{ background: INK, transformOrigin: "center" }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={() => setMobileOpen(false)}
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm md:hidden"
        style={{ display: "none", opacity: 0 }}
        aria-hidden
      />

      {/* Mobile panel */}
      <div
        ref={panelRef}
        className="absolute inset-x-0 top-full z-50 border-t border-slate-100 bg-white px-5 pb-8 pt-6 shadow-2xl shadow-slate-900/10 md:hidden"
        style={{ display: "none", clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map(([href, label]) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="mobile-link rounded-lg px-3 py-3 text-base font-semibold transition-colors hover:bg-slate-50"
              style={{ color: INK }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 flex gap-3 border-t border-slate-100 pt-6">
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="mobile-cta flex-1 rounded-lg border border-slate-200 py-3 text-center text-sm font-semibold"
            style={{ color: INK }}
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            onClick={() => setMobileOpen(false)}
            className="mobile-cta flex-1 rounded-lg py-3 text-center text-sm font-bold text-white"
            style={{ background: INK }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
