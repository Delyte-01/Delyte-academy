"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FolderPlus, HelpCircle, Users, Award } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface QuickAction {
  label: string;
  href: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const actions: QuickAction[] = [
  {
    label: "Create Course",
    href: "/admin/courses/create",
    icon: BookOpen,
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Add Topic",
    href: "/admin/topics",
    icon: FolderPlus,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Create Quiz",
    href: "/admin/questions",
    icon: HelpCircle,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
  {
    label: "View Students",
    href: "/admin/students",
    icon: Users,
    color: "text-violet-600",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Manage Certificates",
    href: "/admin/analytics",
    icon: Award,
    color: "text-rose-600",
    bgColor: "bg-rose-500/10",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2.5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 rounded-2xl border p-3 transition-all hover:border-primary/40 hover:bg-muted/30 hover:shadow-sm"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${action.bgColor}`}
              >
                <Icon className={`h-4.5 w-4.5 ${action.color}`} />
              </div>
              <span className="text-sm font-medium text-foreground">
                {action.label}
              </span>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
