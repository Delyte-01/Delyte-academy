"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { ChevronRight, Home } from "lucide-react";
import { navItems } from "@/components/admin/admin-sidebar";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FRIENDLY: Record<string, string> = {
  create: "New",
  edit: "Edit",
  topics: "Topics",
  courses: "Courses",
};

function labelFor(seg: string, href: string) {
  const nav = navItems.find((n) => n.href === href);
  if (nav) return nav.label;
  if (FRIENDLY[seg]) return FRIENDLY[seg];
  if (UUID.test(seg)) return "Details";
  return seg.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
}

/** Path-derived breadcrumb. Raw ids are shown as "Details" rather than a UUID. */
export default function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1) return null;

  const crumbs = segments.slice(1).map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 2).join("/");
    return { href, label: labelFor(seg, href), isLast: idx === segments.length - 2 };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-[13px]">
      <Link
        href="/admin"
        aria-label="Admin home"
        className="-m-1 flex items-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Home className="size-3.5" aria-hidden />
      </Link>
      {crumbs.map((crumb) => (
        <Fragment key={crumb.href}>
          <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50" aria-hidden />
          {crumb.isLast ? (
            <span aria-current="page" className="font-semibold text-foreground">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="rounded-md px-1 py-0.5 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {crumb.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
