"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef } from "react";
import { ChevronRight, Home } from "lucide-react";
import gsap from "gsap";
import { navItems } from "@/components/admin/admin-sidebar";

export default function AdminBreadcrumb() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  const segments = pathname.split("/").filter(Boolean);

  useEffect(() => {
    if (!navRef.current) return;
    const crumbEls = navRef.current.querySelectorAll("[data-crumb]");
    gsap.fromTo(
      crumbEls,
      { opacity: 0, x: -6 },
      { opacity: 1, x: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (segments.length <= 1) return null;

  const crumbs = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const navMatch = navItems.find((n) => n.href === href);
    const label = navMatch?.label ?? seg.charAt(0).toUpperCase() + seg.slice(1);
    const isLast = idx === segments.length - 1;
    return { href, label: label.replace(/-/g, " "), isLast };
  });

  return (
    <nav
      ref={navRef}
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-sm"
    >
      <Link
        data-crumb
        href="/admin"
        className="flex items-center rounded-md p-1 -m-1 text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {crumbs.map((crumb) => (
        <Fragment key={crumb.href}>
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/40" />
          {crumb.isLast ? (
            <span
              data-crumb
              className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-primary"
            >
              {crumb.label}
            </span>
          ) : (
            <Link
              data-crumb
              href={crumb.href}
              className="relative capitalize text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-200 hover:after:w-full"
            >
              {crumb.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
