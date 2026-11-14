"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, KeyRound, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, type AuthPanelItem } from "@/components/auth/auth-shell";
import { AuthField, PasswordStrength } from "@/components/auth/auth-field";
import { Button } from "@/components/ui/button";
import { PEXELS } from "@/lib/pexels";

const PANEL_ITEMS: AuthPanelItem[] = [
  { icon: KeyRound, title: "Pick a strong password", text: "" },
  { icon: ShieldCheck, title: "Your progress stays safe", text: "" },
];

type Errors = { password?: string; confirm?: string };

export default function ResetPasswordPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  // The emailed link signs the user in briefly (via /auth/callback). No session
  // means the link is missing, expired or already used.
  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => setHasSession(Boolean(user)))
      .finally(() => setChecking(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: Errors = {};
    if (password.length < 8) next.password = "Password must be at least 8 characters";
    if (password !== confirm) next.confirm = "Passwords do not match";
    setErrors(next);
    if (next.password) return passwordRef.current?.focus();
    if (next.confirm) return confirmRef.current?.focus();

    setLoading(true);
    try {
      const { error } = await authService.updatePassword(password);
      if (error) throw error;
      await authService.logout();
      toast.success("Password updated. Please sign in with your new password.");
      router.replace("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  const invalidLink = !checking && !hasSession;

  return (
    <AuthShell
      title={invalidLink ? "This link has expired" : "Set a new password"}
      subtitle={
        invalidLink
          ? "Reset links work once and expire after a while. Request a fresh one."
          : "Choose a password you haven’t used before."
      }
      panelHeading="Almost back in."
      panelText="One new password and you’re back to your courses, quizzes and progress."
      panelItems={PANEL_ITEMS}
      image={PEXELS.login}
    >
      {checking ? (
        <div className="flex justify-center py-10" aria-busy>
          <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Checking link" />
        </div>
      ) : invalidLink ? (
        <div className="space-y-4">
          <Button asChild variant="brand" size="lg" className="w-full">
            <Link href="/forgot-password">
              Request a new link
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/login">Back to sign in</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <AuthField
            label="New password"
            icon={Lock}
            revealable
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            ref={passwordRef}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
            }}
            error={errors.password}
            hint={<PasswordStrength password={password} />}
          />
          <AuthField
            label="Confirm new password"
            icon={Lock}
            revealable
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            ref={confirmRef}
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              if (errors.confirm) setErrors((p) => ({ ...p, confirm: undefined }));
            }}
            error={errors.confirm}
            hint={
              confirm && confirm === password ? (
                <span className="inline-flex items-center gap-1.5 text-success">
                  <Check className="size-3.5" aria-hidden />
                  Passwords match
                </span>
              ) : undefined
            }
          />

          <Button
            type="submit"
            size="lg"
            variant="brand"
            disabled={loading}
            aria-busy={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Updating…
              </>
            ) : (
              <>
                Update password
                <ArrowRight aria-hidden />
              </>
            )}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
