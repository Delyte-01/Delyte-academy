"use client";

import { useState } from "react";
import { Plus, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface EditableListProps {
  items: string[];

  onAdd: () => void;

  onRemove: (index: number) => void;

  onUpdate: (index: number, value: string) => void;

  placeholder: string;

  addLabel: string;

  accentColor?: string;
}

export function EditableList({
  items,
  placeholder,
  addLabel,
  accentColor = "bg-primary/10 text-primary",
  onAdd,
  onRemove,
  onUpdate,
}: EditableListProps) {
  

  return (
    <div className="space-y-2.5">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="group flex items-center gap-2.5 animate-slide-in-right"
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          <GripVertical className="h-4 w-4 flex-shrink-0 cursor-grab text-muted-foreground/30 transition-colors group-hover:text-muted-foreground/60" />
          <span
            className={cn(
              "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold",
              accentColor
            )}
          >
            {idx + 1}
          </span>
          <Input
            value={item}
            onChange={(e) => onUpdate(idx, e.target.value)}
            placeholder={placeholder}
            className="h-9 flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
            onClick={() => onRemove(idx)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={onAdd} className="mt-1">
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        {addLabel}
      </Button>
    </div>
  );
}
