"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { LucideIcon } from "lucide-react";

export interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

interface StatsBarProps {
  stats: StatItem[];
}

export function StatsBar({ stats }: StatsBarProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tiles = gsap.utils.toArray<HTMLElement>(
      rowRef.current?.querySelectorAll("[data-stat-tile]") ?? []
    );

    gsap.fromTo(
      tiles,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" }
    );

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
        delay: 0.2,
        onUpdate: () => {
          valueEl.textContent = `${prefix}${Math.round(
            counter.val
          ).toLocaleString()}${suffix}`;
        },
      });
    });
  }, [stats]);

  return (
    <div
      ref={rowRef}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
    >
      {stats.map(({ label, value, icon: Icon, color, bgColor }) => (
        <div
          key={label}
          data-stat-tile
          className="group flex flex-col gap-2 rounded-2xl border border-border/60 bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${bgColor}`}
          >
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <div>
            <p
              data-stat-value
              data-raw-value={value}
              className="text-xl font-extrabold tracking-tight tabular-nums text-foreground"
            >
              {value}
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
