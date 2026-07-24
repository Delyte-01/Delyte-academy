"use client";

import { useState, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, ChevronDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentSectionProps {
  id: string;
  icon: ReactNode;
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
  accent?: string;
}

export function ContentSection({
  id,
  icon,
  label,
  children,
  defaultOpen = true,
  accent = "bg-blue-500/10 text-blue-600",
}: ContentSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card
      id={id}
      className="group scroll-mt-24 overflow-hidden transition-all duration-300 hover:shadow-md"
    >
      {/* Section header */}
      <div className="flex items-center gap-3 border-b bg-muted/20 px-4 py-3">
        <GripVertical className="h-4 w-4 flex-shrink-0 cursor-grab text-muted-foreground/30 transition-colors group-hover:text-muted-foreground/60" />
        <div
          className={cn(
            "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg",
            accent
          )}
        >
          {icon}
        </div>
        <h3 className="flex-1 text-sm font-bold text-foreground">{label}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              !open && "-rotate-90"
            )}
          />
        </button>
      </div>

      {/* Section body */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <CardContent className="p-5">{children}</CardContent>
        </div>
      </div>
    </Card>
  );
}
