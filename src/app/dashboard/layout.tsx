"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import Sidebar from "@/components/dashboard-components/sidebar";
import Header from "@/components/dashboard-components/header";
import { CommandPalette } from "@/components/dashboard-components/command-palette";
import { Skeleton } from "@/components/ui/skeleton";
import { authService } from "@/services/auth";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

import { ProfileProvider, useProfile } from "@/context/profile-context";
import { EnrollmentProvider } from "@/context/enrollment-context";
import { NotificationProvider } from "@/components/dashboard-components/notifications-components/notification-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfileProvider>
      <NotificationProvider>
        <DashboardContent>{children}</DashboardContent>
      </NotificationProvider>
    </ProfileProvider>
  );
}

/** Shown while the profile loads, so the first paint is the shell, not a blank screen. */
function ShellSkeleton() {
  return (
    <div
      className="flex min-h-screen bg-background"
      role="status"
      aria-label="Loading your workspace"
    >
      <div className="hidden w-64 shrink-0 flex-col gap-3 border-r bg-card p-4 lg:flex">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="mt-4 h-16 w-full rounded-xl" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full" />
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 items-center justify-between border-b px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="size-10 rounded-full" />
        </div>
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-52 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { profile, loading: profileLoading } = useProfile();
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const contentRef = useRef<HTMLElement>(null);

  const displayName = profile?.full_name || "Student";
  const displayLevel =
    profile?.role === "admin" || profile?.role === "super_admin"
      ? "Administrator"
      : "Student";
  const avatarUrl = profile?.avatar_url || "";

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

  // Soft page transition on every route change (transform/opacity only,
  // cleared afterwards so fixed children and hover transforms keep working).
  useGSAP(
    () => {
      const el = contentRef.current;
      if (!el || prefersReducedMotion()) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          clearProps: "opacity,transform",
        },
      );
    },
    { dependencies: [pathname, Boolean(profile)] },
  );

  if (!profile) {
    return profileLoading ? <ShellSkeleton /> : null;
  }

  return (
    <EnrollmentProvider studentId={profile.id}>
      <div className="relative flex min-h-screen bg-background font-sans text-foreground antialiased">
        <a
          href="#main-content"
          className="sr-only z-50 rounded-lg bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-float focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSignOut={handleSignOut}
        />

        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            onSearchClick={() => setPaletteOpen(true)}
            onSignOut={handleSignOut}
            displayName={displayName}
            displayLevel={displayLevel}
            avatarUrl={avatarUrl}
          />

          {/* overflow-x-clip (not auto) so sticky children keep sticking to the page scroll */}
          <main
            id="main-content"
            ref={contentRef}
            className="flex-1 overflow-x-clip p-4 sm:p-6 lg:p-8"
          >
            {children}
          </main>
        </div>

        <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      </div>
    </EnrollmentProvider>
  );
}
