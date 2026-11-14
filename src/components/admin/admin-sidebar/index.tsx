"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import {
  BookOpen,
  ChevronLeft,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/profile";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Only shown to super admins (unchanged permission rule). */
  superOnly?: boolean;
}

export const navItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/students", label: "Students", icon: Users, superOnly: true },
  { href: "/admin/admins", label: "Admins", icon: ShieldCheck, superOnly: true },
];

const ICON_MARK =
  "https://res.cloudinary.com/dk5mfu099/image/upload/v1784147337/Group_1_bpvzwx.svg";

export function roleLabel(role?: Profile["role"]) {
  return role === "super_admin" ? "Super admin" : "Admin";
}

export function initialsOf(profile: Profile | null) {
  const source = profile?.full_name?.trim() || profile?.email || "A";
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "A") + (parts[1]?.[0] ?? "")).toUpperCase();
}

interface AdminSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  profile: Profile | null;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
  handleSignOut: () => void;
}

export default function AdminSidebar({
  collapsed,
  mobileOpen,
  profile,
  onCloseMobile,
  onToggleCollapse,
  handleSignOut,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const pillRef = useRef<HTMLDivElement>(null);
  const placed = useRef(false);

  const isSuper = profile?.role === "super_admin";
  const visible = navItems.filter((item) => !item.superOnly || isSuper);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  const activeItem = visible.find((n) => isActive(n.href));

  // Sliding brand pill behind the active item (transform/height only).
  useLayoutEffect(() => {
    const container = navRef.current;
    const pill = pillRef.current;
    const el = activeItem ? itemRefs.current[activeItem.href] : null;
    if (!container || !pill) return;
    if (!el) {
      gsap.set(pill, { opacity: 0 });
      return;
    }
    const top = el.offsetTop;
    const instant = !placed.current || prefersReducedMotion();
    gsap.to(pill, {
      y: top,
      height: el.offsetHeight,
      opacity: 1,
      duration: instant ? 0 : 0.4,
      ease: "power3.out",
    });
    placed.current = true;
  }, [pathname, collapsed, activeItem, isSuper]);

  // Close the mobile drawer with Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCloseMobile();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen, onCloseMobile]);

  return (
    <>
      {mobileOpen && (
        <div
          aria-hidden
          className="fixed inset-0 z-40 bg-foreground/40 animate-fade-in lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        aria-label="Admin navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-dvh flex-col border-r bg-card transition-[width,transform] duration-300 ease-in-out motion-reduce:transition-none",
          "lg:static lg:translate-x-0",
          collapsed ? "lg:w-[76px]" : "lg:w-[264px]",
          mobileOpen ? "w-[280px] translate-x-0 shadow-float" : "w-[280px] -translate-x-full lg:translate-x-0",
        )}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <Link href="/admin" className="flex items-center gap-2.5 overflow-hidden rounded-lg" aria-label="Delyte admin home">
            {collapsed ? (
              <Image src={ICON_MARK} alt="Delyte" width={36} height={36} className="hidden h-9 w-9 object-contain lg:block" />
            ) : null}
            <span className={cn(collapsed && "lg:hidden")}>
              <Logo className="w-[124px]" />
            </span>
          </Link>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="flex size-11 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {/* Signed-in admin (real profile) */}
        <div className={cn("shrink-0 px-3 pt-4", collapsed && "lg:px-2")}>
          <div className={cn("flex items-center gap-3 rounded-xl bg-muted/60 p-2.5", collapsed && "lg:justify-center lg:bg-transparent lg:p-0")}>
            <Avatar className="size-10 shrink-0">
              <AvatarFallback className="bg-primary-soft text-sm font-bold text-primary-soft-foreground">
                {initialsOf(profile)}
              </AvatarFallback>
            </Avatar>
            <div className={cn("min-w-0", collapsed && "lg:hidden")}>
              <p className="truncate text-sm font-bold text-foreground">
                {profile?.full_name || profile?.username || "Admin"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {profile ? roleLabel(profile.role) : " "}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav ref={navRef} className="relative flex-1 space-y-1 overflow-y-auto px-3 py-4 [scrollbar-width:thin]">
          <div
            ref={pillRef}
            aria-hidden
            className="pointer-events-none absolute left-3 top-0 z-0 w-[calc(100%-1.5rem)] rounded-xl bg-primary-soft opacity-0"
            style={{ willChange: "transform, height" }}
          />
          <p className={cn("relative z-10 px-3 pb-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground", collapsed && "lg:hidden")}>
            Manage
          </p>
          {visible.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                ref={(el) => {
                  itemRefs.current[href] = el;
                }}
                onClick={onCloseMobile}
                aria-current={active ? "page" : undefined}
                title={collapsed ? label : undefined}
                className={cn(
                  "group relative z-10 flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-semibold transition-colors",
                  active ? "text-primary-soft-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "lg:justify-center lg:px-0",
                )}
              >
                <Icon className={cn("size-[18px] shrink-0", active && "text-primary")} aria-hidden />
                <span className={cn("truncate", collapsed && "lg:sr-only")}>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0 space-y-1 border-t p-3">
          <Link
            href="/dashboard"
            title={collapsed ? "Student view" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              collapsed && "lg:justify-center lg:px-0",
            )}
          >
            <GraduationCap className="size-[18px] shrink-0" aria-hidden />
            <span className={cn(collapsed && "lg:sr-only")}>Student view</span>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            title={collapsed ? "Log out" : undefined}
            className={cn(
              "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
              collapsed && "lg:justify-center lg:px-0",
            )}
          >
            <LogOut className="size-[18px] shrink-0" aria-hidden />
            <span className={cn(collapsed && "lg:sr-only")}>Log out</span>
          </button>
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={collapsed}
            className="hidden min-h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex"
          >
            <ChevronLeft className={cn("size-4 transition-transform duration-300 motion-reduce:transition-none", collapsed && "rotate-180")} aria-hidden />
            <span className={cn(collapsed && "sr-only")}>Collapse</span>
          </button>
        </div>
      </aside>
    </>
  );
}
