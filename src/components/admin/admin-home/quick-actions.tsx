"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, Plus, ShieldCheck, Users, type LucideIcon } from "lucide-react";

interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  superOnly?: boolean;
}

// Only routes that exist. (Topics and quizzes are created inside a course workspace.)
const ACTIONS: QuickAction[] = [
  { label: "Create a course", description: "Start a new course, then add topics and quizzes", href: "/admin/courses/create", icon: Plus },
  { label: "Manage courses", description: "Edit, publish or archive existing courses", href: "/admin/courses", icon: BookOpen },
  { label: "Students", description: "See learners and their enrollments", href: "/admin/students", icon: Users, superOnly: true },
  { label: "Admins", description: "Manage who can administer the academy", href: "/admin/admins", icon: ShieldCheck, superOnly: true },
];

export function QuickActions({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const actions = ACTIONS.filter((a) => !a.superOnly || isSuperAdmin);
  return (
    <section className="rounded-xl border bg-card p-5 shadow-card" aria-labelledby="quick-title">
      <h2 id="quick-title" className="mb-3 font-heading text-lg font-bold tracking-tight">
        Quick actions
      </h2>
      <ul className="-mx-2 space-y-0.5">
        {actions.map(({ label, description, href, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex min-h-14 items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                <Icon className="size-[18px]" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-foreground">{label}</span>
                <span className="block truncate text-[13px] text-muted-foreground">{description}</span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
