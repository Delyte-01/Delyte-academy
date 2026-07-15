"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Inbox, MoreVertical, Pencil, Rocket, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

interface CourseCardMenuProps {
  status: "draft" | "published";
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: () => void;
}

export function CourseCardMenu({
  status,
  onEdit,
  onDelete,
  onStatusChange,
}: CourseCardMenuProps) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<SVGSVGElement>(null);
  const isDraft = status === "draft";

  // Content pops in from the trigger with a slight overshoot, items
  // stagger in right after, and the trigger icon gives a subtle spin
  // to acknowledge the click — all scoped to this menu's own open state.
  useGSAP(
    () => {
      if (open && contentRef.current) {
        const items = contentRef.current.querySelectorAll("[data-menu-item]");
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, scale: 0.9, y: -6 },
          { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: "back.out(1.7)" }
        );
        gsap.fromTo(
          items,
          { opacity: 0, x: 10 },
          {
            opacity: 1,
            x: 0,
            duration: 0.22,
            stagger: 0.045,
            delay: 0.06,
            ease: "power2.out",
          }
        );
      }

      gsap.to(triggerRef.current, {
        rotate: open ? 90 : 0,
        duration: 0.25,
        ease: "power2.out",
      });
    },
    { dependencies: [open] }
  );

  return (
    <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          aria-label="Course options"
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground  transition-all duration-150 hover:bg-muted hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none  data-[state=open]:bg-muted data-[state=open]:text-foreground data-[state=open]:opacity-100"
          )}
        >
          <MoreVertical ref={triggerRef} className="h-4 w-4" />
        </button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          ref={contentRef}
          align="end"
          sideOffset={8}
          onClick={(e) => e.stopPropagation()}
          className="z-50 w-44 origin-top-right overflow-hidden rounded-xl border border-border/60 bg-popover p-1.5 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.18)]"
        >
          <DropdownMenuPrimitive.Item
            data-menu-item
            onSelect={onEdit}
            className="flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-foreground/80 outline-none transition-colors data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit course
          </DropdownMenuPrimitive.Item>

          {isDraft ? (
            <DropdownMenuPrimitive.Item
              data-menu-item
              onSelect={onStatusChange}
              className="flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-foreground/80 outline-none transition-colors data-[highlighted]:bg-emerald-500/10 data-[highlighted]:text-emerald-600"
            >
              <Rocket className="h-3.5 w-3.5" />
              Publish
            </DropdownMenuPrimitive.Item>
          ) : (
            <DropdownMenuPrimitive.Item
              data-menu-item
              onSelect={onStatusChange}
              className="flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-foreground/80 outline-none transition-colors data-[highlighted]:bg-amber-500/15 data-[highlighted]:text-amber-600"
            >
              <Inbox className="h-3.5 w-3.5" />
              Move to Draft
            </DropdownMenuPrimitive.Item>
          )}

          <DropdownMenuPrimitive.Separator className="my-1 h-px bg-border/60" />

          <DropdownMenuPrimitive.Item
            data-menu-item
            onSelect={onDelete}
            className="flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-destructive outline-none transition-colors data-[highlighted]:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </DropdownMenuPrimitive.Item>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
