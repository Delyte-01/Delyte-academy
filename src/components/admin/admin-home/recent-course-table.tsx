"use client";

import Link from "next/link";
import { BookOpen, MoreHorizontal, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableShell } from "@/components/ui/data-table-shell";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/empty-states";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAdminCourses, type CourseTableRow } from "@/hooks/useAdminCoures";

const STATUS: Record<CourseTableRow["status"], "published" | "draft" | "archived"> = {
  Published: "published",
  Draft: "draft",
  Archived: "archived",
};

function RowMenu({ courseId, title }: { courseId: string; title: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Actions for ${title}`}>
          <MoreHorizontal aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/courses/${courseId}`}>
            <BookOpen aria-hidden /> Open
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/admin/courses/${courseId}/edit`}>
            <Pencil aria-hidden /> Edit
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function RecentCoursesTable() {
  const { courses, loading } = useAdminCourses();

  return (
    <section aria-labelledby="recent-courses">
      <SectionHeader title="Recent courses" description="Most recently updated" href="/admin/courses" actionLabel="All courses" />

      {loading ? (
        <div className="space-y-2" role="status" aria-label="Loading courses">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="Create your first course, then add topics and quizzes to it."
          action={
            <Button variant="brand" asChild>
              <Link href="/admin/courses/create">
                <Plus aria-hidden /> Create course
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          {/* Mobile: stacked rows */}
          <ul className="divide-y overflow-hidden rounded-xl border bg-card shadow-card md:hidden">
            {courses.map((c) => (
              <li key={c.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/admin/courses/${c.id}`} className="min-w-0 text-[15px] font-bold text-foreground hover:text-primary">
                    <span className="block truncate">{c.title}</span>
                  </Link>
                  <RowMenu courseId={c.id} title={c.title} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-muted-foreground">
                  <StatusBadge status={STATUS[c.status]} />
                  <span><b className="tabular-nums text-foreground">{c.students.toLocaleString()}</b> students</span>
                  <span><b className="tabular-nums text-foreground">{c.topics}</b> topics</span>
                  <span><b className="tabular-nums text-foreground">{c.quizzes}</b> quizzes</span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">Updated {c.updated}</p>
              </li>
            ))}
          </ul>

          {/* Desktop: table */}
          <DataTableShell className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Students</TableHead>
                  <TableHead className="text-right">Topics</TableHead>
                  <TableHead className="text-right">Quizzes</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="max-w-[280px]">
                      <Link href={`/admin/courses/${c.id}`} className="flex min-w-0 items-center gap-3 font-semibold text-foreground hover:text-primary">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground">
                          <BookOpen className="size-4" aria-hidden />
                        </span>
                        <span className="truncate">{c.title}</span>
                      </Link>
                    </TableCell>
                    <TableCell><StatusBadge status={STATUS[c.status]} /></TableCell>
                    <TableCell className="text-right tabular-nums">{c.students.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.topics}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.quizzes}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{c.updated}</TableCell>
                    <TableCell className="text-right"><RowMenu courseId={c.id} title={c.title} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DataTableShell>
        </>
      )}
    </section>
  );
}
