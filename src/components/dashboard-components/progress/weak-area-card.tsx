'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { WeakArea } from '@/types/progress';


interface WeakAreasCardProps {
  areas: WeakArea[];
}

export function WeakAreasCard({ areas }: WeakAreasCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          Weak Areas & Improvement
        </CardTitle>
        <CardDescription>Topics where your quiz scores need attention. Practice to improve.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {areas.map((area) => {
          const Icon = area.icon;
          return (
            <div
              key={area.id}
              className="flex flex-col gap-3 rounded-2xl border p-4 transition-all hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                  <Icon className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{area.topic}</p>
                  <p className="text-xs text-muted-foreground">{area.course}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Score */}
                <div className="text-right">
                  <p className="text-sm font-extrabold text-amber-600">{area.score}%</p>
                  <p className="text-[10px] text-muted-foreground">Last quiz</p>
                </div>
                {/* Score bar */}
                <div className="hidden h-2 w-20 overflow-hidden rounded-full bg-muted sm:block">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: `${area.score}%` }}
                  />
                </div>
                <Button variant="outline" size="sm" className="flex-shrink-0">
                  Practice Now
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
