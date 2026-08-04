"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import gsap from "gsap";
import Sidebar from "@/components/dashboard-components/sidebar";
import Header from "@/components/dashboard-components/header";
import { toast } from "sonner";
import { authService } from "@/services/auth";
import { FullPageLoader } from "@/components/loading/Loading";

import { ProfileProvider, useProfile } from "@/context/profile-context";


const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfileProvider>
      <DashboardContent>{children}</DashboardContent>
    </ProfileProvider>
  );
}

 function DashboardContent({
  children,
}: {
  children: React.ReactNode;
}) {


  const { profile } = useProfile();

  const displayName = profile?.full_name || "Student";

  const displayLevel =
    profile?.role === "admin" || profile?.role === "super_admin"
      ? "Administrator"
      : "Student";

  const avatarUrl = profile?.avatar_url || "";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // const [profile, setProfile] = useState("");
  console.log(setLoading)

  const blobRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);

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

  

  // Ambient background aura — slow breathing motion, purely decorative
  useEffect(() => {
    if (!blobRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(blobRef.current, {
        scale: 1.08,
        x: 20,
        y: -10,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!loading && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.05 }
      );
    }
  }, [loading]);

  if (loading) {
    return (
    <FullPageLoader />
    );
  }



  return (
    <div
      className={`${display.variable} ${body.variable} relative flex min-h-screen bg-background text-foreground font-sans antialiased student-theme`}
    >
      {/* Ambient gradient aura, fixed to viewport, behind everything */}
      <div
        ref={blobRef}
        aria-hidden
        className="pointer-events-none fixed -right-40 -top-40 z-0 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #C4B5FD 0%, #FBCFE8 45%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -left-32 bottom-0 z-0 h-[380px] w-[380px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #A7F3D0 0%, #C4B5FD 50%, transparent 75%)",
        }}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSignOut={handleSignOut}
      />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          displayName={displayName}
          displayLevel={displayLevel}
          avatarUrl={avatarUrl}
        />

        <main
          ref={contentRef}
          className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  
  );
}
