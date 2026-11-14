"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import type { Profile } from "@/types/profile";

export function WelcomeHeader({ profile }: { profile: Profile | null }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const name =
    profile?.full_name?.split(" ")[0] ?? profile?.email?.split("@")[0] ?? "there";

  return (
    <PageHeader
      eyebrow={profile?.role === "super_admin" ? "Super admin" : "Admin"}
      title={`Welcome back, ${name}`}
      description={today}
      actions={
        <Button variant="brand" asChild>
          <Link href="/admin/courses/create">
            <Plus aria-hidden />
            Create course
          </Link>
        </Button>
      }
    />
  );
}
