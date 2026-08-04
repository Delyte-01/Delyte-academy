"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityItem } from "@/types/progress";


interface ActivityTimelineProps {
  activities: ActivityItem[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute bottom-2 left-5 top-2 w-px bg-border" />

          <div className="space-y-5">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="relative flex items-start gap-4"
                >
                  {/* Icon */}
                  <div
                    className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-4 border-background ${activity.bgColor}`}
                  >
                    <Icon className={`h-4.5 w-4.5 ${activity.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {activity.title}
                      </p>
                      <span className="flex-shrink-0 text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
