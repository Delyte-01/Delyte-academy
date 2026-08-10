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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  ClipboardCheck,
} from "lucide-react";
import type {
  AdminStudent as Student,
  StudentStatus,
} from "@/hooks/useAdminStudents";
import { toast } from "sonner";
import { deleteStudent, updateStudent } from "@/services/admin-students";
import { formatRelative } from "@/hooks/useAdminAnalytics";
import { useEffect, useState } from "react";
import { enrollmentService } from "@/services/enrollment";
import { Enrollment } from "@/types/enrollment";
import Image from "next/image";
import { getRecentActivity, RecentActivityItem } from "@/services/dashboard";
import { useRecentActivity } from "@/hooks/useRecentActivity";

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

const activityIcon = (type: RecentActivityItem["type"]) => {
  switch (type) {
    case "enrollment":
      return <BookOpen className="h-4 w-4" />;
    case "topic_completed":
      return <CheckCircle2 className="h-4 w-4" />;
    case "quiz_completed":
      return <ClipboardCheck className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const activityStyle = (type: RecentActivityItem["type"]) => {
  switch (type) {
    case "enrollment":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300";
    case "topic_completed":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300";
    case "quiz_completed":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";
    default:
      return "bg-muted text-muted-foreground";
  }
};

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
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  // const [loadingActivity, setLoadingActivity] = useState(false);
  const { activities, loading: loadingActivity } = useRecentActivity(
    student?.id,
  );

  useEffect(() => {
    if (!student || !open) return;

    const load = async () => {
      try {
        setLoadingEnrollments(true);
        const data = await enrollmentService.getStudentCourses(student.id);
        setEnrollments(data ?? []);
      } catch (err) {
        console.error(err);
        toast.error("Unable to load enrollments");
      } finally {
        setLoadingEnrollments(false);
      }
    };

    load();
  }, [student, open]);

  console.log(enrollments, "enrolme");

  console.log(activities, "activities");
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
            <Avatar className="h-16 w-16 flex-shrink-0 ring-2 ring-primary/15">
              <AvatarImage
                src={student.avatar_url ?? undefined}
                alt={student.full_name}
              />
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
                  <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="text-foreground">
                    Joined {student.created_at}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Clock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="text-foreground">
                    Last login {student.lastActive} (
                    {new Date(student.lastLoginAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                    )
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
            <div className="rounded-2xl border p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  Current enrollments
                </h3>
                <Badge variant="outline">{enrollments.length} courses</Badge>
              </div>

              {loadingEnrollments ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 animate-pulse rounded-xl bg-muted"
                    />
                  ))}
                </div>
              ) : enrollments.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    This student is not enrolled in any courses yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {enrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center gap-3 rounded-xl border border-border/60 p-3"
                    >
                      <Image
                        src={
                          enrollment.course?.thumbnail ||
                          "/placeholder-course.png"
                        }
                        alt={enrollment.course?.title ?? ""}
                        width={500}
                        height={200}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate font-medium text-foreground">
                            {enrollment.course?.title}
                          </p>
                          {enrollment.completed ? (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="outline">In progress</Badge>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {enrollment.course?.course_code || "Course"} •
                          Enrolled {formatRelative(enrollment.enrolled_at)}
                        </p>

                        {!enrollment.completed &&
                          typeof enrollment.progress === "number" && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-full rounded-full bg-primary transition-all"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      Math.max(0, enrollment.progress),
                                    )}%`,
                                  }}
                                />
                              </div>
                              <span className="shrink-0 text-xs text-muted-foreground">
                                {Math.round(enrollment.progress)}%
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Recent activity timeline */}
            <div className="rounded-2xl border p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  Recent activity
                </h3>
                <Badge variant="outline">{activities.length} events</Badge>
              </div>

              {loadingActivity ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activities.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No recent activity available yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((item, idx) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full ${activityStyle(item.type)}`}
                        >
                          {activityIcon(item.type)}
                        </div>

                        {idx < activities.length - 1 && (
                          <div className="mt-1 h-full w-px bg-gradient-to-b from-border to-transparent" />
                        )}
                      </div>

                      <div className="pb-2">
                        <p className="text-sm font-medium text-foreground">
                          {item.text}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.course}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
