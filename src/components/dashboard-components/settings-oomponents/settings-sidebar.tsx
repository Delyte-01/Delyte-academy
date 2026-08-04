"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { User, Settings, Shield, Trash2, Info } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export interface SettingsNavItem {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  danger?: boolean;
}

export const SETTINGS_NAV: SettingsNavItem[] = [
  {
    id: "profile",
    label: "Profile",
    description: "Your public info & avatar",
    icon: User,
  },
  {
    id: "account",
    label: "Account",
    description: "Email",
    icon: Info,
  },
  {
    id: "preferences",
    label: "Learning Preferences",
    description: "Pace, reminders & goals",
    icon: Settings,
  },
  {
    id: "security",
    label: "Security",
    description: "Password & sessions",
    icon: Shield,
  },
  {
    id: "danger",
    label: "Danger Zone",
    description: "Delete or deactivate account",
    icon: Trash2,
    danger: true,
  },
];

interface SettingsNavProps {
  active: string;
  onSelect: (id: string) => void;
}

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const mainItems = SETTINGS_NAV.filter((item) => !item.danger);
const dangerItems = SETTINGS_NAV.filter((item) => item.danger);

/* ---------------------------------------------------------------------- */
/*  Desktop: vertical list with a sliding highlight behind the active item */
/* ---------------------------------------------------------------------- */

export function SettingsSidebar({ active, onSelect }: SettingsNavProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const isFirstRun = useRef(true);

  const activeItem = SETTINGS_NAV.find((item) => item.id === active);

  useEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    const activeButton = buttonRefs.current.get(active);
    if (!nav || !indicator || !activeButton) return;

    const navRect = nav.getBoundingClientRect();
    const btnRect = activeButton.getBoundingClientRect();
    const top = btnRect.top - navRect.top;

    const animate = !isFirstRun.current && !prefersReducedMotion();
    isFirstRun.current = false;

    if (animate) {
      const tween: gsap.core.Tween = gsap.to(indicator, {
        top,
        height: btnRect.height,
        duration: 0.35,
        ease: "power3.out",
      });
      return () => {
        tween.kill();
      };
    }

    gsap.set(indicator, { top, height: btnRect.height, opacity: 1 });
  }, [active]);

  useEffect(() => {
    const handleResize = (): void => {
      const nav = navRef.current;
      const indicator = indicatorRef.current;
      const activeButton = buttonRefs.current.get(active);
      if (!nav || !indicator || !activeButton) return;

      const navRect = nav.getBoundingClientRect();
      const btnRect = activeButton.getBoundingClientRect();
      gsap.set(indicator, {
        top: btnRect.top - navRect.top,
        height: btnRect.height,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = (item: SettingsNavItem): ReactNode => {
    const Icon = item.icon;
    const isActive = active === item.id;

    return (
      <button
        key={item.id}
        ref={(el) => {
          if (el) buttonRefs.current.set(item.id, el);
          else buttonRefs.current.delete(item.id);
        }}
        type="button"
        onClick={() => onSelect(item.id)}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "relative z-10 flex w-full items-start gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium transition-colors duration-200",
          item.danger
            ? isActive
              ? "text-rose-600 dark:text-rose-400"
              : "text-rose-500/75 hover:text-rose-600 dark:text-rose-400/75"
            : isActive
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
        )}
      >
        <span
          className={cn(
            "mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
            item.danger
              ? isActive
                ? "bg-rose-500/15"
                : "bg-rose-500/5"
              : isActive
                ? "bg-primary/15"
                : "bg-muted",
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate">{item.label}</span>
          {item.description && (
            <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground/75">
              {item.description}
            </span>
          )}
        </span>
      </button>
    );
  };

  return (
    <nav ref={navRef} className="relative" aria-label="Settings">
      <div
        ref={indicatorRef}
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 z-0 rounded-xl opacity-0 transition-colors duration-200",
          activeItem?.danger
            ? "bg-rose-500/10 dark:bg-rose-500/15"
            : "bg-primary/10 dark:bg-primary/15",
        )}
        style={{ top: 0, height: 0 }}
      />
      <div className="space-y-1">{mainItems.map(renderItem)}</div>
      <div className="mt-4 space-y-1 border-t border-border/60 pt-4">
        {dangerItems.map(renderItem)}
      </div>
    </nav>
  );
}

/* ---------------------------------------------------------------------- */
/*  Mobile: horizontal scroller with a sliding underline                  */
/* ---------------------------------------------------------------------- */

export function SettingsMobileNav({ active, onSelect }: SettingsNavProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const isFirstRun = useRef(true);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const indicator = indicatorRef.current;
    const activeButton = buttonRefs.current.get(active);
    if (!scroller || !indicator || !activeButton) return;

    const scrollerRect = scroller.getBoundingClientRect();
    const btnRect = activeButton.getBoundingClientRect();
    const left = btnRect.left - scrollerRect.left + scroller.scrollLeft;

    const animate = !isFirstRun.current && !prefersReducedMotion();

    if (animate) {
      gsap.to(indicator, {
        left,
        width: btnRect.width,
        duration: 0.3,
        ease: "power3.out",
      });
    } else {
      gsap.set(indicator, { left, width: btnRect.width, opacity: 1 });
    }

    activeButton.scrollIntoView({
      behavior: isFirstRun.current ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });

    isFirstRun.current = false;
  }, [active]);

  return (
    <div
      ref={scrollerRef}
      className="relative flex gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        ref={indicatorRef}
        aria-hidden="true"
        className="absolute bottom-0 h-0.5 rounded-full bg-primary opacity-0"
        style={{ left: 0, width: 0 }}
      />
      {SETTINGS_NAV.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;

        return (
          <button
            key={item.id}
            ref={(el) => {
              if (el) buttonRefs.current.set(item.id, el);
              else buttonRefs.current.delete(item.id);
            }}
            type="button"
            onClick={() => onSelect(item.id)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-xs font-semibold transition-colors duration-200",
              item.danger
                ? isActive
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-rose-500/70"
                : isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}