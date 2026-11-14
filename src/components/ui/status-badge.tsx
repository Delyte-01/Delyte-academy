import { Badge } from "@/components/ui/badge";

type Status =
  | "published"
  | "draft"
  | "archived"
  | "completed"
  | "in_progress"
  | "not_started"
  | "passed"
  | "failed"
  | "active"
  | "inactive";

const MAP: Record<
  Status,
  { label: string; variant: "success" | "warning" | "muted" | "info" | "danger" | "brand" }
> = {
  published: { label: "Published", variant: "success" },
  draft: { label: "Draft", variant: "warning" },
  archived: { label: "Archived", variant: "muted" },
  completed: { label: "Completed", variant: "success" },
  in_progress: { label: "In progress", variant: "info" },
  not_started: { label: "Not started", variant: "muted" },
  passed: { label: "Passed", variant: "success" },
  failed: { label: "Failed", variant: "danger" },
  active: { label: "Active", variant: "brand" },
  inactive: { label: "Inactive", variant: "muted" },
};

/** Consistent status pill. Pass `label` to override the default wording. */
export function StatusBadge({
  status,
  label,
  className,
}: {
  status: Status;
  label?: string;
  className?: string;
}) {
  const { label: defaultLabel, variant } = MAP[status];
  return (
    <Badge variant={variant} size="sm" className={className}>
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full bg-current opacity-70"
      />
      {label ?? defaultLabel}
    </Badge>
  );
}
