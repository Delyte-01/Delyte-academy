"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Calendar, Clock, User } from "lucide-react";

interface OverviewTabProps {
  description: string;
  code: string;
  status: "draft" | "published";
  stats: { label: string; value: string }[];
  recentActivity: { action: string; user: string; time: string }[];
  createdAt: string;
  updatedAt: string;
}

const avatarPalette = [
  { bg: "bg-blue-500/10", text: "text-blue-600" },
  { bg: "bg-violet-500/10", text: "text-violet-600" },
  { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  { bg: "bg-amber-500/10", text: "text-amber-600" },
  { bg: "bg-rose-500/10", text: "text-rose-600" },
];

function avatarStyleFor(name: string) {
  const idx = name.charCodeAt(0) % avatarPalette.length;
  return avatarPalette[idx];
}

export function OverviewTab({
  description,
  code,
  status,
  stats,
  recentActivity,
  createdAt,
  updatedAt
}: OverviewTabProps) {
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const meta = [
    {
      icon: BookOpen,
      label: "Course Code",
      value: code,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      icon: FileText,
      label: "Status",
      value: status,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      icon: Calendar,
      label: "Created",
      value: createdAt,
      color: "text-violet-600",
      bg: "bg-violet-500/10",
    },
    {
      icon: Clock,
      label: "Last Updated",
      value: updatedAt,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
    },
    {
      icon: User,
      label: "Created By",
      value: "Super Admin",
      color: "text-rose-600",
      bg: "bg-rose-500/10",
    },
  ];

  useEffect(() => {
    const tl = gsap.timeline();

    const leftCards = gsap.utils.toArray<HTMLElement>(
      leftColRef.current?.querySelectorAll("[data-overview-card]") ?? []
    );
    tl.fromTo(
      leftCards,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" },
      0
    );

    const rightCards = gsap.utils.toArray<HTMLElement>(
      rightColRef.current?.querySelectorAll("[data-overview-card]") ?? []
    );
    tl.fromTo(
      rightCards,
      { opacity: 0, x: 12 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" },
      0.05
    );

    const glanceTiles = gsap.utils.toArray<HTMLElement>(
      leftColRef.current?.querySelectorAll("[data-glance-tile]") ?? []
    );
    glanceTiles.forEach((tile) => {
      const valueEl = tile.querySelector<HTMLElement>("[data-glance-value]");
      if (!valueEl) return;
      const raw = valueEl.dataset.rawValue ?? "";
      const match = raw.match(/^(\D*)([\d,]+)(.*)$/);
      if (!match) return;
      const [, prefix, numStr, suffix] = match;
      const target = parseInt(numStr.replace(/,/g, ""), 10);
      valueEl.textContent = `${prefix}0${suffix}`;
      const counter = { val: 0 };
      gsap.to(counter, {
        val: target,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.out",
        onUpdate: () => {
          valueEl.textContent = `${prefix}${Math.round(
            counter.val
          ).toLocaleString()}${suffix}`;
        },
      });
    });

    const timelineDots = gsap.utils.toArray<HTMLElement>(
      rightColRef.current?.querySelectorAll("[data-timeline-dot]") ?? []
    );
    tl.fromTo(
      timelineDots,
      { scale: 0 },
      { scale: 1, duration: 0.3, stagger: 0.08, ease: "back.out(2.5)" },
      0.3
    );
    
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div ref={leftColRef} className="space-y-6 lg:col-span-2">
        {/* About */}
        <Card data-overview-card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">
              About this course
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </CardContent>
        </Card>

        {/* Quick stats */}
        <Card data-overview-card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">At a glance</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {stats.map(({ label, value }) => (
              <div
                key={label}
                data-glance-tile
                className="group rounded-xl border border-border/60 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
              >
                <p
                  data-glance-value
                  data-raw-value={value}
                  className="text-2xl font-extrabold tracking-tight tabular-nums text-foreground"
                >
                  {value}
                </p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right column */}
      <div ref={rightColRef} className="space-y-6">
        {/* Metadata */}
        <Card data-overview-card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">
              Course details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {meta.map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${bg}`}
                >
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card data-overview-card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">
              Recent activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, idx) => {
              const style = avatarStyleFor(activity.user);
              return (
                <div key={idx} className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <div
                      data-timeline-dot
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${style.bg} ${style.text}`}
                    >
                      {activity.user.charAt(0)}
                    </div>
                    {idx < recentActivity.length - 1 && (
                      <div className="mt-1 w-px flex-1 bg-gradient-to-b from-border to-transparent" />
                    )}
                  </div>
                  <div className="pb-1">
                    <p className="text-sm text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} · {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
