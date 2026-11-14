"use client";

import Link from "next/link";
import { ArrowRight, PartyPopper } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { WeakArea } from "@/types/progress";
import { Panel } from "./panel";

export function WeakAreasCard({ areas }: { areas: WeakArea[] }) {
  return (
    <Panel
      title="Needs practice"
      description="Topics where your average quiz score is under 70%"
      className="h-full"
    >
      {areas.length === 0 ? (
        <p className="flex items-start gap-3 rounded-xl bg-success-soft p-4 text-[15px] text-success">
          <PartyPopper className="mt-0.5 size-5 shrink-0" aria-hidden />
          Nothing here. Topics you score under 70% on will show up so you can retry them.
        </p>
      ) : (
        <ul className="space-y-3">
          {areas.map((area) => {
            const Icon = area.icon;
            return (
              <li key={area.id} className="space-y-3 rounded-xl border p-4">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-warning-soft text-warning">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-bold capitalize">{area.topic}</p>
                    <p className="truncate text-[13px] text-muted-foreground">{area.course}</p>
                  </div>
                  <span className="text-lg font-extrabold tabular-nums text-warning">{area.score}%</span>
                </div>
                <ProgressBar value={area.score} tone="warning" size="sm" label={`${area.topic} average score`} />
                <Button variant="soft" size="sm" className="w-full" asChild>
                  <Link href={`/dashboard/topics/${area.topicId}/quiz`}>
                    Practice again <ArrowRight />
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
