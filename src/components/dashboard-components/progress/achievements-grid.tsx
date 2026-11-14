"use client";

import { Lock } from "lucide-react";

import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";
import { Achievement } from "@/types/progress";
import { Panel } from "./panel";

export function AchievementsGrid({ achievements }: { achievements: Achievement[] }) {
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <Panel
      title="Achievements"
      description={`${unlocked} of ${achievements.length} unlocked`}
      className="h-full"
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {achievements.map((a) => {
          const Icon = a.icon;
          const pct = a.target > 0 ? Math.min(100, Math.round((a.progress / a.target) * 100)) : 0;
          return (
            <li
              key={a.id}
              className={cn(
                "flex flex-col gap-3 rounded-xl border p-4",
                a.unlocked ? "bg-primary-soft/50" : "bg-card",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-xl",
                    a.unlocked ? "bg-brand-gradient shadow-brand" : "bg-muted text-muted-foreground",
                  )}
                >
                  {a.unlocked ? <Icon className="size-5" aria-hidden /> : <Lock className="size-4" aria-hidden />}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold">{a.title}</p>
                  <p className="text-[13px] leading-snug text-muted-foreground">{a.description}</p>
                </div>
              </div>
              {a.unlocked ? (
                <p className="text-xs font-bold uppercase tracking-wider text-success">Unlocked</p>
              ) : (
                <div className="space-y-1.5">
                  <ProgressBar value={pct} size="sm" label={`${a.title} progress`} />
                  <p className="text-xs tabular-nums text-muted-foreground">
                    {a.progress} / {a.target}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
