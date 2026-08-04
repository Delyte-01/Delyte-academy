"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ActivityItem } from "@/types/progress";

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

const COLLAPSED_COUNT = 5;

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const [expanded, setExpanded] = useState(false);

  const hasOverflow = activities.length > COLLAPSED_COUNT;
  const visibleActivities = expanded
    ? activities
    : activities.slice(0, COLLAPSED_COUNT);

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No recent activity yet.
          </p>
        ) : (
          <>
            <div
              className={`relative ${
                expanded ? "max-h-[420px] overflow-y-auto pr-1" : ""
              }`}
            >
              {/* Vertical line */}
              <div className="absolute bottom-2 left-4 top-2 w-px bg-border sm:left-5" />

              <div className="space-y-4 sm:space-y-5">
                {visibleActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="relative flex items-start gap-3 sm:gap-4 min-w-0"
                    >
                      {/* Icon */}
                      <div
                        className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-4 border-background sm:h-10 sm:w-10 ${activity.bgColor}`}
                      >
                        <Icon
                          className={`h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 ${activity.color}`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
                          <p className="text-sm font-semibold text-foreground break-words">
                            {activity.title}
                          </p>
                          <span className="flex-shrink-0 text-xs text-muted-foreground">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground break-words">
                          {activity.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fade hint when scrollable */}
              {expanded && (
                <div className="pointer-events-none sticky bottom-0 left-0 h-6 w-full bg-gradient-to-t from-background to-transparent" />
              )}
            </div>

            {hasOverflow && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 w-full text-xs text-muted-foreground"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? (
                  <>
                    Show less
                    <ChevronUp className="ml-1 h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    View all {activities.length} activities
                    <ChevronDown className="ml-1 h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
