"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Loader2,
  Lock,
  Mail,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth";
import { createClient } from "@/lib/supabase/client";
import { profileService } from "@/services/profile";
import { AuthShell, type AuthPanelItem } from "@/components/auth/auth-shell";
import {
  AuthDivider,
  AuthField,
  GoogleButton,
} from "@/components/auth/auth-field";
import { Button } from "@/components/ui/button";
import { PEXELS } from "@/lib/pexels";

const PANEL_ITEMS: AuthPanelItem[] = [
  {
    icon: BookOpen,
    title: "Pick up where you left off",
    text: "Your next lesson is waiting on your dashboard.",
  },
  {
    icon: ClipboardCheck,
    title: "Review your quiz results",
    text: "See how you did and which questions to revisit.",
  },
  {
    icon: TrendingUp,
    title: "Keep your progress moving",
    text: "Streaks, weekly goals and completed topics in one view.",
  },
];

type LoginErrors = { email?: string; password?: string };

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors: LoginErrors = {};
    if (!email.trim()) nextErrors.email = "Email is required";
    if (!password.trim()) nextErrors.password = "Password is required";
    setErrors(nextErrors);

    // Validation problems show inline under the field (no duplicate toast).
    if (nextErrors.email) {
      emailRef.current?.focus();
      return;
    }

    if (nextErrors.password) {
      passwordRef.current?.focus();
      return;
    }
    setLoading(true);

    try {
      const { error } = await authService.login(email, password);

      if (error) {
        throw error;
      }

      toast.success("Logged in successfully!");

      const profile = await profileService.getCurrentProfile();

      if (!profile) {
        throw new Error("Profile not found.");
      }

      if (profile.role === "admin" || profile.role === "super_admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.warning("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await authService.signInWithGoogle();

    if (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/dashboard");
      }
    };

    checkUser();
  }, [router]);

  return (
    <AuthShell
      title="Welcome back"
      subtitle={
        <>
          New to Delyte Academy?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Create a free account
          </Link>
        </>
      }
      panelHeading="Every practice test brings you closer."
      panelText="Pick up where you left off, revisit your results and keep your learning on track."
      panelItems={PANEL_ITEMS}
      image={PEXELS.login}
    >
      <GoogleButton onClick={handleGoogleLogin} />
      <AuthDivider>or sign in with email</AuthDivider>

      <form onSubmit={handleLogin} className="space-y-5" noValidate>
        <AuthField
          label="Email address"
          icon={Mail}
          type="email"
          autoComplete="email"
          ref={emailRef}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
          placeholder="you@example.com"
        />
        <AuthField
          label="Password"
          icon={Lock}
          labelAction={
            <Link
              href="/forgot-password"
              className="rounded text-[13px] font-semibold text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/40"
            >
              Forgot password?
            </Link>
          }
          revealable
          type="password"
          autoComplete="current-password"
          ref={passwordRef}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
          placeholder="••••••••"
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
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight aria-hidden />
            </>
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        By signing in, you agree to our{" "}
        <Link href="/terms-of-service" className="underline underline-offset-4 hover:text-foreground">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy" className="underline underline-offset-4 hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthShell>
  );
}
