"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import AdminSidebar, { navItems } from "@/components/admin/admin-sidebar";
import AdminTopbar from "@/components/admin/admin-topbar";
import { authService } from "@/services/auth";
import { toast } from "sonner";


export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
  }) {
  
  const router = useRouter();


    const handleSignOut = async () => {
      try {
        const { error } = await authService.logout();

        if (error) throw error;

        toast.success("Logged out successfully.");

        router.replace("/login");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to log out."
        );
      }
    };

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname = usePathname();

  const mainRef = useRef<HTMLElement>(null);

  const currentNav = navItems.find((n) => {
    if (n.href === "/admin") return pathname === "/admin";
    return pathname.startsWith(n.href);
  });

  useEffect(() => {
    if (!mainRef.current) return;

    gsap.fromTo(
      mainRef.current,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      }
    );
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        handleSignOut={handleSignOut}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AdminTopbar
          onOpenMobile={() => setMobileOpen(true)}
          title={currentNav?.label ?? "Admin"}
          subtitle="Delyte Academy Management"
        />

        <main
          ref={mainRef}
          className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
