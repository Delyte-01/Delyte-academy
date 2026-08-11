"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  LayoutDashboard,
  GraduationCap,
  BarChart2,
  LogOut,
  Settings,
  ChevronRight,
  Sparkles,
  LifeBuoy,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useProfile } from "@/context/profile-context";
import { getStudentStreak } from "@/services/student-streak";

gsap.registerPlugin(useGSAP);

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/courses", label: "Courses", icon: GraduationCap },
  { href: "/dashboard/progress", label: "Progress", icon: BarChart2 },
  { href: "/dashboard/notification", label: "Notification", icon: Bell },
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

  const [streak, setStreak] = useState(0);

  const { profile } = useProfile();

  useEffect(() => {
    if (!profile?.id) return;

    getStudentStreak(profile.id).then(setStreak);
  }, [profile?.id]);

  const streakMessage =
    streak >= 30
      ? "Unstoppable!"
      : streak >= 14
        ? "Amazing consistency!"
        : streak >= 7
          ? "Keep it up!"
          : streak >= 3
            ? "Building momentum!"
            : streak >= 1
              ? "Great start!"
              : "Start learning today";

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    if (asideRef.current) {
      if (window.matchMedia(DESKTOP_QUERY).matches) {
        gsap.set(asideRef.current, { x: 0 });
      } else {
        gsap.set(asideRef.current, { x: "-100%" });
      }
    }
  }, []);

  // Entrance stagger for nav items + logo, once on mount.
  useGSAP(
    () => {
      gsap.fromTo(
        ".sidebar-reveal",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" },
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
        },
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
    { scope: asideRef },
  );

  // Drawer. GSAP owns `transform` once mounted, but the aside ships with
  // a Tailwind `-translate-x-full lg:translate-x-0` fallback so the very
  // first paint (before JS runs) is already correct on mobile — this is
  // what fixes the "sidebar flashes open on dashboard load" bug. GSAP's
  // inline transform simply overrides the class the instant it runs.
  const applyDrawerState = useCallback(() => {
    if (!asideRef.current || !overlayRef.current) return;

    const desktop = window.matchMedia(DESKTOP_QUERY).matches;

    if (desktop) {
      gsap.set(asideRef.current, { x: 0 });
      gsap.set(overlayRef.current, { display: "none", opacity: 0 });
      return;
    }

    if (isOpen) {
      gsap.set(overlayRef.current, { display: "block" });

      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.18,
        ease: "power1.out",
        overwrite: true,
      });

      gsap.to(asideRef.current, {
        x: 0,
        duration: 0.28,
        ease: "power3.out",
        overwrite: true,
      });
    } else {
      gsap.to(asideRef.current, {
        x: "-100%",
        duration: 0.22,
        ease: "power3.in",
        overwrite: true,
      });

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.18,
        overwrite: true,
        onComplete: () => gsap.set(overlayRef.current, { display: "none" }),
      });
    }
  }, [isOpen]);

  useGSAP(
    (context) => {
      context.add(applyDrawerState);
    },
    { dependencies: [isOpen, applyDrawerState], scope: asideRef },
  );

  // Re-sync if the viewport crosses the breakpoint without `isOpen` changing.
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    mql.addEventListener("change", applyDrawerState);
    return () => mql.removeEventListener("change", applyDrawerState);
  }, [applyDrawerState]);

  return (
    <>
      {/* Real full-screen backdrop — click to close. Hidden by default,
          only relevant on mobile (lg:hidden), sits BELOW the sidebar (z-30
          vs z-40) so the drawer stacks on top of it. */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-30 hidden bg-black/50 backdrop-blur-[1px] opacity-0 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* SIDEBAR — Tailwind translate classes give a correct hidden state
          on first paint; GSAP takes over transform after mount. */}
      <aside
        ref={asideRef}
        className="fixed top-0 left-0 z-40 flex h-full w-72 flex-col border-r border-border bg-card lg:sticky lg:h-screen"
      >
        {/* Logo */}
        <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border/60 px-4">
          <Link
            href="/admin"
            className="group flex items-center gap-2.5 overflow-hidden"
          >
            <div>
              <Image
                src={
                  "https://res.cloudinary.com/dk5mfu099/image/upload/v1785940928/logo-grad-1_bcqnbn.svg"
                }
                alt="delyte academy logo"
                width={120}
                height={120}
                className="object-cover w-[40px] height-[60px] "
              />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-extrabold tracking-tight text-foreground">
                Delyte
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-500">
                Academy
              </span>
            </div>
          </Link>
        </div>

        {/* Streak strip */}
        <div className="sidebar-reveal mx-4 mb-2 mt-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3">
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
              {streak > 0 ? `${streak}-day streak` : "No active streak"}
            </span>
          </div>

          <span className="text-[10px] font-medium text-orange-400">
            {streakMessage}
          </span>
        </div>
        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <p className="sidebar-reveal px-2 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
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
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
        <div className="sidebar-reveal mx-4 mb-4 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/70">
            <Sparkles className="h-4 w-4 text-[#6D5BF5]" />
          </div>
          <p className="text-[13px] font-bold text-foreground">Go Premium</p>
          <p className="mt-0.5 text-[11.5px] leading-snug text-muted-foreground">
            Unlock every course, past questions &amp; mock exams.
          </p>
          <Button size="sm" className="mt-3 w-full" disabled>
            Upgrade now
          </Button>
        </div>

        <Separator className="mx-4 w-auto" />

        {/* Footer */}
        <div className="sidebar-reveal space-y-1 px-4 py-4">
          <button className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <LifeBuoy className="h-4 w-4" strokeWidth={2.25} />
            Help &amp; support
          </button>
          <button
            onClick={onSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" strokeWidth={2.25} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
