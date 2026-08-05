import type { AdminStudent } from "@/hooks/useAdminStudents";

function escapeCsv(value: unknown): string {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes("\n") || str.includes("\"")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportStudentsToCsv(students: AdminStudent[]) {
  const headers = [
    "Full Name",
    "Username",
    "Email",
    "Role",
    "Status",
    "Enrolled Courses",
    "Completed Courses",
    "Progress",
    "Average Quiz Score",
    "Streak",
    "Country",
    "Phone",
    "Join Date",
    "Last Active",
  ];

  const rows = students.map((s) => [
    s.full_name,
    s.username,
    s.email,
    s.role,
    s.status,
    s.enrolledCourses,
    s.completedCourses,
    `${s.progress}%`,
    `${s.averageScore}%`,
    s.streak,
    s.country,
    s.phone,
    s.created_at,
    s.lastActive,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `delyte-students-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}