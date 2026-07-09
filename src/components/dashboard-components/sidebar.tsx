"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  BookOpen,
  LayoutDashboard,
  GraduationCap,
  BarChart2,
  LogOut,
  X,
  Settings,
  ChevronRight,
  Sparkles,
  LifeBuoy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

gsap.registerPlugin(useGSAP);

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/dashboard/courses/math-101",
    label: "Courses",
    icon: GraduationCap,
  },
  { href: "/dashboard/progress", label: "Progress", icon: BarChart2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

const DESKTOP_QUERY = "(min-width: 1024px)";

export default function Sidebar({ isOpen, onClose, onSignOut }: SidebarProps) {
  const pathname = usePathname();
  const asideRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const flameRef = useRef<SVGSVGElement>(null);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  // Entrance stagger for nav items + logo, once on mount. Only touches
  // the children (nav rows / cards), never the aside's own transform,
  // so it can never fight the drawer animation below.
  useGSAP(
    () => {
      gsap.fromTo(
        ".sidebar-reveal",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" }
      );
      gsap.fromTo(
        ".sidebar-item",
        { opacity: 0, x: -14 },
        {
          opacity: 1,
          x: 0,
          duration: 0.45,
          stagger: 0.05,
          delay: 0.15,
          ease: "power2.out",
        }
      );

      if (flameRef.current) {
        gsap.to(flameRef.current, {
          scale: 1.12,
          duration: 0.9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          transformOrigin: "50% 100%",
        });
      }
    },
    { scope: asideRef }
  );

  // Drawer. GSAP is the SINGLE owner of `transform` on the aside —
  // there is no Tailwind translate-x class fighting it anymore, which
  // was the root cause of the previous "gap on desktop / dead on
  // mobile" behaviour. The breakpoint is read synchronously from
  // matchMedia at the moment the animation runs (not from React
  // state), so there's no first-paint race: it's correct immediately,
  // every time, on mount and on every open/close.

  // 1. Wrap the core logic in useCallback so its reference remains stable
  const applyDrawerState = useCallback(() => {
    if (!asideRef.current || !overlayRef.current) return;
    const desktop = window.matchMedia(DESKTOP_QUERY).matches;

    if (desktop) {
      gsap.set(asideRef.current, { clearProps: "transform" });
      gsap.set(overlayRef.current, { display: "none", opacity: 0 });
      return;
    }

    if (isOpen) {
      gsap.set(overlayRef.current, { display: "block" });
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.25,
        ease: "power1.out",
        overwrite: true,
      });
      gsap.to(asideRef.current, {
        xPercent: 0,
        duration: 0.4,
        ease: "power3.out",
        overwrite: true,
      });
    } else {
      gsap.to(asideRef.current, {
        xPercent: -100,
        duration: 0.35,
        ease: "power3.in",
        overwrite: true,
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.25,
        overwrite: true,
        onComplete: () => gsap.set(overlayRef.current, { display: "none" }),
      });
    }
  }, [isOpen]); // Add isOpen here since the logic depends on it

  // 2. Use the internal contextSafe provided by the hook callback argument
  useGSAP(
    (context) => {
      // context.add() or wrapping it ensures it runs safely inside this GSAP context
      context.add(applyDrawerState);
    },
    { dependencies: [isOpen, applyDrawerState], scope: asideRef }
  );

  // Re-sync if the viewport crosses the breakpoint without `isOpen`
  // changing — e.g. rotating a tablet, or dragging the devtools
  // responsive-mode width across 1024px.
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    mql.addEventListener("change", applyDrawerState);
    return () => mql.removeEventListener("change", applyDrawerState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyDrawerState]);

  return (
    <>
      {/* Mobile overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-30 hidden bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* SIDEBAR — no translate-x classes; GSAP owns transform entirely */}
      <aside
        ref={asideRef}
        className="fixed top-0 left-0 z-40 flex h-full w-72 flex-col border-r border-slate-100 bg-white lg:sticky lg:h-screen"
      >
        {/* Logo */}
        <div className="sidebar-reveal flex items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#6D5BF5_0%,#9B6BF0_100%)] shadow-[0_6px_16px_-4px_rgba(109,91,245,0.55)]">
              <BookOpen className="h-4.5 w-4.5 text-white" strokeWidth={2.25} />
            </div>
            <span className="font-[var(--font-display)] text-[19px] font-extrabold tracking-tight text-slate-900">
              Study<span className="text-[#6D5BF5]">Hub</span>
            </span>
          </Link>
          <button
            className="text-slate-400 transition-colors hover:text-slate-700 lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Streak strip */}
        <div className="sidebar-reveal mx-4 mb-2 flex items-center justify-between rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <svg
              ref={flameRef}
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
            >
              <path
                d="M12 2c1 3-2 4-2 7a4 4 0 108 0c0-1-.5-2-1-2 .5 2-1 3-2 2 1-2-1-3-1-5s-1.5-1.5-2-2z"
                fill="url(#flameGrad)"
              />
              <defs>
                <linearGradient id="flameGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#F59E0B" />
                  <stop offset="1" stopColor="#EF4444" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-xs font-semibold text-orange-700">
              12-day streak
            </span>
          </div>
          <span className="text-[10px] font-medium text-orange-400">
            Keep it up!
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <p className="sidebar-reveal px-2 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Main menu
          </p>
          <ul className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <li key={href} className="sidebar-item">
                  <Link
                    href={href}
                    onClick={onClose}
                    className={`group relative flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-all duration-200 ${
                      active
                        ? "text-white shadow-[0_8px_18px_-6px_rgba(109,91,245,0.55)]"
                        : "text-slate-500 hover:bg-violet-50/70 hover:text-slate-900"
                    }`}
                    style={
                      active
                        ? {
                            background:
                              "linear-gradient(135deg, #6D5BF5 0%, #9B6BF0 55%, #E879B9 100%)",
                          }
                        : undefined
                    }
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" strokeWidth={2.25} />
                      {label}
                    </span>
                    {active && <ChevronRight className="h-3.5 w-3.5" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Upgrade card */}
        <div className="sidebar-reveal mx-4 mb-4 overflow-hidden rounded-2xl bg-[linear-gradient(160deg,#EDE9FE_0%,#FCE7F3_100%)] p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/70">
            <Sparkles className="h-4 w-4 text-[#6D5BF5]" />
          </div>
          <p className="text-[13px] font-bold text-slate-800">Go Premium</p>
          <p className="mt-0.5 text-[11.5px] leading-snug text-slate-500">
            Unlock every course, past questions &amp; mock exams.
          </p>
          <Button size="sm" className="mt-3 w-full">
            Upgrade now
          </Button>
        </div>

        <Separator className="mx-4 w-auto" />

        {/* Footer */}
        <div className="sidebar-reveal space-y-1 px-4 py-4">
          <button className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900">
            <LifeBuoy className="h-4 w-4" strokeWidth={2.25} />
            Help &amp; support
          </button>
          <button
            onClick={onSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" strokeWidth={2.25} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
