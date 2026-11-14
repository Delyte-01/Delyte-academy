"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Plus,
  Search,
  ShieldCheck,
  Users,
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
import type { Course } from "@/types/course";

interface Item {
  id: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
  href: string;
  group: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSuperAdmin: boolean;
}

/** ⌘K / Ctrl+K: jump to an admin page or any course. Courses load from Supabase on first open. */
export default function AdminCommandPalette({ open, onOpenChange, isSuperAdmin }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [courses, setCourses] = useState<Course[] | null>(null);
  const requested = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!open || requested.current) return;
    requested.current = true;
    courseService
      .getCourses()
      .then(setCourses)
      .catch(() => setCourses([]));
  }, [open]);

  const pages = useMemo<Item[]>(() => {
    const base: Item[] = [
      { id: "p-home", label: "Dashboard", icon: LayoutDashboard, href: "/admin", group: "Jump to" },
      { id: "p-courses", label: "Courses", icon: BookOpen, href: "/admin/courses", group: "Jump to" },
      { id: "p-new", label: "Create a course", icon: Plus, href: "/admin/courses/create", group: "Actions" },
    ];
    if (isSuperAdmin) {
      base.splice(
        2,
        0,
        { id: "p-students", label: "Students", icon: Users, href: "/admin/students", group: "Jump to" },
        { id: "p-admins", label: "Admins", icon: ShieldCheck, href: "/admin/admins", group: "Jump to" },
      );
    }
    base.push({ id: "p-student", label: "Open student view", icon: GraduationCap, href: "/dashboard", group: "Actions" });
    return base;
  }, [isSuperAdmin]);

  const q = query.trim().toLowerCase();

  const items = useMemo<Item[]>(() => {
    const toItem = (c: Course): Item => ({
      id: `c-${c.id}`,
      label: c.title,
      hint: c.course_code,
      icon: BookOpen,
      href: `/admin/courses/${c.id}`,
      group: "Courses",
    });
    if (!q) return pages;
    const matchedCourses = (courses ?? [])
      .filter((c) => c.title.toLowerCase().includes(q) || c.course_code.toLowerCase().includes(q))
      .slice(0, 6)
      .map(toItem);
    return [...matchedCourses, ...pages.filter((p) => p.label.toLowerCase().includes(q))];
  }, [q, courses, pages]);

  const activeIndex = Math.min(active, Math.max(items.length - 1, 0));

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setQuery("");
      setActive(0);
    }
    onOpenChange(next);
  };

  const go = (item: Item) => {
    handleOpenChange(false);
    router.push(item.href);
  };

  const move = (next: number) => {
    setActive(next);
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${next}"]`)
      ?.scrollIntoView({ block: "nearest" });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (items.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move((activeIndex + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move((activeIndex - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(items[activeIndex]);
    }
  };

  const groups: { name: string; entries: { item: Item; index: number }[] }[] = [];
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
        <DialogTitle className="sr-only">Search admin</DialogTitle>
        <DialogDescription className="sr-only">
          Search courses or jump to a page. Use the arrow keys to move and Enter to open.
        </DialogDescription>

        <div className="flex items-center gap-3 border-b px-4">
          <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden />
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls="admin-palette-list"
            aria-activedescendant={items[activeIndex] ? `admin-palette-${items[activeIndex].id}` : undefined}
            aria-label="Search courses and pages"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search courses or jump to a page…"
            className="h-14 w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          <Kbd>Esc</Kbd>
        </div>

        <div
          ref={listRef}
          id="admin-palette-list"
          role="listbox"
          aria-label="Results"
          className="max-h-[min(55vh,420px)] overflow-y-auto p-2"
        >
          {items.length === 0 ? (
            <p className="px-3 py-10 text-center text-[15px] text-muted-foreground">
              {q && courses === null ? "Searching courses…" : "No matches. Try a course title or code."}
            </p>
          ) : (
            groups.map((group) => (
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
                      id={`admin-palette-${item.id}`}
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
                      <span className="min-w-0 flex-1 truncate text-[15px] font-medium">{item.label}</span>
                      {item.hint && <span className="shrink-0 text-[13px] text-muted-foreground">{item.hint}</span>}
                      {isActive && <ArrowRight className="size-4 shrink-0 text-primary" aria-hidden />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
