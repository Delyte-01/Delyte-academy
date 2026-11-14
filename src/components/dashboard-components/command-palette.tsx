"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart2,
  Bell,
  CornerDownLeft,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  type LucideIcon,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import { courseService } from "@/services/course";
import { useEnrollment } from "@/context/enrollment-context";
import type { Course } from "@/types/course";

interface PaletteItem {
  id: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
  href: string;
  group: string;
}

const PAGES: PaletteItem[] = [
  { id: "p-dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", group: "Jump to" },
  { id: "p-courses", label: "Courses", icon: GraduationCap, href: "/dashboard/courses", group: "Jump to" },
  { id: "p-progress", label: "Progress", icon: BarChart2, href: "/dashboard/progress", group: "Jump to" },
  { id: "p-notifications", label: "Notifications", icon: Bell, href: "/dashboard/notification", group: "Jump to" },
  { id: "p-settings", label: "Settings", icon: Settings, href: "/dashboard/settings", group: "Jump to" },
  { id: "p-feedback", label: "Feedback", icon: MessageSquare, href: "/dashboard/feedback", group: "Jump to" },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Global search + navigation (⌘K / Ctrl+K). Courses come from the same
 * Supabase service the catalogue uses, loaded the first time it opens.
 */
export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { enrollments } = useEnrollment();

  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  // null = not loaded yet
  const [courses, setCourses] = useState<Course[] | null>(null);
  const requested = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Global shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  // Lazy-load the catalogue the first time the palette opens
  useEffect(() => {
    if (!open || requested.current) return;
    requested.current = true;
    courseService
      .getPublishedCourses()
      .then(setCourses)
      .catch(() => setCourses([]));
  }, [open]);

  const q = query.trim().toLowerCase();

  const items = useMemo<PaletteItem[]>(() => {
    const toItem = (c: Pick<Course, "id" | "title" | "course_code">, group: string): PaletteItem => ({
      id: `c-${c.id}`,
      label: c.title,
      hint: c.course_code,
      icon: GraduationCap,
      href: `/dashboard/courses/${c.id}`,
      group,
    });

    if (!q) {
      const mine = enrollments
        .map((e) => e.course)
        .filter((c): c is Course => Boolean(c))
        .slice(0, 4)
        .map((c) => toItem(c, "Your courses"));
      return [...mine, ...PAGES];
    }

    const matchedCourses = (courses ?? [])
      .filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.course_code.toLowerCase().includes(q),
      )
      .slice(0, 6)
      .map((c) => toItem(c, "Courses"));

    const matchedPages = PAGES.filter((p) => p.label.toLowerCase().includes(q));

    return [
      ...matchedCourses,
      ...matchedPages,
      {
        id: "search-all",
        label: `Search all courses for “${query.trim()}”`,
        icon: Search,
        href: `/dashboard/courses?q=${encodeURIComponent(query.trim())}`,
        group: "Search",
      },
    ];
  }, [q, query, courses, enrollments]);

  const activeIndex = Math.min(active, Math.max(items.length - 1, 0));

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setQuery("");
      setActive(0);
    }
    onOpenChange(next);
  };

  const go = (item: PaletteItem) => {
    handleOpenChange(false);
    router.push(item.href);
  };

  const scrollActiveIntoView = (index: number) => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`);
    el?.scrollIntoView({ block: "nearest" });
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (activeIndex + 1) % items.length;
      setActive(next);
      scrollActiveIntoView(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = (activeIndex - 1 + items.length) % items.length;
      setActive(next);
      scrollActiveIntoView(next);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = items[activeIndex];
      if (item) go(item);
    }
  };

  const loadingCourses = open && q.length > 0 && courses === null;

  // Group headings, preserving order
  const groups: { name: string; entries: { item: PaletteItem; index: number }[] }[] = [];
  items.forEach((item, index) => {
    const last = groups[groups.length - 1];
    if (last && last.name === item.group) last.entries.push({ item, index });
    else groups.push({ name: item.group, entries: [{ item, index }] });
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[16%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl sm:p-0"
      >
        <DialogTitle className="sr-only">Search and jump to</DialogTitle>
        <DialogDescription className="sr-only">
          Search courses or jump to a page. Use the arrow keys to move and Enter to open.
        </DialogDescription>

        <div className="flex items-center gap-3 border-b px-4">
          <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden />
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={items[activeIndex] ? `palette-${items[activeIndex].id}` : undefined}
            aria-label="Search courses and pages"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Search courses or jump to a page…"
            className="h-14 w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          <Kbd>Esc</Kbd>
        </div>

        <div
          ref={listRef}
          id="palette-list"
          role="listbox"
          aria-label="Results"
          className="max-h-[min(55vh,420px)] overflow-y-auto p-2"
        >
          {groups.map((group) => (
            <div key={group.name} role="group" aria-label={group.name} className="pb-1">
              <p className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {group.name}
              </p>
              {group.entries.map(({ item, index }) => {
                const Icon = item.icon;
                const isActive = index === activeIndex;
                return (
                  <button
                    key={item.id}
                    id={`palette-${item.id}`}
                    data-index={index}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onMouseMove={() => setActive(index)}
                    onClick={() => go(item)}
                    className={cn(
                      "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors",
                      isActive ? "bg-primary-soft text-primary-soft-foreground" : "text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg",
                        isActive ? "bg-card text-primary" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[15px] font-medium">
                      {item.label}
                    </span>
                    {item.hint && (
                      <span className="shrink-0 text-[13px] text-muted-foreground">{item.hint}</span>
                    )}
                    {isActive && <ArrowRight className="size-4 shrink-0 text-primary" aria-hidden />}
                  </button>
                );
              })}
            </div>
          ))}

          {loadingCourses && (
            <p className="px-3 py-3 text-sm text-muted-foreground">Searching courses…</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t bg-muted/40 px-4 py-2.5 text-[13px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            to move
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>
              <CornerDownLeft />
            </Kbd>
            to open
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
