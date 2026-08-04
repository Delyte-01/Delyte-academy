"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Shield,
  KeyRound,
  Monitor,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import gsap from "gsap";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSecurity } from "@/hooks/useSecurity";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface PasswordStrength {
  segments: number;
  label: string;
  bar: string;
  text: string;
}

const STRENGTH_META: PasswordStrength[] = [
  { segments: 0, label: "Weak", bar: "bg-rose-500", text: "text-rose-600" },
  { segments: 1, label: "Weak", bar: "bg-rose-500", text: "text-rose-600" },
  { segments: 2, label: "Fair", bar: "bg-amber-500", text: "text-amber-600" },
  { segments: 3, label: "Good", bar: "bg-blue-500", text: "text-blue-600" },
  {
    segments: 4,
    label: "Strong",
    bar: "bg-emerald-500",
    text: "text-emerald-600",
  },
];

function getPasswordStrength(pw: string): PasswordStrength {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  return STRENGTH_META[Math.min(score, 4)];
}

export function SecuritySection() {
  const { session, changePassword, signOutAllDevices } = useSecurity();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || prefersReducedMotion()) return;

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
  }, []);

  const isGoogleUser = Boolean(
    session?.user?.app_metadata?.providers?.includes("google"),
  );

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordsMatch =
    confirmPassword.length === 0 || password === confirmPassword;
  const canSubmit =
    !isGoogleUser &&
    !saving &&
    password.length >= 8 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const handleChangePassword = async () => {
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setSaving(true);
      await changePassword(password);
      setPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update password. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOutAll = async () => {
    try {
      setSigningOut(true);
      await signOutAllDevices();
      toast.success("Signed out of all other devices.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign out of other devices.");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <Card id="security" ref={cardRef} className="scroll-mt-6 border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <Shield className="h-5 w-5 text-primary" />
          Security
        </CardTitle>
        <CardDescription>
          Manage your password and account security settings.
        </CardDescription>
      </CardHeader>
      <CardContent ref={contentRef} className="space-y-6">
        {/* Change password */}
        <div className="space-y-3 rounded-2xl border border-border/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <KeyRound className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Password</p>
              <p className="text-xs text-muted-foreground">
                Update your account password
              </p>
            </div>
          </div>

          {isGoogleUser && (
            <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              You are signed in with Google. Password management is handled by
              Google.
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter a new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isGoogleUser}
                className="pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((s) => !s)}
                disabled={isGoogleUser}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {password.length > 0 && !isGoogleUser && (
              <div className="space-y-1.5 pt-0.5">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors duration-300",
                        i < strength.segments ? strength.bar : "bg-muted",
                      )}
                    />
                  ))}
                </div>
                <p className={cn("text-xs font-medium", strength.text)}>
                  {strength.label}
                  {password.length < 8 && " — needs at least 8 characters"}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter the new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isGoogleUser}
                className="pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm((s) => !s)}
                disabled={isGoogleUser}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {!passwordsMatch && (
              <p className="text-xs text-rose-600">Passwords do not match.</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleChangePassword}
              disabled={!canSubmit}
              className="w-full transition-transform duration-150 active:scale-95 sm:w-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </div>
        </div>

        {/* 2FA */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
              <Lock className="h-5 w-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Two-Factor Authentication
              </p>
              <p className="text-xs text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="w-fit flex-shrink-0 border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400"
          >
            Coming Soon
          </Badge>
        </div>

        <Separator />

        {/* Recent sign-in activity */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">
            Current Session
          </p>

          <div className="flex flex-col gap-3 rounded-xl border border-border/60 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                <Monitor className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Current Browser Session
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  Logged in as {session?.user?.email ?? "-"}
                </p>
              </div>
            </div>

            <Badge variant="outline" className="w-fit flex-shrink-0 text-xs">
              Current
            </Badge>
          </div>
        </div>

        {/* Sign out all devices */}
        <div className="flex flex-col gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-rose-500/10">
              <LogOut className="h-5 w-5 text-rose-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Sign Out of All Devices
              </p>
              <p className="text-xs text-muted-foreground">
                This will sign you out everywhere except this browser.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            disabled={signingOut}
            className="w-full flex-shrink-0 border-rose-500/30 text-rose-600 hover:bg-rose-500/10 hover:text-rose-600 sm:w-auto"
            onClick={handleSignOutAll}
          >
            {signingOut ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Signing out...
              </>
            ) : (
              "Sign Out All"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
