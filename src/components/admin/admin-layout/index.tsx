"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminTopbar from "@/components/admin/admin-topbar";
import AdminCommandPalette from "@/components/admin/admin-command-palette";
import { useProfile } from "@/hooks/useProfile";
import { authService } from "@/services/auth";
import { toast } from "sonner";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { profile } = useProfile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const handleSignOut = async () => {
    try {
      const { error } = await authService.logout();
      if (error) throw error;
      toast.success("Logged out successfully.");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to log out.");
    }
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <a
        href="#admin-main"
        className="sr-only z-[60] rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        profile={profile}
        onCloseMobile={closeMobile}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        handleSignOut={handleSignOut}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AdminTopbar
          profile={profile}
          onOpenMobile={() => setMobileOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onSignOut={handleSignOut}
        />
        <main id="admin-main" tabIndex={-1} className="min-h-0 flex-1 overflow-y-auto outline-none">
          <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>

      <AdminCommandPalette
        open={searchOpen}
        onOpenChange={setSearchOpen}
        isSuperAdmin={profile?.role === "super_admin"}
      />
    </div>
  );
}
