"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type StatusFilter = "all" | "Active" | "Inactive" | "Suspended";
export type EnrollmentFilter = "all" | "enrolled" | "not-enrolled";
export type SortOption =
  | "newest"
  | "oldest"
  | "most-active"
  | "highest-progress";

interface StudentsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  enrollment: EnrollmentFilter;
  onEnrollmentChange: (value: EnrollmentFilter) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
}

export function StudentsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  enrollment,
  onEnrollmentChange,
  sort,
  onSortChange,
}: StudentsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-sm lg:flex-1">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          aria-label="Search students"
          placeholder="Search name, email or username"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {search && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onSearchChange("")}
            className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center">
        <Select value={status} onValueChange={(v) => onStatusChange(v as StatusFilter)}>
          <SelectTrigger aria-label="Filter by status" className="w-full lg:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>

        <Select value={enrollment} onValueChange={(v) => onEnrollmentChange(v as EnrollmentFilter)}>
          <SelectTrigger aria-label="Filter by enrollment" className="w-full lg:w-[160px]">
            <SelectValue placeholder="Enrollment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All enrollments</SelectItem>
            <SelectItem value="enrolled">Enrolled</SelectItem>
            <SelectItem value="not-enrolled">Not enrolled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger aria-label="Sort students" className="w-full lg:w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="most-active">Most active</SelectItem>
            <SelectItem value="highest-progress">Highest progress</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
