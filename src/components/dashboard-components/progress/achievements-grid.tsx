"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Achievement } from "@/types/progress";

interface AchievementWithDate extends Achievement {
  date?: string;
}

interface AchievementsGridProps {
  achievements: AchievementWithDate[];
}

export function AchievementsGrid({ achievements }: AchievementsGridProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold">Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all",
                  achievement.unlocked
                    ? "border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 hover:shadow-md"
                    : "border-border bg-muted/30 opacity-60",
                )}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl",
                    achievement.unlocked
                      ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {achievement.unlocked ? (
                    <Icon className="h-6 w-6" />
                  ) : (
                    <Lock className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p
                    className={cn(
                      "text-xs font-bold",
                      achievement.unlocked
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {achievement.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
                {(() => {
                  const date = (achievement ).date as string | undefined;
                  return (
                    achievement.unlocked && date && (
                      <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                        <Check className="h-3 w-3" />
                        {date}
                      </div>
                    )
                  );
                })()}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
