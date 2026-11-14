"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  ClipboardCheck,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  TrendingUp,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { EmailVerificationModal } from "@/components/modals/email-verification";
import { AuthShell, type AuthPanelItem } from "@/components/auth/auth-shell";
import {
  AuthDivider,
  AuthField,
  GoogleButton,
  PasswordStrength,
} from "@/components/auth/auth-field";
import { Button } from "@/components/ui/button";
import { PEXELS } from "@/lib/pexels";

const PANEL_ITEMS: AuthPanelItem[] = [
  {
    icon: BookOpen,
    title: "Courses organized by topic",
    text: "Study lessons step by step at your own pace.",
  },
  {
    icon: ClipboardCheck,
    title: "CBT practice quizzes",
    text: "Timed attempts with instant, automatic results.",
  },
  {
    icon: TrendingUp,
    title: "Progress tracking",
    text: "See your scores and completed topics across every course.",
  },
  {
    icon: ShieldCheck,
    title: "Free to get started",
    text: "Create an account and begin learning today.",
  },
];

type SignupErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
};

export default function SignupPage() {
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const router = useRouter();

  // ------------ form states ---------------------

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<SignupErrors>({});
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  const clearError = (key: keyof SignupErrors) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleGoogleLogin = async () => {
    const { error } = await authService.signInWithGoogle();

    if (error) {
      toast.error(error.message);
    }
  };

  // ----------Handle Sign up Functionality ---------------------------

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Same rules and toast messages as before; every failing field is now
    // also marked inline, and the first one receives focus.
    const nextErrors: SignupErrors = {};
    if (!firstName.trim()) nextErrors.firstName = "First name is required";
    if (!lastName.trim()) nextErrors.lastName = "Last name is required";
    if (!email.trim()) nextErrors.email = "Email is required";
    if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }
    if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }
    if (!acceptTerms) nextErrors.terms = "Please accept the Terms of Service";
    setErrors(nextErrors);

    const order: [keyof SignupErrors, React.RefObject<HTMLInputElement | null>][] = [
      ["firstName", firstNameRef],
      ["lastName", lastNameRef],
      ["email", emailRef],
      ["password", passwordRef],
      ["confirmPassword", confirmRef],
      ["terms", termsRef],
    ];
    for (const [key, ref] of order) {
      const message = nextErrors[key];
      if (message) {
        // Shown inline under the field; just move focus to it.
        ref.current?.focus();
        return;
      }
    }

    setLoading(true);
    try {
      const { error } = await authService.signup(
        email,
        password,
        firstName,
        lastName
      );

      if (error) {
        throw error;
      }
      toast.success(
        "Account created! Please check your email to verify your account."
      );
      setSignupEmail(email);
      setVerificationOpen(true);
      // Clear the form only once the account was actually created.
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAcceptTerms(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
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
    <>
      <AuthShell
        title="Create your account"
        subtitle={
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in here
            </Link>
          </>
        }
        panelHeading="Start your learning journey today."
        panelText="Turn practice into progress with courses, lessons and CBT quizzes in one place."
        panelItems={PANEL_ITEMS}
        image={PEXELS.signUp}
      >
        <GoogleButton onClick={handleGoogleLogin} />
        <AuthDivider>or sign up with email</AuthDivider>

        <form onSubmit={handleSignUp} className="space-y-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
            <AuthField
              label="First name"
              icon={User}
              autoComplete="given-name"
              placeholder="John"
              ref={firstNameRef}
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                clearError("firstName");
              }}
              error={errors.firstName}
            />
            <AuthField
              label="Last name"
              icon={User}
              autoComplete="family-name"
              placeholder="Doe"
              ref={lastNameRef}
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                clearError("lastName");
              }}
              error={errors.lastName}
            />
          </div>

          <AuthField
            label="Email address"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            ref={emailRef}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError("email");
            }}
            error={errors.email}
          />
          <AuthField
            label="Password"
            icon={Lock}
            revealable
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            ref={passwordRef}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearError("password");
            }}
            error={errors.password}
            hint={<PasswordStrength password={password} />}
          />
          <AuthField
            label="Confirm password"
            icon={Lock}
            revealable
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            ref={confirmRef}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearError("confirmPassword");
            }}
            error={errors.confirmPassword}
            hint={
              confirmPassword && confirmPassword === password ? (
                <span className="inline-flex items-center gap-1.5 text-success">
                  <Check className="size-3.5" aria-hidden />
                  Passwords match
                </span>
              ) : undefined
            }
          />

          <div>
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="terms"
                ref={termsRef}
                type="checkbox"
                checked={acceptTerms}
                aria-invalid={errors.terms ? true : undefined}
                aria-describedby={errors.terms ? "terms-error" : undefined}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  clearError("terms");
                }}
                className="mt-0.5 size-4 rounded border-input accent-primary outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
              />
              <label htmlFor="terms" className="text-sm leading-relaxed text-muted-foreground">
                I agree to the{" "}
                <Link
                  href="/terms-of-service"
                  className="font-semibold text-foreground underline underline-offset-4"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="font-semibold text-foreground underline underline-offset-4"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p
                id="terms-error"
                role="alert"
                className="mt-1.5 text-[13px] font-medium text-destructive"
              >
                {errors.terms}
              </p>
            )}
          </div>

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
                Creating account…
              </>
            ) : (
              <>
                Create account
                <ArrowRight aria-hidden />
              </>
            )}
          </Button>
        </form>
      </AuthShell>

      <EmailVerificationModal
        open={verificationOpen}
        onOpenChange={setVerificationOpen}
        email={signupEmail}
      />
    </>
  );
}
