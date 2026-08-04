"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import gsap from "gsap";

import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ProfileSection } from "@/components/dashboard-components/settings-oomponents/profile-section";
import { AccountSection } from "@/components/dashboard-components/settings-oomponents/account-selection";
import { PreferencesSection } from "@/components/dashboard-components/settings-oomponents/preference-section";
import { SecuritySection } from "@/components/dashboard-components/settings-oomponents/security-section";
import { DangerZoneSection } from "@/components/dashboard-components/settings-oomponents/danger-zone";
import {
  SettingsSidebar,
  SettingsMobileNav,
} from "@/components/dashboard-components/settings-oomponents/settings-sidebar";

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function SettingsPage() {
  const { user } = useAuth();
  const [active, setActive] = useState("profile");

  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);

  const handleSelect = (id: string) => {
    setActive(id);
  };

  const renderSection = () => {
    switch (active) {
      case "profile":
        return <ProfileSection />;
      case "account":
        return <AccountSection />;
      case "preferences":
        return <PreferencesSection />;
      case "security":
        return <SecuritySection />;
      case "danger":
        return <DangerZoneSection />;
      default:
        return <ProfileSection />;
    }
  };

  // Small crossfade whenever the active section changes (also plays once on
  // first mount, a touch bigger, for a gentle page entrance).
  useEffect(() => {
    const el = contentRef.current;
    if (!el || prefersReducedMotion()) {
      isFirstRun.current = false;
      return;
    }

    const tween: gsap.core.Tween = gsap.fromTo(
      el,
      { opacity: 0, y: isFirstRun.current ? 14 : 8 },
      {
        opacity: 1,
        y: 0,
        duration: isFirstRun.current ? 0.5 : 0.3,
        ease: "power2.out",
      },
    );
    isFirstRun.current = false;

    return () => {
      tween.kill();
    };
  }, [active]);

  const displayName = user?.user_metadata?.full_name ?? "Student";
  const email = user?.email ?? "";
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0]?.toUpperCase())
      .join("") || "U";

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/dashboard"
          className="font-medium transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">Profile & Settings</span>
      </div>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Profile & Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account, learning preferences, and security.
        </p>
      </div>

      {/* Mobile nav — sticky so it stays reachable while scrolling a long section */}
      <div className="sticky top-0 z-20 -mx-4 border-b border-border/60 bg-background/85 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 lg:hidden">
        <SettingsMobileNav active={active} onSelect={handleSelect} />
      </div>

      {/* Desktop layout */}
      <div className="grid gap-6 lg:grid-cols-4 lg:items-start">
        {/* Sticky sidebar with a compact profile snapshot */}
        <div className="hidden lg:col-span-1 lg:block">
          <div className="sticky top-6 space-y-4">
            <Card className="overflow-hidden border-border/60 py-0">
              <div className="flex items-center gap-3 border-b border-border/60 bg-muted/30 p-4">
                <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={displayName}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {displayName}
                  </p>
                  {email && (
                    <p className="truncate text-xs text-muted-foreground">
                      {email}
                    </p>
                  )}
                </div>
              </div>
              <div className="p-3">
                <SettingsSidebar active={active} onSelect={handleSelect} />
              </div>
            </Card>
          </div>
        </div>

        {/* Active settings section */}
        <div ref={contentRef} className="space-y-6 lg:col-span-3">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
