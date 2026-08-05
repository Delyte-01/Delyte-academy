/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { Download, UserPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudentsKpiCards } from "@/components/admin/students-component/students-kpi-cards";
import { EnrollmentFilter, SortOption, StatusFilter, StudentsToolbar } from "@/components/admin/students-component/students-toolbar";
// import { StudentsTable } from "@/components/admin/students-component/students-table";
import { StudentDetailSheet } from "@/components/admin/students-component/student-detail-sheet";

import { AdminStudent, useAdminStudents } from "@/hooks/useAdminStudents";
import { AdminStudentsTable } from "@/components/admin/students-component/students-table";
import { exportStudentsToCsv } from "@/lib/utils/export-csv";


export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [enrollment, setEnrollment] = useState<EnrollmentFilter>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [selectedStudent, setSelectedStudent] = useState<AdminStudent | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);


  const { students, loading, updateStudentLocal, removeStudentLocal } =
    useAdminStudents();
 

 const filteredStudents = useMemo(() => {
   let result = [...students];

   if (search.trim()) {
     const q = search.toLowerCase();
     result = result.filter(
       (s) =>
         s.full_name.toLowerCase().includes(q) ||
         s.email.toLowerCase().includes(q) ||
         s.username.toLowerCase().includes(q),
     );
   }

   if (status !== "all") {
     result = result.filter(
       (s) => s.status.toLowerCase() === status.toLowerCase(),
     );
   }

   if (enrollment === "enrolled") {
     result = result.filter((s) => s.enrolledCourses > 0);
   } else if (enrollment === "not-enrolled") {
     result = result.filter((s) => s.enrolledCourses === 0);
   }

   switch (sort) {
     case "newest":
       result.sort(
         (a, b) =>
           new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
       );
       break;
     case "oldest":
       result.sort(
         (a, b) =>
           new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
       );
       break;
     case "most-active":
       result.sort(
         (a, b) =>
           new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime(),
       );
       break;
     case "highest-progress":
       result.sort((a, b) => b.progress - a.progress);
       break;
   }

   return result;
 }, [students, search, status, enrollment, sort]);
  const handleSelectStudent = (student: AdminStudent) => {
    setSelectedStudent(student);
    setSheetOpen(true);
  };

 
  const handleExportCsv = () => {
    exportStudentsToCsv(filteredStudents);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Students
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all student accounts, enrollments, and learning activity.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" onClick={handleExportCsv}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button disabled variant="ghost">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Student
          </Button>
          <Button disabled variant="default">
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <StudentsKpiCards students={students} />

      {/* Toolbar */}
      <StudentsToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        enrollment={enrollment}
        onEnrollmentChange={setEnrollment}
        sort={sort}
        onSortChange={setSort}
      />

      {/* Table */}
      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-2xl border bg-muted/40"
            />
          ))}
        </div>
      ) : (
        <AdminStudentsTable
          students={filteredStudents as any}
          onSelectStudent={handleSelectStudent as any}
        />
      )}

      {/* Detail sheet */}
      <StudentDetailSheet
        student={selectedStudent}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onStudentUpdated={(updates) => {
          if (!selectedStudent) return;

          const updated = { ...selectedStudent, ...updates };
          setSelectedStudent(updated);
          updateStudentLocal(selectedStudent.id, updates);
        }}
        onStudentDeleted={() => {
          if (!selectedStudent) return;

          removeStudentLocal(selectedStudent.id);
          setSheetOpen(false);
        }}
      />
    </div>
  );
}
