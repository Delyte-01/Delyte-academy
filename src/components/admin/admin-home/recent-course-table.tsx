"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, MoreHorizontal, Pencil, Inbox } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CourseTableRow } from "./dashboard-data";
import { useAdminCourses } from "@/hooks/useAdminCoures";


const statusConfig: Record<CourseTableRow["status"], { className: string }> = {
  Published: {
    className:
      "border-0 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  },
  Draft: { className: "border-0 bg-muted text-muted-foreground" },
  Archived: {
    className: "border-0 bg-muted text-muted-foreground",
  },
  
};

function CourseActionsMenu({ courseId }: { courseId: string }) {

   
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/courses/${courseId}/edit`}>
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Edit
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
        <Inbox className="h-7 w-7 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">No courses yet</p>
        <p className="text-xs text-muted-foreground">
          Create your first course to get started.
        </p>
      </div>
      <Button size="sm" asChild>
        <Link href="/admin/courses/create">Create Course</Link>
      </Button>
    </div>
  );
}

export function RecentCoursesTable() {

  const { courses } = useAdminCourses();
  
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-4">
        <CardTitle className="text-base font-bold">Recent Courses</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="flex-shrink-0 text-xs"
          asChild
        >
          <Link href="/admin/courses">View all</Link>
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {courses.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Mobile: stacked cards (below md) */}
            <div className="divide-y divide-border md:hidden">
              {courses.map((course) => (
                <div key={course.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {course.title}
                        </p>
                        {/* <p className="truncate text-xs text-muted-foreground">
                          {course.category}
                        </p> */}
                      </div>
                    </div>
                    <CourseActionsMenu courseId={course.id} />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <Badge
                      className={
                        statusConfig[course.status as keyof typeof statusConfig]
                          ?.className ??
                        "border-0 bg-muted text-muted-foreground"
                      }
                    >
                      {course.status}
                    </Badge>
                    <span>
                      <span className="font-medium text-foreground">
                        {course.students.toLocaleString()}
                      </span>{" "}
                      students
                    </span>
                    <span>
                      <span className="font-medium text-foreground">
                        {course.topics}
                      </span>{" "}
                      topics
                    </span>
                    <span>
                      <span className="font-medium text-foreground">
                        {course.quizzes}
                      </span>{" "}
                      quizzes
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Updated {course.updated}
                  </p>
                </div>
              ))}
            </div>

            {/* Desktop: full table (md and up) */}
            <div className="hidden overflow-x-auto md:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-b bg-muted/40 hover:bg-muted/40">
                    <TableHead className="pl-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Course
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Students
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Topics
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Quizzes
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Last Updated
                    </TableHead>
                    <TableHead className="pr-5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow
                      key={course.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <TableCell className="max-w-[240px] pl-5 py-3.5">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {course.title}
                            </p>
                            {/* <p className="truncate text-xs text-muted-foreground">
                              {course.category}
                            </p> */}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={statusConfig[course.status].className}
                        >
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {course.students.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {course.topics}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {course.quizzes}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {course.updated}
                      </TableCell>
                      <TableCell className="pr-5 text-right">
                        <CourseActionsMenu courseId={course.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
