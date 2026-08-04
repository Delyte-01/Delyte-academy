"use client";

import { useEffect, useRef, useState } from "react";
import {
  Info,
  Mail,
  ShieldCheck,
  Calendar,
  Hash,
  KeyRound,
  Copy,
  Check,
} from "lucide-react";
import gsap from "gsap";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function AccountSection() {
  const { profile, user, loading } = useProfile();
  const [copied, setCopied] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading || !cardRef.current || prefersReducedMotion()) return;

    const ctx: gsap.Context = gsap.context(() => {
      const tl: gsap.core.Timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      tl.from(cardRef.current, { opacity: 0, y: 14, duration: 0.4 });

      if (contentRef.current?.children.length) {
        tl.from(
          contentRef.current.children,
          { opacity: 0, y: 10, duration: 0.35, stagger: 0.07 },
          "-=0.2",
        );
      }
    });

    return () => ctx.revert();
  }, [loading]);

  if (loading) {
    return (
      <Card id="account" className="scroll-mt-6 border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Info className="h-5 w-5 text-primary" />
            Account
          </CardTitle>
          <CardDescription>
            Your account details and connected services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[72px] animate-pulse rounded-2xl border border-border/60 bg-muted/40"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  const providers: string[] = user?.app_metadata?.providers ?? [];
  const isVerified = Boolean(user?.email_confirmed_at);
  const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";
  const memberSince = profile
    ? new Date(profile.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : "-";

  const handleCopyId = async () => {
    if (!user?.id) return;
    try {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      toast.success("Account ID copied to clipboard.");
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error(error);
      toast.error("Couldn't copy account ID.");
    }
  };

  return (
    <Card id="account" ref={cardRef} className="scroll-mt-6 border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <Info className="h-5 w-5 text-primary" />
          Account
        </CardTitle>
        <CardDescription>
          Your account details and connected services.
        </CardDescription>
      </CardHeader>
      <CardContent ref={contentRef} className="space-y-4">
        {/* Email verification */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
                isVerified ? "bg-emerald-500/10" : "bg-amber-500/10",
              )}
            >
              <Mail
                className={cn(
                  "h-5 w-5",
                  isVerified ? "text-emerald-600" : "text-amber-600",
                )}
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Email Address
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email ?? profile?.email ?? "-"}
              </p>
            </div>
          </div>

          <Badge
            className={cn(
              "w-fit flex-shrink-0 border-0",
              isVerified
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                : "bg-amber-500/15 text-amber-700 dark:text-amber-400",
            )}
          >
            <ShieldCheck className="mr-1 h-3 w-3" />
            {isVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>

        {/* Connected providers */}
        <div className="rounded-2xl border border-border/60 p-4">
          <p className="mb-3 text-sm font-semibold text-foreground">
            Connected Login Providers
          </p>
          {providers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No linked providers — you sign in with email & password.
            </p>
          ) : (
            <div className="space-y-2">
              {providers.map((provider) => (
                <div
                  key={provider}
                  className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <KeyRound className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium capitalize text-foreground">
                        {provider}
                      </p>
                      <p className="text-xs text-muted-foreground">Connected</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="flex-shrink-0 text-xs">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account metadata */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl border border-border/60 p-4">
            <Hash className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Account ID</p>
              <p className="truncate text-sm font-semibold text-foreground">
                {user?.id
                  ? `${user.id.slice(0, 8)}...${user.id.slice(-4)}`
                  : "-"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              onClick={handleCopyId}
              disabled={!user?.id}
              aria-label="Copy account ID"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border/60 p-4">
            <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Member Since</p>
              <p className="text-sm font-semibold text-foreground">
                {memberSince}
              </p>
            </div>
          </div>
        </div>

        {/* Account status */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {isAdmin ? "Administrator Account" : "Student Account"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isAdmin
                  ? "This account has administrative privileges"
                  : "Your account is in good standing"}
              </p>
            </div>
          </div>
          <Badge className="w-fit flex-shrink-0 border-0 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
            Active
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
