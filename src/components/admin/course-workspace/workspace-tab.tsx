"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LucideIcon,
  LayoutGrid,
  FolderTree,
  FileText,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorkspaceTabItem {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface WorkspaceTabsProps {
  tabs: WorkspaceTabItem[];
  value: string;
  onChange: (value: string) => void;
}

export function WorkspaceTabs({ tabs, value, onChange }: WorkspaceTabsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const hasAnimatedPill = useRef(false);

  const movePill = (animate: boolean) => {
    const pill = pillRef.current;
    const activeEl = triggerRefs.current[value];
    if (!pill || !activeEl) return;

    gsap.to(pill, {
      x: activeEl.offsetLeft,
      y: activeEl.offsetTop,
      width: activeEl.offsetWidth,
      height: activeEl.offsetHeight,
      duration: animate ? 0.35 : 0.01,
      ease: "power3.out",
    });
  };

  // Track the active trigger with the sliding pill
  useLayoutEffect(() => {
    movePill(hasAnimatedPill.current);
    hasAnimatedPill.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, tabs]);

  // Trigger widths change at the `sm` breakpoint (labels show/hide), so
  // reposition the pill on resize without animating the snap.
  useEffect(() => {
    const handleResize = () => movePill(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Entrance for the whole tab bar
  useEffect(() => {
    if (!rootRef.current) return;
    gsap.fromTo(
      rootRef.current,
      { opacity: 0, y: -6 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
    );
  }, []);

  return (
    <div ref={rootRef}>
      <Tabs value={value} onValueChange={onChange}>
        <div className="overflow-x-auto">
          <TabsList
            ref={listRef}
            className="relative h-auto w-fit gap-1 border border-border/60 bg-muted/60 p-1"
          >
            {/* Sliding active pill */}
            <div
              ref={pillRef}
              className="pointer-events-none absolute left-0 top-0 z-0 rounded-md bg-background shadow-sm ring-1 ring-border/60"
              style={{ willChange: "transform, width, height" }}
            />
            {tabs.map(({ value: v, label, icon: Icon }) => (
              <TabsTrigger
                key={v}
                value={v}
                ref={(el) => {
                  triggerRefs.current[v] = el;
                }}
                className={cn(
                  "relative z-10 flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-200",
                  "data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none",
                  "hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
}

export const courseTabs: WorkspaceTabItem[] = [
  { value: "overview", label: "Overview", icon: LayoutGrid },
  { value: "topics", label: "Topics", icon: FolderTree },
  { value: "resources", label: "Resources", icon: FileText },
  { value: "practice", label: "Practice Sets", icon: ClipboardList },
  { value: "students", label: "Students", icon: Users },
  { value: "analytics", label: "Analytics", icon: BarChart3 },
  { value: "settings", label: "Settings", icon: Settings },
];
