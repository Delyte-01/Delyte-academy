"use client";

import { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ToolbarButtonProps {
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ icon: Icon, label, shortcut, active, disabled, onClick }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="ghost"
            size="icon"
            aria-label={label}
            aria-pressed={active}
            disabled={disabled}
            onClick={onClick}
            className={cn(
              "h-8 w-8 rounded-lg text-muted-foreground transition-all duration-150",
              "hover:scale-105 hover:bg-accent hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
              "disabled:pointer-events-none disabled:opacity-40 disabled:hover:scale-100",
              active &&
                "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/25 hover:bg-primary/15 hover:text-primary hover:scale-100"
            )}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={6} className="text-xs">
          {label}
          {shortcut && <span className="opacity-70"> ({shortcut})</span>}
        </TooltipContent>
      </Tooltip>
    );
  }
);

ToolbarButton.displayName = "ToolbarButton";
