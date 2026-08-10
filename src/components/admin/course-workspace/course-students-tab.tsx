"use client";

import { useMemo, useState } from "react";
import { Search, Users, CheckCircle2, TrendingUp, Eye } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Enrollment } from "@/types/enrollment";

interface CourseStudentsTabProps {
  students: Enrollment[];
  onViewStudent?: (studentId: string) => void;
}

function formatEnrolledDate(dateString?: string) {
  if (!dateString) return "recently";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CourseStudentsTab({
  students,
  onViewStudent,
}: CourseStudentsTabProps) {
  const [query, setQuery] = useState("");

  const filteredStudents = useMemo(() => {
    if (!query.trim()) return students;

    const q = query.toLowerCase();

    return students.filter((item) => {
      const name = item.profiles?.full_name?.toLowerCase() ?? "";
      const email = item.profiles?.email?.toLowerCase() ?? "";
      const username = item.profiles?.username?.toLowerCase() ?? "";

      return name.includes(q) || email.includes(q) || username.includes(q);
    });
  }, [students, query]);

  const totalStudents = students.length;
  const completedCount = students.filter((s) => s.completed).length;
  const averageProgress =
    students.length > 0
      ? Math.round(
          students.reduce((sum, s) => sum + (s.progress ?? 0), 0) /
            students.length,
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Total enrolled</p>
              <p className="text-2xl font-bold text-foreground">
                {totalStudents}
              </p>
            </div>
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-foreground">
                {completedCount}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Average progress</p>
              <p className="text-2xl font-bold text-foreground">
                {averageProgress}%
              </p>
            </div>
            <div className="rounded-xl bg-amber-500/10 p-3 text-amber-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-5">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search students by name, email, or username..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Enrolled students</h3>
            <Badge variant="outline">{filteredStudents.length} students</Badge>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="font-medium text-foreground">No students found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or wait for students to enroll.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStudents.map((enrollment) => {
                const profile = enrollment.profiles;

                const name = profile?.full_name || "Student";
                const email = profile?.email || "No email";
                const initials = name
                  .split(" ")
                  .filter(Boolean)
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={enrollment.id}
                    className="flex flex-col gap-4 rounded-2xl border border-border/60 p-4 transition-colors hover:bg-muted/20 md:flex-row md:items-center"
                  >
                    <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                      <AvatarImage
                        src={profile?.avatar_url ?? undefined}
                        alt={name}
                      />
                      <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-foreground">{name}</p>
                        {enrollment.completed ? (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="outline">In progress</Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">{email}</p>

                      <div className="mt-2">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="font-medium text-foreground">
                            {enrollment.progress ?? 0}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{
                              width: `${enrollment.progress ?? 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-2 md:items-end">
                      <p className="text-xs text-muted-foreground">
                        Enrolled {formatEnrolledDate(enrollment.enrolled_at)}
                      </p>

                      {onViewStudent && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => onViewStudent(enrollment.student_id)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
