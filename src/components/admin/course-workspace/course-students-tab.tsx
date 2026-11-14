"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Eye, Search, TrendingUp, Users, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DataTableShell } from "@/components/ui/data-table-shell";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/empty-states";
import { StatStrip } from "@/components/admin/workspace/stat-strip";
import { Enrollment } from "@/types/enrollment";

interface CourseStudentsTabProps {
  students: Enrollment[];
  onViewStudent?: (studentId: string) => void;
}

function formatEnrolledDate(dateString?: string) {
  if (!dateString) return "Recently";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function CourseStudentsTab({ students, onViewStudent }: CourseStudentsTabProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((item) => {
      const p = item.profiles;
      return (
        (p?.full_name?.toLowerCase() ?? "").includes(q) ||
        (p?.email?.toLowerCase() ?? "").includes(q) ||
        (p?.username?.toLowerCase() ?? "").includes(q)
      );
    });
  }, [students, query]);

  const completedCount = students.filter((s) => s.completed).length;
  const averageProgress =
    students.length > 0
      ? Math.round(students.reduce((sum, s) => sum + (s.progress ?? 0), 0) / students.length)
      : 0;

  if (students.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No students enrolled yet"
        description="Once students enroll in this course, their progress shows up here."
      />
    );
  }

  const identity = (enrollment: Enrollment) => {
    const profile = enrollment.profiles;
    const name = profile?.full_name || "Student";
    return (
      <span className="flex min-w-0 items-center gap-3">
        <Avatar className="size-11 shrink-0">
          <AvatarImage src={profile?.avatar_url ?? undefined} alt="" />
          <AvatarFallback className="bg-primary-soft text-sm font-bold text-primary-soft-foreground">
            {initialsOf(name)}
          </AvatarFallback>
        </Avatar>
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-bold text-foreground">{name}</span>
          <span className="block truncate text-[13px] text-muted-foreground">
            {profile?.email || "No email"}
          </span>
        </span>
      </span>
    );
  };

  const viewButton = (enrollment: Enrollment) =>
    onViewStudent && (
      <Button
        variant="ghost"
        size="icon"
        aria-label={`View ${enrollment.profiles?.full_name || "student"}`}
        className="size-10"
        onClick={() => onViewStudent(enrollment.student_id)}
      >
        <Eye className="size-4" />
      </Button>
    );

  return (
    <div className="space-y-5">
      <StatStrip
        items={[
          { label: "Enrolled", value: students.length, icon: Users, tone: "info" },
          { label: "Completed", value: completedCount, icon: CheckCircle2, tone: "success" },
          { label: "Average progress (%)", value: averageProgress, icon: TrendingUp, tone: "brand" },
        ]}
      />

      <DataTableShell
        toolbar={
          <div className="relative w-full sm:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              aria-label="Search enrolled students"
              placeholder="Search name, email or username"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        }
        footer={
          <p aria-live="polite">
            Showing <span className="font-semibold tabular-nums text-foreground">{filtered.length}</span> of{" "}
            <span className="tabular-nums">{students.length}</span> students
          </p>
        }
      >
        {filtered.length === 0 ? (
          <p className="px-6 py-14 text-center text-[15px] text-muted-foreground">
            No student matches “{query}”.
          </p>
        ) : (
          <>
            <Table className="hidden md:table">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-52">Progress</TableHead>
                  <TableHead>Enrolled</TableHead>
                  {onViewStudent && (
                    <TableHead className="pr-3 text-right">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="py-3 pl-5">{identity(e)}</TableCell>
                    <TableCell>
                      <StatusBadge status={e.completed ? "completed" : "in_progress"} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <ProgressBar value={e.progress ?? 0} size="sm" label="Course progress" />
                        <span className="w-10 text-right text-sm font-bold tabular-nums text-foreground">
                          {Math.round(e.progress ?? 0)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatEnrolledDate(e.enrolled_at)}
                    </TableCell>
                    {onViewStudent && <TableCell className="pr-3 text-right">{viewButton(e)}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <ul className="divide-y md:hidden">
              {filtered.map((e) => (
                <li key={e.id} className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-2">
                    {identity(e)}
                    {viewButton(e)}
                  </div>
                  <div className="flex items-center gap-3">
                    <ProgressBar value={e.progress ?? 0} size="sm" label="Course progress" />
                    <span className="text-sm font-bold tabular-nums text-foreground">
                      {Math.round(e.progress ?? 0)}%
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground">
                    <StatusBadge status={e.completed ? "completed" : "in_progress"} />
                    <span>Enrolled {formatEnrolledDate(e.enrolled_at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </DataTableShell>
    </div>
  );
}
