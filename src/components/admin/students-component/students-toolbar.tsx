"use client";

import { Search } from "lucide-react";
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
      {/* Search */}
      <div className="relative max-w-sm flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or username..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 pl-9"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Select
          value={status}
          onValueChange={(v) => onStatusChange(v as StatusFilter)}
        >
          <SelectTrigger className="h-10 w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={enrollment}
          onValueChange={(v) => onEnrollmentChange(v as EnrollmentFilter)}
        >
          <SelectTrigger className="h-10 w-[150px]">
            <SelectValue placeholder="Enrollment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Enrollments</SelectItem>
            <SelectItem value="enrolled">Enrolled</SelectItem>
            <SelectItem value="not-enrolled">Not Enrolled</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(v) => onSortChange(v as SortOption)}
        >
          <SelectTrigger className="h-10 w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="most-active">Most Active</SelectItem>
            <SelectItem value="highest-progress">Highest Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
