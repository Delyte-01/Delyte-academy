"use client";

import { EnrollmentChart } from "@/components/admin/admin-home/enrollment-chart";
import { KpiCards } from "@/components/admin/admin-home/kpi-cards";
import { NeedsAttention } from "@/components/admin/admin-home/needs-attention";
import { QuickActions } from "@/components/admin/admin-home/quick-actions";
import { RecentActivity } from "@/components/admin/admin-home/recent-activity";
import { RecentCoursesTable } from "@/components/admin/admin-home/recent-course-table";
import { SystemSnapshot } from "@/components/admin/admin-home/system-snapshot";
import { WelcomeHeader } from "@/components/admin/admin-home/welcome-header";
import { useAdminProfile } from "@/hooks/useAdminProfile";
import { useSystemSnapshot } from "@/hooks/useSystemSnapShot";

export default function AdminDashboardHome() {
  const { profile } = useAdminProfile();
  const { metrics } = useSystemSnapshot();

  return (
    <div className="space-y-8">
      <WelcomeHeader profile={profile} />

      <KpiCards />

      {/* What to do next (attention + shortcuts) leads on mobile; charts follow */}
      <div className="grid items-start gap-6 xl:grid-cols-3">
        <div className="space-y-6 max-xl:order-2 xl:col-span-2">
          <EnrollmentChart />
          <RecentActivity />
        </div>
        <div className="space-y-6 max-xl:order-1">
          <NeedsAttention />
          <QuickActions isSuperAdmin={profile?.role === "super_admin"} />
        </div>
      </div>

      <RecentCoursesTable />
      <SystemSnapshot metrics={metrics} />
    </div>
  );
}
