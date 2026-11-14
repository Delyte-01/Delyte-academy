"use client";

import { Inbox, MoreVertical, Pencil, Rocket, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CourseCardMenuProps {
  status: "draft" | "published";
  title?: string;
  onEdit: () => void;
  /** Should open a confirmation — this menu never deletes by itself. */
  onDelete: () => void;
  onStatusChange: () => void;
}

export function CourseCardMenu({ status, title, onEdit, onDelete, onStatusChange }: CourseCardMenuProps) {
  const isDraft = status === "draft";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-muted-foreground"
          aria-label={title ? `Options for ${title}` : "Course options"}
        >
          <MoreVertical aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onSelect={onEdit}>
          <Pencil aria-hidden /> Edit course
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onStatusChange}>
          {isDraft ? <Rocket aria-hidden /> : <Inbox aria-hidden />}
          {isDraft ? "Publish" : "Move to draft"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={onDelete}>
          <Trash2 aria-hidden /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
