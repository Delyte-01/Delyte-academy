"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  BarChart2,
  LogOut,
  Settings,
  Flame,
  Bell,
  X,
} from "lucide-react";

import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useProfile } from "@/context/profile-context";
import { getStudentStreak } from "@/services/student-streak";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/courses", label: "Courses", icon: GraduationCap },
  { href: "/dashboard/progress", label: "Progress", icon: BarChart2 },
  { href: "/dashboard/notification", label: "Notifications", icon: Bell },
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
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const indicatorPlaced = useRef(false);

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
              : "Learn something today";

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };
  const activeHref = navItems.find((n) => isActive(n.href))?.href;

  // Sliding active pill: one element that glides between items (transform only).
  useGSAP(
    () => {
      const pill = indicatorRef.current;
      if (!pill) return;
      const target = activeHref ? itemRefs.current[activeHref] : null;
      if (!target) {
        gsap.set(pill, { opacity: 0 });
        return;
      }
      const y = target.offsetTop;
      if (!indicatorPlaced.current || prefersReducedMotion()) {
        gsap.set(pill, { y, opacity: 1 });
        indicatorPlaced.current = true;
      } else {
        gsap.to(pill, { y, opacity: 1, duration: 0.35, ease: "power3.out", overwrite: true });
      }
    },
    { dependencies: [activeHref], scope: asideRef },
  );

  // Entrance: nav items rise in once (skipped for reduced motion).
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-side-reveal]", {
        opacity: 0,
        y: 8,
        duration: 0.4,
        stagger: 0.04,
        ease: "power2.out",
        clearProps: "opacity,transform",
      });
    },
    { scope: asideRef },
  );

  // Drawer on small screens. The aside ships with a Tailwind translate fallback so
  // the first paint is already correct; GSAP takes over once mounted.
  const applyDrawerState = useCallback(() => {
    if (!asideRef.current || !overlayRef.current) return;

    const desktop = window.matchMedia(DESKTOP_QUERY).matches;
    const k = prefersReducedMotion() ? 0 : 1;

    if (desktop) {
      gsap.set(asideRef.current, { x: 0 });
      gsap.set(overlayRef.current, { display: "none", opacity: 0 });
      return;
    }

    if (isOpen) {
      gsap.set(overlayRef.current, { display: "block" });
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.18 * k, ease: "power1.out", overwrite: true });
      gsap.to(asideRef.current, { x: 0, duration: 0.28 * k, ease: "power3.out", overwrite: true });
    } else {
      gsap.to(asideRef.current, { x: "-100%", duration: 0.22 * k, ease: "power3.in", overwrite: true });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.18 * k,
        overwrite: true,
        onComplete: () => {
          if (overlayRef.current) gsap.set(overlayRef.current, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  useGSAP(
    (context) => {
      context.add(applyDrawerState);
    },
    { dependencies: [isOpen, applyDrawerState], scope: asideRef },
  );

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    mql.addEventListener("change", applyDrawerState);
    return () => mql.removeEventListener("change", applyDrawerState);
  }, [applyDrawerState]);

  // Escape closes the drawer
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-30 hidden bg-foreground/35 opacity-0 backdrop-blur-[2px] lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        ref={asideRef}
        aria-label="Sidebar"
        className="fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r bg-card max-lg:[transform:translateX(-100%)] lg:sticky lg:h-screen lg:w-64"
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between px-5">
          <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2.5 rounded-lg">
            <Image
              src="https://res.cloudinary.com/dk5mfu099/image/upload/v1785940928/logo-grad-1_bcqnbn.svg"
              alt="Delyte Academy logo"
              width={120}
              height={120}
              className="h-9 w-9 object-contain"
            />
            <span className="flex flex-col leading-none">
              <span className="font-heading text-[17px] font-extrabold tracking-tight text-foreground">
                Delyte
              </span>
              <span className="mt-0.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Academy
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nav */}
        <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 pb-3 pt-2">
          <p data-side-reveal className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Learn
          </p>
          <ul className="relative space-y-1">
            <span
              ref={indicatorRef}
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-11 rounded-xl bg-primary-soft opacity-0"
            />
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <li key={href} data-side-reveal>
                  <Link
                    ref={(el) => {
                      itemRefs.current[href] = el;
                    }}
                    href={href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative z-10 flex h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-semibold transition-colors duration-150 motion-reduce:transition-none",
                      active
                        ? "text-primary-soft-foreground"
                        : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
                    )}
                  >
                    <Icon className="size-[18px]" strokeWidth={2.1} aria-hidden />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Streak */}
        <div data-side-reveal className="mx-3 mb-3 rounded-2xl border bg-muted/50 p-3.5">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                streak > 0 ? "bg-warning-soft text-warning" : "bg-muted text-muted-foreground",
              )}
            >
              <Flame className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold tabular-nums text-foreground">
                {streak > 0 ? `${streak}-day streak` : "No active streak"}
              </p>
              <p className="truncate text-[13px] text-muted-foreground">{streakMessage}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div data-side-reveal className="border-t p-3">
          <button
            type="button"
            onClick={onSignOut}
            className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-[15px] font-semibold text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-[18px]" strokeWidth={2.1} aria-hidden />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
