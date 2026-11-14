"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import {
  type LucideIcon,
  LayoutGrid,
  FolderTree,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorkspaceTabItem {
  value: string;
  label: string;
  icon: LucideIcon;
  /** Real count shown as a small badge. Omit when unknown. */
  count?: number;
}

interface WorkspaceTabsProps {
  tabs: WorkspaceTabItem[];
  value: string;
  onChange: (value: string) => void;
}

/**
 * Underline tab bar shared by the course and topic workspaces. Sticks to the
 * top of the admin scroll area; a single GSAP-slid indicator tracks the active
 * tab. Arrow / Home / End keys move between tabs.
 */
export function WorkspaceTabs({ tabs, value, onChange }: WorkspaceTabsProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const placed = useRef(false);

  const place = (animate: boolean) => {
    const el = triggerRefs.current[value];
    const indicator = indicatorRef.current;
    if (!el || !indicator) return;
    gsap.to(indicator, {
      x: el.offsetLeft,
      width: el.offsetWidth,
      duration: animate && !prefersReducedMotion() ? 0.35 : 0,
      ease: "power3.out",
    });
    el.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  useLayoutEffect(() => {
    place(placed.current);
    placed.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, tabs]);

  useEffect(() => {
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.value === value);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    onChange(tabs[next].value);
    triggerRefs.current[tabs[next].value]?.focus();
  };

  return (
    <div className="sticky top-0 z-20 -mx-4 border-b bg-background/90 px-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div
        ref={barRef}
        role="tablist"
        aria-label="Workspace sections"
        onKeyDown={onKeyDown}
        className="relative flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map(({ value: v, label, icon: Icon, count }) => {
          const active = v === value;
          return (
            <button
              key={v}
              ref={(el) => {
                triggerRefs.current[v] = el;
              }}
              role="tab"
              type="button"
              id={`tab-${v}`}
              aria-selected={active}
              aria-controls={`panel-${v}`}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(v)}
              className={cn(
                "relative inline-flex min-h-12 shrink-0 items-center gap-2 px-3.5 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {label}
              {count !== undefined && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-xs font-bold tabular-nums",
                    active
                      ? "bg-primary-soft text-primary-soft-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
        <span
          ref={indicatorRef}
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-primary"
          style={{ willChange: "transform, width" }}
        />
      </div>
    </div>
  );
}

export const courseTabs: WorkspaceTabItem[] = [
  { value: "overview", label: "Overview", icon: LayoutGrid },
  { value: "topics", label: "Topics", icon: FolderTree },
  { value: "students", label: "Students", icon: Users },
  { value: "analytics", label: "Analytics", icon: BarChart3 },
  { value: "settings", label: "Settings", icon: Settings },
];
