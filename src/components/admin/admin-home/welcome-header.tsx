"use client";

import { Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminProfile } from "@/hooks/useAdminProfile";
import { useRouter } from "next/navigation";

export function WelcomeHeader() {
  const router = useRouter();
  const { profile } = useAdminProfile();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const displayName =
    profile?.full_name?.split(" ")[0] ??
    profile?.email?.split("@")[0] ??
    "Admin";

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {" "}
      <div>
        {" "}
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Welcome back, {displayName}{" "}
        </h1>{" "}
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          {" "}
          <Calendar className="h-3.5 w-3.5" />
          {today}{" "}
        </p>{" "}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Input
            placeholder="Search courses, students..."
            className="h-10 w-64 bg-muted"
          />
        </div>

        <Button
          className="flex-shrink-0"
          onClick={() => router.push("/admin/courses/new")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </div>
    </div>
  );
}
