"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import {
  LayoutDashboard,
  BookOpen,
  ListTree,
  ClipboardList,
  HelpCircle,
  FileText,
  Users,
  Megaphone,
  BarChart3,
  User,
  Settings,
  ChevronLeft,
  GraduationCap,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/topics", label: "Topics", icon: ListTree },
  { href: "/admin/practice-sets", label: "Practice Sets", icon: ClipboardList },
  { href: "/admin/questions", label: "Questions", icon: HelpCircle },
  { href: "/admin/resources", label: "Resources (PDFs)", icon: FileText },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
  handleSignOut: () => void;
}

export default function AdminSidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapse,
  handleSignOut
}: AdminSidebarProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const pillRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);
  const hasAnimatedPill = useRef(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const activeItem = navItems.find((n) => isActive(n.href));

  // Track the active nav item with a sliding gradient pill (signature element)
  useLayoutEffect(() => {
    const container = navRef.current;
    const pill = pillRef.current;
    const activeEl = activeItem ? itemRefs.current[activeItem.href] : null;
    if (!container || !pill || !activeEl) return;

    const cRect = container.getBoundingClientRect();
    const aRect = activeEl.getBoundingClientRect();
    const top = aRect.top - cRect.top + container.scrollTop;

    gsap.to(pill, {
      y: top,
      height: aRect.height,
      opacity: 1,
      duration: hasAnimatedPill.current ? 0.45 : 0.01,
      ease: "power3.out",
    });
    hasAnimatedPill.current = true;
  }, [pathname, collapsed, activeItem]);

  // Staggered entrance for nav items on first mount
  useEffect(() => {
    const items = gsap.utils.toArray<HTMLElement>(
      navRef.current?.querySelectorAll("[data-nav-item]") ?? []
    );
    gsap.fromTo(
      items,
      { opacity: 0, x: -10 },
      {
        opacity: 1,
        x: 0,
        duration: 0.45,
        stagger: 0.035,
        ease: "power2.out",
        delay: 0.05,
      }
    );
  }, []);

  // Sync chevron rotation to persisted collapsed state on mount
  useEffect(() => {
    gsap.set(chevronRef.current, { rotate: collapsed ? 180 : 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleCollapse = () => {
    gsap.to(chevronRef.current, {
      rotate: collapsed ? 0 : 180,
      duration: 0.35,
      ease: "power2.inOut",
    });
    onToggleCollapse();
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm duration-200 animate-in fade-in lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col overflow-hidden border-r border-border/60 bg-card/95 backdrop-blur-xl transition-[width,transform] duration-300 ease-in-out",
          "lg:static lg:translate-x-0",
          collapsed ? "lg:w-[76px]" : "lg:w-[268px]",
          mobileOpen
            ? "w-[268px] translate-x-0 shadow-2xl"
            : "-translate-x-full w-[268px] lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border/60 px-4">
          <Link
            href="/admin"
            className="group flex items-center gap-2.5 overflow-hidden"
          >
            <div>
              <Image
                src={
                  "https://res.cloudinary.com/dk5mfu099/image/upload/v1784147337/Group_1_bpvzwx.svg"
                }
                alt="delyte academy logo"
                width={120}
                height={120}
                className="object-cover w-[40px] height-[60px] "
              />
            </div>
            {!collapsed && (
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-extrabold tracking-tight text-foreground">
                  Delyte Academy
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-500">
                  Admin Panel
                </span>
              </div>
            )}
          </Link>
          <button
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
            onClick={onCloseMobile}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Admin profile */}
        {!collapsed && (
          <div className="flex-shrink-0 border-b border-border/60 px-4 py-4">
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-2.5">
              <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-700 text-sm font-bold text-primary-foreground ring-2 ring-background">
                DA
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  Super Admin
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  admin@delyte.academy
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav
          ref={navRef}
          className="relative flex-1 space-y-1 overflow-y-auto px-3 py-4 [scrollbar-width:thin]"
        >
          {/* Sliding active pill */}
          <div
            ref={pillRef}
            className="pointer-events-none absolute left-3 top-0 z-0 w-[calc(100%-1.5rem)] rounded-xl bg-gradient-to-r from-primary to-indigo-600 opacity-0 shadow-lg shadow-primary/25"
            style={{ willChange: "transform, height" }}
          />

          {!collapsed && (
            <p className="relative z-10 px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Management
            </p>
          )}
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                ref={(el) => {
                  itemRefs.current[href] = el;
                }}
                data-nav-item
                onClick={onCloseMobile}
                title={collapsed ? label : undefined}
                className={cn(
                  "group relative z-10 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                  active
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
                  collapsed && "lg:justify-center lg:px-0"
                )}
              >
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] flex-shrink-0 transition-transform duration-200",
                    active && "scale-110"
                  )}
                />
                {!collapsed && <span className="truncate">{label}</span>}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background shadow-lg lg:group-hover:block">
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-border/60 px-3 py-3">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground",
              collapsed && "lg:justify-center lg:px-0"
            )}
            title={collapsed ? "Student View" : undefined}
          >
            <GraduationCap className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Student View</span>}
          </Link>
          <button
            onClick={handleSignOut}
            className={cn(
              "mt-1 flex items-center gap-3 border w-full justify-center rounded-xl px-3 py-2.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive",
              collapsed && "lg:justify-center lg:px-0"
            )}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}

          </button>
        </div>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={handleToggleCollapse}
          className="hidden flex-shrink-0 items-center justify-center gap-2 border-t border-border/60 px-3 py-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:flex"
        >
          <ChevronLeft ref={chevronRef} className="h-4 w-4" />
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>
    </>
  );
}
