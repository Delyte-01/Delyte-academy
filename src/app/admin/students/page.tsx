"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import AdminBreadcrumb from "@/components/admin/admin-breadcrumb";
import { Button } from "@/components/ui/button";
import { StudentsKpiCards } from "@/components/admin/students-component/students-kpi-cards";
import { EnrollmentFilter, SortOption, StatusFilter, StudentsToolbar } from "@/components/admin/students-component/students-toolbar";
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
      <PageHeader
        breadcrumb={<AdminBreadcrumb />}
        title="Students"
        description="Manage all student accounts, enrollments, and learning activity."
        actions={
          <Button variant="outline" onClick={handleExportCsv}>
            <Download aria-hidden />
            Export CSV
          </Button>
        }
      />

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
        <div className="grid gap-3" role="status" aria-label="Loading students">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="skeleton-shimmer h-16 rounded-xl border bg-muted/40"
            />
          ))}
        </div>
      ) : (
        <AdminStudentsTable
          students={filteredStudents}
          total={students.length}
          onSelectStudent={handleSelectStudent}
          onStudentDeleted={removeStudentLocal}
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
