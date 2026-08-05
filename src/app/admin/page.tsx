"use client";

import {
  pendingReviews,
} from "@/components/admin/admin-home/dashboard-data";
import { EnrollmentChart } from "@/components/admin/admin-home/enrollment-chart";
import { KpiCards } from "@/components/admin/admin-home/kpi-cards";
import { PendingReviews } from "@/components/admin/admin-home/pending-reviews";
import { QuickActions } from "@/components/admin/admin-home/quick-actions";

import { RecentActivity } from "@/components/admin/admin-home/recent-activity";
import { RecentCoursesTable } from "@/components/admin/admin-home/recent-course-table";
import { SystemSnapshot } from "@/components/admin/admin-home/system-snapshot";
import { WelcomeHeader } from "@/components/admin/admin-home/welcome-header";

import { useSystemSnapshot } from "@/hooks/useSystemSnapShot";

export default function AdminDashboardHome() {



  const { metrics } = useSystemSnapshot();


  return (
    <div className="space-y-6">
      {/* Header */}
      <WelcomeHeader />

      {/* KPI Cards */}
      <KpiCards  />

      {/* Main content grid */}
      <div className="grid items-start gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          <EnrollmentChart  />
          <RecentActivity  />
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <QuickActions />
          <PendingReviews reviews={pendingReviews} />
        </div>
      </div>

      {/* Bottom section */}
      <RecentCoursesTable  />
      <SystemSnapshot metrics={metrics} />
    </div>
  );
}
