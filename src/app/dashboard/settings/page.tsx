"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

import { EASE, gsap, prefersReducedMotion } from "@/lib/gsap";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/hooks/useAuth";
import { ProfileSection } from "@/components/dashboard-components/settings-oomponents/profile-section";
import { AccountSection } from "@/components/dashboard-components/settings-oomponents/account-selection";
import { PreferencesSection } from "@/components/dashboard-components/settings-oomponents/preference-section";
import { SecuritySection } from "@/components/dashboard-components/settings-oomponents/security-section";
import { DangerZoneSection } from "@/components/dashboard-components/settings-oomponents/danger-zone";
import {
  SETTINGS_NAV,
  SettingsSidebar,
  SettingsMobileNav,
} from "@/components/dashboard-components/settings-oomponents/settings-sidebar";

const VALID_IDS = SETTINGS_NAV.map((item) => item.id);

export default function SettingsPage() {
  const { user } = useAuth();
  const [active, setActive] = useState("profile");

  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);

  // Deep links: /dashboard/settings#security opens that section.
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (VALID_IDS.includes(id)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(id);
    }
  }, []);

  const handleSelect = (id: string) => {
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const renderSection = () => {
    switch (active) {
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

  // Short crossfade when the section changes (a touch longer on first load).
  useEffect(() => {
    const el = contentRef.current;
    if (!el || prefersReducedMotion()) {
      isFirstRun.current = false;
      return;
    }
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: isFirstRun.current ? 14 : 8 },
      {
        opacity: 1,
        y: 0,
        duration: isFirstRun.current ? 0.5 : 0.3,
        ease: EASE.out,
        clearProps: "opacity,transform",
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
      <PageHeader
        breadcrumb={
          <span className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="font-semibold transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <ChevronRight className="size-3.5" aria-hidden />
            <span className="font-semibold text-foreground">Settings</span>
          </span>
        }
        title="Profile & settings"
        description="Manage your account, learning preferences and security."
      />

      {/* Mobile: sticky section tabs, below the 64px app header */}
      <div className="sticky top-16 z-10 -mx-4 border-b bg-background/85 px-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:hidden">
        <SettingsMobileNav active={active} onSelect={handleSelect} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr] lg:items-start">
        {/* Desktop: sticky rail with a profile snapshot */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <Card className="overflow-hidden py-0">
              <div className="flex items-center gap-3 border-b bg-muted/40 p-4">
                <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">
                    {displayName}
                  </p>
                  {email && (
                    <p className="truncate text-xs text-muted-foreground">{email}</p>
                  )}
                </div>
              </div>
              <div className="p-3">
                <SettingsSidebar active={active} onSelect={handleSelect} />
              </div>
            </Card>
          </div>
        </div>

        <div ref={contentRef} className="min-w-0 space-y-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
