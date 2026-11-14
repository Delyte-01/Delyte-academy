"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, KeyRound, Loader2, Mail, MailCheck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/auth";
import { AuthShell, type AuthPanelItem } from "@/components/auth/auth-shell";
import { AuthField } from "@/components/auth/auth-field";
import { Button } from "@/components/ui/button";
import { PEXELS } from "@/lib/pexels";

const PANEL_ITEMS: AuthPanelItem[] = [
  { icon: Mail, title: "Link sent to your email", text: "" },
  { icon: KeyRound, title: "Choose a new password", text: "" },
  { icon: ShieldCheck, title: "Back to studying in minutes", text: "" },
];

const RESEND_SECONDS = 60;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const emailRef = useRef<HTMLInputElement>(null);

  // Resend countdown, so the button can't be hammered.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) {
      setError("Email is required");
      emailRef.current?.focus();
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setError("Enter a valid email address");
      emailRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await authService.requestPasswordReset(value);
      if (resetError) throw resetError;
      setSentTo(value);
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={sentTo ? "Check your email" : "Forgot your password?"}
      subtitle={
        sentTo ? (
          <>
            If an account exists for <strong className="text-foreground">{sentTo}</strong>,
            we’ve sent a link to reset your password.
          </>
        ) : (
          "Enter your email and we’ll send you a link to set a new one."
        )
      }
      panelHeading="Locked out? It happens to everyone."
      panelText="Reset your password in a minute and pick up your studies right where you left off."
      panelItems={PANEL_ITEMS}
      image={PEXELS.login}
    >
      {sentTo ? (
        <div className="space-y-5">
          <div className="flex items-start gap-3.5 rounded-2xl border bg-primary-soft p-4 text-primary-soft-foreground">
            <MailCheck className="mt-0.5 size-5 shrink-0" aria-hidden />
            <p className="text-sm leading-relaxed">
              The link can take a minute to arrive. Check your spam or junk folder
              if you don’t see it.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            disabled={cooldown > 0 || loading}
            onClick={() => {
              setSentTo(null);
            }}
          >
            {cooldown > 0 ? `Send again in ${cooldown}s` : "Use a different email or resend"}
          </Button>

          <Button asChild variant="brand" size="lg" className="w-full">
            <Link href="/login">
              Back to sign in
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <AuthField
            label="Email address"
            icon={Mail}
            type="email"
            autoComplete="email"
            ref={emailRef}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(undefined);
            }}
            error={error}
            placeholder="you@example.com"
          />

          <Button
            type="submit"
            size="lg"
            variant="brand"
            disabled={loading || cooldown > 0}
            aria-busy={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Sending…
              </>
            ) : (
              <>
                Send reset link
                <ArrowRight aria-hidden />
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Remembered it?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
