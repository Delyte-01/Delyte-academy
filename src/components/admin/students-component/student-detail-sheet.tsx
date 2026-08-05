"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Trophy,
  Target,
  Flame,
  UserPlus,
  UserCheck,
  UserCog,
  MessageSquare,
  Ban,
  Trash2,
} from "lucide-react";
import type {
  AdminStudent as Student,
  StudentStatus,
} from "@/hooks/useAdminStudents";
import { toast } from "sonner";
import { deleteStudent, updateStudent } from "@/services/admin-students";

const statusConfig: Record<StudentStatus, { className: string }> = {
  active: {
    className:
      "border-0 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  },
  inactive: {
    className: "border-0 bg-muted text-muted-foreground",
  },
  suspended: {
    className: "border-0 bg-rose-500/15 text-rose-700 dark:text-rose-400",
  },
};

const activityIcon = {
  enrolled: {
    icon: UserPlus,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  topic: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
  quiz: {
    icon: HelpCircle,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
  finished: {
    icon: Trophy,
    color: "text-violet-600",
    bgColor: "bg-violet-500/10",
  },
} as const;

interface StudentDetailSheetProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStudentUpdated?: (updates: Partial<Student>) => void;
  onStudentDeleted?: () => void;
}

export function StudentDetailSheet({
  student,
  open,
  onOpenChange,
  onStudentUpdated,
  onStudentDeleted,
}: StudentDetailSheetProps) {
  if (!student) return null;

  const stats = [
    {
      label: "Courses Enrolled",
      value: student.enrolledCourses,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Courses Completed",
      value: student.completedCourses,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Course Progress",
      value: `${student.progress}%`,
      icon: Target,
      color: "text-violet-600",
      bgColor: "bg-violet-500/10",
    },
    {
      label: "Average Quiz Score",
      value: `${student.averageScore}%`,
      icon: Trophy,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Current Streak",
      value: `${student.streak} days`,
      icon: Flame,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
    },
  ];

  const handleGrantAdmin = async () => {
    try {
      await updateStudent(student.id, { role: "admin" });
      onStudentUpdated?.({ role: "admin" });
      toast.success("Student promoted to admin");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  const handleRevokeAdmin = async () => {
    try {
      await updateStudent(student.id, { role: "student" });
      onStudentUpdated?.({ role: "student" });
      toast.success("Admin privileges removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };
  const handleSuspend = async () => {
    try {
      await updateStudent(student.id, { status: "suspended" });
      onStudentUpdated?.({ status: "suspended" });
      toast.success("Account suspended");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };
  const handleReactivate = async () => {
    try {
      await updateStudent(student.id, { status: "active" });
      onStudentUpdated?.({ status: "active" });
      toast.success("Account reactivated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };
  const handleDelete = async () => {
    if (
      !window.confirm(`Delete ${student.full_name}? This cannot be undone.`)
    ) {
      return;
    }

    try {
      await deleteStudent(student.id);
      onStudentDeleted?.();
      toast.success("Student deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex h-screen w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        {/* Header with profile */}
        <SheetHeader className="flex-shrink-0 space-y-0 border-b p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
                {student.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <SheetTitle className="truncate text-lg font-bold">
                {student.full_name}
              </SheetTitle>
              <SheetDescription className="truncate">
                @{student.username}
              </SheetDescription>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  className={
                    statusConfig[student.status]?.className ??
                    "border-0 bg-muted text-muted-foreground"
                  }
                >
                  {student.status}
                </Badge>
                {student.role === "admin" && (
                  <Badge className="border-0 bg-violet-500/15 text-violet-700 dark:text-violet-400">
                    Admin
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable content */}
        <ScrollArea className="h-0 flex-1">
          <div className="space-y-6 p-6">
            {/* Profile details */}
            <section>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Profile
              </h3>
              <div className="space-y-2.5 rounded-2xl border p-4">
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="truncate text-foreground">
                    {student.email}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Phone className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="text-foreground">
                    {student.phone ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="text-foreground">
                    {student.country ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="text-foreground">
                    Joined {student.created_at}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Clock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="text-foreground">
                    Last login {student.lastActive}
                  </span>
                </div>
                {student.bio && (
                  <p className="border-t pt-2.5 text-sm text-muted-foreground">
                    {student.bio}
                  </p>
                )}
              </div>
            </section>

            {/* Learning stats */}
            <section>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Learning Stats
              </h3>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="rounded-2xl border p-3">
                      <div
                        className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl ${stat.bgColor}`}
                      >
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                      <p className="text-lg font-extrabold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Current enrollments */}
            <div className="rounded-2xl border p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Enrollment details will be connected to Supabase next.
              </p>
            </div>
            {/* Recent activity timeline */}
            <div className="rounded-2xl border p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Recent activity will be loaded from quiz attempts and topic
                progress.
              </p>
            </div>

            {/* Admin controls */}
            <section>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Admin Controls
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                  Message
                </Button>
                {student.role === "admin" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRevokeAdmin}
                  >
                    <UserCheck className="mr-1.5 h-3.5 w-3.5" />
                    Revoke Admin
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGrantAdmin}
                  >
                    <UserCog className="mr-1.5 h-3.5 w-3.5" />
                    Grant Admin
                  </Button>
                )}

                {student.status === "suspended" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReactivate}
                  >
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                    Reactivate
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleSuspend}>
                    <Ban className="mr-1.5 h-3.5 w-3.5 text-amber-600" />
                    Suspend
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
