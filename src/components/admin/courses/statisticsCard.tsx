"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

interface StatisticsCardProps {
  stats: StatItem[];
  title?: string;
}

export function StatisticsCard({
  stats,
  title = "Course Statistics",
}: StatisticsCardProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tiles = gsap.utils.toArray<HTMLElement>(
      gridRef.current?.querySelectorAll("[data-stat-tile]") ?? []
    );

    gsap.fromTo(
      tiles,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" }
    );

    // Count up the numeric portion of each value (handles prefixes/suffixes
    // like "85%" or "1,240 students" — anything without digits is left alone)
    tiles.forEach((tile) => {
      const valueEl = tile.querySelector<HTMLElement>("[data-stat-value]");
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
        duration: 0.9,
        ease: "power2.out",
        delay: 0.15,
        onUpdate: () => {
          valueEl.textContent = `${prefix}${Math.round(
            counter.val
          ).toLocaleString()}${suffix}`;
        },
      });
    });
  }, [stats]);

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent ref={gridRef} className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, color, bgColor }) => (
          <div
            key={label}
            data-stat-tile
            className="group flex flex-col gap-2 rounded-xl border border-border/60 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105 ${bgColor}`}
            >
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div>
              <p
                data-stat-value
                data-raw-value={value}
                className="text-lg font-extrabold tracking-tight tabular-nums text-foreground"
              >
                {value}
              </p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
