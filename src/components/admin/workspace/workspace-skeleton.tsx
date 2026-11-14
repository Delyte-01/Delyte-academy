import { Skeleton } from "@/components/ui/skeleton";

/** Matches the final workspace layout: hero, stat strip, tab bar, content. */
export function WorkspaceSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-live="polite" aria-label="Loading workspace">
      <div className="overflow-hidden rounded-xl border bg-card shadow-card">
        <Skeleton className="h-24 w-full rounded-none sm:h-32" />
        <div className="flex items-end gap-4 px-4 pb-5 sm:px-6">
          <Skeleton className="-mt-9 size-[72px] rounded-xl border-4 border-card sm:-mt-11 sm:size-24" />
          <div className="flex-1 space-y-2.5 pb-1">
            <Skeleton className="h-7 w-2/3 max-w-sm" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
      <Skeleton className="h-[88px] w-full rounded-xl" />
      <div className="flex gap-2 border-b pb-3">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-8 w-24" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-64 rounded-xl lg:col-span-2" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
