"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, Sparkles, Lock } from "lucide-react";

gsap.registerPlugin(useGSAP);

export interface ModulePlaceholder {
  icon: LucideIcon;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}

interface ModulePlaceholdersProps {
  modules: ModulePlaceholder[];
}

export function ModulePlaceholders({ modules }: ModulePlaceholdersProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".module-tile",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: "power2.out" }
      );
    },
    { scope: ref }
  );

  return (
    <Card ref={ref} className="overflow-hidden border-dashed">
      <CardContent className="p-0">
        <div className="flex items-center gap-2 border-b bg-muted/30 px-5 py-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-sm font-bold text-foreground">Coming next</p>
          <Badge
            variant="outline"
            className="ml-auto gap-1 text-[10px] text-muted-foreground"
          >
            <Lock className="h-2.5 w-2.5" />
            After you save
          </Badge>
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-2">
          {modules.map(({ icon: Icon, label, description, color, bgColor }) => (
            <div
              key={label}
              className="module-tile group relative flex cursor-not-allowed items-center gap-3 overflow-hidden bg-card p-4"
            >
              {/* Diagonal sheen sweep on hover */}
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/[0.03] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

              <div className="relative flex-shrink-0">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 ease-out group-hover:scale-105 group-hover:-rotate-3 ${bgColor}`}
                >
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-card bg-muted">
                  <Lock className="h-2 w-2 text-muted-foreground" />
                </div>
              </div>

              <div className="relative min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
