"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  User,
  BookOpen,
  HelpCircle,
  BarChart3,
 
  Trash2,
  Inbox,
} from "lucide-react";

import { deleteStudent} from "@/services/admin-students";
import { toast } from "sonner";
import {
  AdminStudent,
  StudentStatus,
  useAdminStudents,
} from "@/hooks/useAdminStudents";

const statusConfig: Record<StudentStatus, { className: string }> = {
  active: {
    className:
      "border-0 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  },
  inactive: { className: "border-0 bg-muted text-muted-foreground" },
  suspended: {
    className: "border-0 bg-rose-500/15 text-rose-700 dark:text-rose-400",
  },
};

interface StudentsTableProps {
  students: AdminStudent[];
  onSelectStudent: (student: AdminStudent) => void;
}

export function AdminStudentsTable({
  students,
  onSelectStudent,
}: StudentsTableProps) {
  const { removeStudentLocal } = useAdminStudents();

  const handleDelete = async (student: AdminStudent) => {
    const confirmed = window.confirm(
      `Delete ${student.full_name}? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await deleteStudent(student.id);

      // Remove immediately from the table
      removeStudentLocal(student.id);

      toast.success("Student deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  // const handleSuspend = async (student: AdminStudent) => {
  //   try {
  //     await updateStudent(student.id, { status: "suspended" });

  //     // Update immediately in the table
  //     updateStudentLocal(student.id, { status: "suspended" });

  //     toast.success("Account suspended");
  //   } catch (err) {
  //     toast.error(err instanceof Error ? err.message : "Failed");
  //   }
  // };

  // const handleReactivate = async (student: AdminStudent) => {
  //   try {
  //     await updateStudent(student.id, { status: "active" });

  //     // Update immediately in the table
  //     updateStudentLocal(student.id, { status: "active" });

  //     toast.success("Account reactivated");
  //   } catch (err) {
  //     toast.error(err instanceof Error ? err.message : "Failed");
  //   }
  // };
  return (
    <Card>
      <CardContent className="p-0">
        {students.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted">
              <Inbox className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                No students found
              </p>
              <p className="text-xs text-muted-foreground">
                Try adjusting your filters or add a new student.
              </p>
            </div>
            <Button size="sm">Add Student</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Student
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Courses
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Progress
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Last Active
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Joined
                  </TableHead>
                  <TableHead className="pr-5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow
                    key={student.id}
                    className="cursor-pointer transition-colors hover:bg-muted/30"
                    onClick={() => onSelectStudent(student)}
                  >
                    <TableCell className="pl-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 flex-shrink-0">
                          <AvatarFallback className="bg-primary/10 text-[11px] font-bold text-primary">
                            {student.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {student.full_name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            @{student.username}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate text-sm text-muted-foreground">
                      {student.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          statusConfig[student.status]?.className ??
                          "border-0 bg-muted text-muted-foreground"
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {student.enrolledCourses}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-muted sm:block">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {student.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {student.lastActive}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {student.created_at}
                    </TableCell>
                    <TableCell
                      className="pr-5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={() => onSelectStudent(student)}
                          >
                            <User className="mr-2 h-3.5 w-3.5" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => onSelectStudent(student)}
                          >
                            <BookOpen className="mr-2 h-3.5 w-3.5" />
                            View Enrollments
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => onSelectStudent(student)}
                          >
                            <HelpCircle className="mr-2 h-3.5 w-3.5" />
                            View Quiz History
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => onSelectStudent(student)}
                          >
                            <BarChart3 className="mr-2 h-3.5 w-3.5" />
                            View Learning Progress
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />

                          {/* {student.status === "suspended" ? (
                            <DropdownMenuItem
                              onSelect={() => handleReactivate(student)}
                            >
                              <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-emerald-600" />
                              Reactivate Account
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onSelect={() => handleSuspend(student)}
                            >
                              <Ban className="mr-2 h-3.5 w-3.5 text-amber-600" />
                              Suspend Account
                            </DropdownMenuItem>
                          )} */}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={() => handleDelete(student)}
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Delete Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
