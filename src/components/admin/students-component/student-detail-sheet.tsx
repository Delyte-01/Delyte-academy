"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Ban,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Flame,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Target,
  Trash2,
  Trophy,
  UserCheck,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
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
import type { AdminStudent as Student, StudentStatus } from "@/hooks/useAdminStudents";
import { deleteStudent, updateStudent } from "@/services/admin-students";
import { formatRelative } from "@/hooks/useAdminAnalytics";
import { enrollmentService } from "@/services/enrollment";
import { Enrollment } from "@/types/enrollment";
import type { RecentActivityItem } from "@/services/dashboard";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { cn } from "@/lib/utils";

const STATUS_VARIANT: Record<StudentStatus, "brand" | "muted" | "danger"> = {
  active: "brand",
  inactive: "muted",
  suspended: "danger",
};

const ACTIVITY: Record<string, { icon: LucideIcon; tone: string }> = {
  enrollment: { icon: BookOpen, tone: "bg-primary-soft text-primary-soft-foreground" },
  topic_completed: { icon: CheckCircle2, tone: "bg-info-soft text-info" },
  quiz_completed: { icon: ClipboardCheck, tone: "bg-warning-soft text-warning" },
};
const activityMeta = (type: RecentActivityItem["type"]) =>
  ACTIVITY[type] ?? { icon: Clock, tone: "bg-muted text-muted-foreground" };

type Confirm = "delete" | "grant" | "revoke" | "suspend" | null;

const CONFIRM_COPY: Record<Exclude<Confirm, null>, { title: string; action: string; destructive: boolean }> = {
  delete: { title: "Delete this student?", action: "Delete student", destructive: true },
  grant: { title: "Make this student an admin?", action: "Grant admin", destructive: false },
  revoke: { title: "Remove admin access?", action: "Revoke admin", destructive: true },
  suspend: { title: "Suspend this account?", action: "Suspend", destructive: true },
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
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [working, setWorking] = useState(false);
  const { activities, loading: loadingActivity } = useRecentActivity(student?.id);

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

  if (!student) return null;

  const stats: { label: string; value: string | number; icon: LucideIcon; tone: string }[] = [
    { label: "Enrolled", value: student.enrolledCourses, icon: BookOpen, tone: "bg-info-soft text-info" },
    { label: "Completed", value: student.completedCourses, icon: CheckCircle2, tone: "bg-success-soft text-success" },
    { label: "Progress", value: `${student.progress}%`, icon: Target, tone: "bg-primary-soft text-primary-soft-foreground" },
    { label: "Avg. quiz score", value: `${student.averageScore}%`, icon: Trophy, tone: "bg-primary-soft text-primary-soft-foreground" },
    { label: "Streak", value: `${student.streak} days`, icon: Flame, tone: "bg-warning-soft text-warning" },
  ];

  const run = async (fn: () => Promise<void>) => {
    setWorking(true);
    try {
      await fn();
      setConfirm(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setWorking(false);
    }
  };

  const performConfirmed = () => {
    if (!confirm) return;
    void run(async () => {
      if (confirm === "grant") {
        await updateStudent(student.id, { role: "admin" });
        onStudentUpdated?.({ role: "admin" });
        toast.success("Student promoted to admin");
      } else if (confirm === "revoke") {
        await updateStudent(student.id, { role: "student" });
        onStudentUpdated?.({ role: "student" });
        toast.success("Admin privileges removed");
      } else if (confirm === "suspend") {
        await updateStudent(student.id, { status: "suspended" });
        onStudentUpdated?.({ status: "suspended" });
        toast.success("Account suspended");
      } else {
        await deleteStudent(student.id);
        onStudentDeleted?.();
        toast.success("Student deleted");
      }
    });
  };

  const handleReactivate = () =>
    run(async () => {
      await updateStudent(student.id, { status: "active" });
      onStudentUpdated?.({ status: "active" });
      toast.success("Account reactivated");
    });

  const lastLogin = new Date(student.lastLoginAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const details: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Mail, label: "Email", value: student.email },
    { icon: Phone, label: "Phone", value: student.phone || "Not provided" },
    { icon: MapPin, label: "Country", value: student.country || "Not provided" },
    { icon: Calendar, label: "Joined", value: student.created_at },
    { icon: Clock, label: "Last login", value: `${student.lastActive} · ${lastLogin}` },
  ];

  const copy = confirm ? CONFIRM_COPY[confirm] : null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex h-dvh w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
          <SheetHeader className="shrink-0 space-y-0 border-b bg-brand-wash p-5 pr-14 sm:p-6 sm:pr-14">
            <div className="flex items-center gap-4">
              <Avatar className="size-16 shrink-0 ring-4 ring-card">
                <AvatarImage src={student.avatar_url ?? undefined} alt="" />
                <AvatarFallback className="bg-primary-soft text-lg font-bold text-primary-soft-foreground">
                  {student.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-1.5">
                <SheetTitle className="truncate font-heading text-xl font-extrabold">
                  {student.full_name}
                </SheetTitle>
                <SheetDescription className="truncate text-[15px]">@{student.username}</SheetDescription>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={STATUS_VARIANT[student.status] ?? "muted"} className="capitalize">
                    {student.status}
                  </Badge>
                  {student.role === "admin" && <Badge variant="brand">Admin</Badge>}
                </div>
              </div>
            </div>
          </SheetHeader>

          <Tabs defaultValue="overview" className="min-h-0 flex-1 gap-0">
            <div className="shrink-0 border-b px-3 sm:px-5">
              <TabsList variant="line" className="h-12 w-full justify-start gap-1">
                <TabsTrigger value="overview" className="flex-none px-3 text-[15px]">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="courses" className="flex-none px-3 text-[15px]">
                  Courses
                  <span className="rounded-full bg-muted px-1.5 text-xs font-bold tabular-nums">
                    {student.enrolledCourses}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex-none px-3 text-[15px]">
                  Activity
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <TabsContent value="overview" className="space-y-6 p-5 sm:p-6">
                <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {stats.map(({ label, value, icon: Icon, tone }) => (
                    <div key={label} className="rounded-xl border bg-card p-3.5 shadow-soft">
                      <span className={cn("mb-2.5 flex size-9 items-center justify-center rounded-lg", tone)}>
                        <Icon className="size-[18px]" aria-hidden />
                      </span>
                      <dd className="font-heading text-xl font-extrabold tabular-nums text-foreground">{value}</dd>
                      <dt className="text-[13px] text-muted-foreground">{label}</dt>
                    </div>
                  ))}
                </dl>

                <section aria-labelledby="profile-heading">
                  <h3 id="profile-heading" className="mb-3 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
                    Profile
                  </h3>
                  <dl className="divide-y rounded-xl border bg-card">
                    {details.map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-3 px-4 py-3">
                        <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                        <div className="min-w-0">
                          <dt className="text-[13px] text-muted-foreground">{label}</dt>
                          <dd className="break-words text-[15px] font-medium text-foreground">{value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                  {student.bio && (
                    <p className="mt-3 rounded-xl bg-muted/50 p-4 text-[15px] leading-relaxed text-muted-foreground">
                      {student.bio}
                    </p>
                  )}
                </section>
              </TabsContent>

              <TabsContent value="courses" className="p-5 sm:p-6">
                {loadingEnrollments ? (
                  <div className="space-y-3" role="status" aria-label="Loading enrollments">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-[76px] rounded-xl" />
                    ))}
                  </div>
                ) : enrollments.length === 0 ? (
                  <p className="rounded-xl border border-dashed p-8 text-center text-[15px] text-muted-foreground">
                    This student is not enrolled in any courses yet.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {enrollments.map((enrollment) => (
                      <li key={enrollment.id} className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-soft">
                        <Image
                          src={enrollment.course?.thumbnail || "/placeholder-course.png"}
                          alt=""
                          width={96}
                          height={96}
                          className="size-14 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[15px] font-bold text-foreground">
                              {enrollment.course?.title}
                            </p>
                            {enrollment.completed ? (
                              <Badge variant="success" size="sm">Completed</Badge>
                            ) : (
                              <Badge variant="info" size="sm">In progress</Badge>
                            )}
                          </div>
                          <p className="text-[13px] text-muted-foreground">
                            {enrollment.course?.course_code || "Course"} · Enrolled{" "}
                            {formatRelative(enrollment.enrolled_at)}
                          </p>
                          {!enrollment.completed && typeof enrollment.progress === "number" && (
                            <div className="flex items-center gap-2 pt-1">
                              <ProgressBar value={enrollment.progress} size="sm" label="Course progress" />
                              <span className="shrink-0 text-xs font-bold tabular-nums text-muted-foreground">
                                {Math.round(enrollment.progress)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>

              <TabsContent value="activity" className="p-5 sm:p-6">
                {loadingActivity ? (
                  <div className="space-y-5" role="status" aria-label="Loading activity">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="size-9 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-3.5 w-1/2" />
                          <Skeleton className="h-3.5 w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activities.length === 0 ? (
                  <p className="rounded-xl border border-dashed p-8 text-center text-[15px] text-muted-foreground">
                    No recent activity yet.
                  </p>
                ) : (
                  <ol>
                    {activities.map((item, idx) => {
                      const { icon: Icon, tone } = activityMeta(item.type);
                      return (
                        <li key={item.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", tone)}>
                              <Icon className="size-4" aria-hidden />
                            </span>
                            {idx < activities.length - 1 && <span className="my-1 w-px flex-1 bg-border" />}
                          </div>
                          <div className="pb-5">
                            <p className="text-[15px] font-semibold text-foreground">{item.text}</p>
                            <p className="text-sm text-muted-foreground">{item.course}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{item.time}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </TabsContent>
            </div>
          </Tabs>

          {/* Admin controls — always reachable, destructive action separated */}
          <footer className="shrink-0 space-y-2 border-t bg-card p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" asChild>
                <a href={`mailto:${student.email}`}>
                  <MessageSquare className="size-4" />
                  Message
                </a>
              </Button>
              {student.role === "admin" ? (
                <Button variant="outline" onClick={() => setConfirm("revoke")}>
                  <UserCheck className="size-4" />
                  Revoke admin
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setConfirm("grant")}>
                  <UserCog className="size-4" />
                  Grant admin
                </Button>
              )}
              {student.status === "suspended" ? (
                <Button variant="outline" onClick={handleReactivate} disabled={working}>
                  <CheckCircle2 className="size-4 text-success" />
                  Reactivate
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setConfirm("suspend")}>
                  <Ban className="size-4 text-warning" />
                  Suspend
                </Button>
              )}
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => setConfirm("delete")}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            </div>
          </footer>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && !working && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === "delete" && `${student.full_name} will be permanently removed. This can’t be undone.`}
              {confirm === "grant" && `${student.full_name} will be able to manage courses and content.`}
              {confirm === "revoke" && `${student.full_name} will lose admin access and become a regular student.`}
              {confirm === "suspend" && `${student.full_name} won’t be able to use their account until it’s reactivated.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={working}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={copy?.destructive ? "destructive" : "default"}
              disabled={working}
              onClick={(e) => {
                e.preventDefault();
                performConfirmed();
              }}
            >
              {working ? "Working…" : copy?.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
