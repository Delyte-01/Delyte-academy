"use client";

import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  HelpCircle,
  MoreHorizontal,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableShell } from "@/components/ui/data-table-shell";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/empty-states";
import { deleteStudent } from "@/services/admin-students";
import type { AdminStudent, StudentStatus } from "@/hooks/useAdminStudents";

const STATUS_VARIANT: Record<StudentStatus, "brand" | "muted" | "danger"> = {
  active: "brand",
  inactive: "muted",
  suspended: "danger",
};

interface StudentsTableProps {
  students: AdminStudent[];
  /** Total before filters, for the "Showing x of y" footer. */
  total?: number;
  onSelectStudent: (student: AdminStudent) => void;
  /** Called after a successful delete so the page can drop the row. */
  onStudentDeleted?: (id: string) => void;
}

function StudentIdentity({ student }: { student: AdminStudent }) {
  return (
    <>
      <Avatar className="size-11 shrink-0">
        <AvatarImage src={student.avatar_url ?? undefined} alt="" />
        <AvatarFallback className="bg-primary-soft text-sm font-bold text-primary-soft-foreground">
          {student.initials}
        </AvatarFallback>
      </Avatar>
      <span className="min-w-0 text-left">
        <span className="block truncate text-[15px] font-bold text-foreground">{student.full_name}</span>
        <span className="block truncate text-[13px] text-muted-foreground">{student.email}</span>
      </span>
    </>
  );
}

export function AdminStudentsTable({
  students,
  total,
  onSelectStudent,
  onStudentDeleted,
}: StudentsTableProps) {
  const [toDelete, setToDelete] = useState<AdminStudent | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (student: AdminStudent) => {
    setDeleting(true);
    try {
      await deleteStudent(student.id);
      onStudentDeleted?.(student.id);
      toast.success("Student deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete student");
    } finally {
      setDeleting(false);
    }
  };

  const rowMenu = (student: AdminStudent) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Actions for ${student.full_name}`}
          className="size-10 text-muted-foreground"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onSelect={() => onSelectStudent(student)}>
          <User className="size-4" />
          View profile
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSelectStudent(student)}>
          <BookOpen className="size-4" />
          Enrollments
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSelectStudent(student)}>
          <HelpCircle className="size-4" />
          Quiz history
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSelectStudent(student)}>
          <BarChart3 className="size-4" />
          Learning progress
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={() => setToDelete(student)}
        >
          <Trash2 className="size-4" />
          Delete student
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (students.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No students found"
        description="No student matches the current search and filters. Try widening them."
      />
    );
  }

  return (
    <>
      <DataTableShell
        footer={
          <p aria-live="polite">
            Showing <span className="font-semibold tabular-nums text-foreground">{students.length}</span>
            {total !== undefined && (
              <>
                {" "}
                of <span className="tabular-nums">{total}</span>
              </>
            )}{" "}
            students
          </p>
        }
      >
        {/* Desktop table */}
        <Table className="hidden md:table">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Student</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Courses</TableHead>
              <TableHead className="w-44">Progress</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="pr-3 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id} className="group">
                <TableCell className="py-3 pl-5">
                  <button
                    type="button"
                    onClick={() => onSelectStudent(student)}
                    className="flex max-w-[280px] items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <StudentIdentity student={student} />
                  </button>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[student.status] ?? "muted"} className="capitalize">
                    {student.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums text-foreground">
                  {student.enrolledCourses}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <ProgressBar
                      value={student.progress}
                      size="sm"
                      label={`${student.full_name} average progress`}
                    />
                    <span className="w-10 text-right text-sm font-bold tabular-nums text-foreground">
                      {student.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {student.lastActive}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm tabular-nums text-muted-foreground">
                  {student.created_at}
                </TableCell>
                <TableCell className="pr-3 text-right">{rowMenu(student)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Mobile: stacked rows */}
        <ul className="divide-y md:hidden">
          {students.map((student) => (
            <li key={student.id} className="flex items-start gap-1 p-4">
              <button
                type="button"
                onClick={() => onSelectStudent(student)}
                className="min-w-0 flex-1 space-y-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <span className="flex items-center gap-3">
                  <StudentIdentity student={student} />
                </span>
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-muted-foreground">
                  <Badge variant={STATUS_VARIANT[student.status] ?? "muted"} size="sm" className="capitalize">
                    {student.status}
                  </Badge>
                  <span className="tabular-nums">{student.enrolledCourses} courses</span>
                  <span>Active {student.lastActive}</span>
                </span>
                <span className="flex items-center gap-3">
                  <ProgressBar value={student.progress} size="sm" label="Average progress" />
                  <span className="text-sm font-bold tabular-nums text-foreground">{student.progress}%</span>
                </span>
              </button>
              {rowMenu(student)}
            </li>
          ))}
        </ul>
      </DataTableShell>

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && !deleting && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this student?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete?.full_name} will be permanently removed. This can’t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                if (toDelete) void handleDelete(toDelete);
              }}
            >
              {deleting ? "Deleting…" : "Delete student"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
