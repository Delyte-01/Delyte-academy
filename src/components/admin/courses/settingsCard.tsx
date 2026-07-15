"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { LucideIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SettingToggle {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface SettingsCardProps {
  settings: SettingToggle[];
}

export function SettingsCard({ settings }: SettingsCardProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rows = gsap.utils.toArray<HTMLElement>(
      listRef.current?.querySelectorAll("[data-setting-row]") ?? []
    );
    gsap.fromTo(
      rows,
      { opacity: 0, x: -8 },
      { opacity: 1, x: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" }
    );
  }, []);

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold">Course Settings</CardTitle>
      </CardHeader>
      <CardContent ref={listRef} className="space-y-1">
        {settings.map(
          ({ key, label, description, icon: Icon, checked, onChange }, idx) => (
            <div
              key={key}
              data-setting-row
              className={cn(
                "flex items-center justify-between gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-muted/40",
                idx < settings.length - 1 && "border-b border-border/60"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors duration-200",
                    checked
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                  {label === "Enable Course Certificates" && (
                    <p className="mt-0.5 text-[10px] font-medium text-amber-600">
                      Coming soon
                    </p>
                  )}
                </div>
              </div>
              <Switch checked={checked} onCheckedChange={onChange} />
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
