"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Settings,
  Monitor,
  Sun,
  Moon,
  Play,
  Sigma,
  Bell,
  Clock,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import gsap from "gsap";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfile } from "@/hooks/useProfile";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const themeOptions = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

const languages = [
  "English",
  "French",
  "Spanish",
  "Arabic",
  "Hausa",
  "Yoruba",
  "Igbo",
];

interface Preferences {
  theme: string;
  language: string;
  autoplay_videos: boolean;
  math_rendering: boolean;
  email_notifications: boolean;
  quiz_reminders: boolean;
}

const DEFAULT_PREFERENCES: Preferences = {
  theme: "system",
  language: "English",
  autoplay_videos: true,
  math_rendering: true,
  email_notifications: true,
  quiz_reminders: false,
};

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function PreferencesSection() {
  const { profile, saveProfile, saving } = useProfile();
  const { theme: currentTheme, setTheme } = useTheme();

  const [preferences, setPreferences] =
    useState<Preferences>(DEFAULT_PREFERENCES);
  const initialPreferencesRef = useRef<Preferences>(DEFAULT_PREFERENCES);

  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const themeRowRef = useRef<HTMLDivElement>(null);
  const themeIndicatorRef = useRef<HTMLDivElement>(null);
  const themeButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const isFirstThemeRun = useRef(true);

  // Load saved preferences, and keep next-themes' active theme in sync with
  // whatever was persisted — previously the two could drift apart on first
  // load (this component only compared against next-themes' own state).
  useEffect(() => {
    if (!profile) return;

    const next: Preferences = {
      theme: profile.theme ?? "system",
      language: profile.language ?? "English",
      autoplay_videos: profile.autoplay_videos ?? true,
      math_rendering: profile.math_rendering ?? true,
      email_notifications: profile.email_notifications ?? true,
      quiz_reminders: profile.quiz_reminders ?? false,
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreferences(next);
    initialPreferencesRef.current = next;

    if (next.theme && next.theme !== currentTheme) {
      setTheme(next.theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  // Card + section entrance, once.
  useEffect(() => {
    if (!cardRef.current || prefersReducedMotion()) return;

    const ctx: gsap.Context = gsap.context(() => {
      const tl: gsap.core.Timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      tl.from(cardRef.current, { opacity: 0, y: 14, duration: 0.4 });

      const items = contentRef.current?.querySelectorAll<HTMLElement>(
        "[data-animate-item]",
      );
      if (items?.length) {
        tl.from(
          items,
          { opacity: 0, y: 10, duration: 0.32, stagger: 0.05 },
          "-=0.2",
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Sliding highlight behind the active theme button.
  useEffect(() => {
    const row = themeRowRef.current;
    const indicator = themeIndicatorRef.current;
    const activeButton = themeButtonRefs.current.get(preferences.theme);
    if (!row || !indicator || !activeButton) return;

    const rowRect = row.getBoundingClientRect();
    const btnRect = activeButton.getBoundingClientRect();
    const position = {
      top: btnRect.top - rowRect.top,
      left: btnRect.left - rowRect.left,
      width: btnRect.width,
      height: btnRect.height,
    };

    const animate = !isFirstThemeRun.current && !prefersReducedMotion();
    isFirstThemeRun.current = false;

    if (animate) {
      gsap.to(indicator, { ...position, duration: 0.3, ease: "power3.out" });
    } else {
      gsap.set(indicator, { ...position, opacity: 1 });
    }
  }, [preferences.theme]);

  const isDirty = useMemo(() => {
    const initial = initialPreferencesRef.current;
    return (Object.keys(preferences) as (keyof Preferences)[]).some(
      // eslint-disable-next-line react-hooks/refs
      (key) => preferences[key] !== initial[key],
    );
  }, [preferences]);

  const handleThemeSelect = (value: string) => {
    setTheme(value);
    setPreferences((prev) => ({ ...prev, theme: value }));
  };

  const handleCancel = () => {
    const initial = initialPreferencesRef.current;
    setPreferences(initial);
    if (initial.theme !== currentTheme) {
      setTheme(initial.theme);
    }
  };

  const handleSave = async () => {
    try {
      await saveProfile(preferences);
      initialPreferencesRef.current = preferences;
      toast.success("Preferences saved.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save preferences.");
    }
  };

  return (
    <Card
      id="preferences"
      ref={cardRef}
      className="scroll-mt-6 border-border/60"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <Settings className="h-5 w-5 text-primary" />
          Learning Preferences
        </CardTitle>
        <CardDescription>
          Customize your learning experience and notification settings.
        </CardDescription>
      </CardHeader>
      <CardContent ref={contentRef} className="space-y-6">
        {/* Theme selector */}
        <div className="space-y-3" data-animate-item>
          <Label className="text-sm font-semibold">Theme</Label>
          <div
            ref={themeRowRef}
            className="relative grid grid-cols-3 gap-2 sm:gap-3"
          >
            <div
              ref={themeIndicatorRef}
              aria-hidden="true"
              className="pointer-events-none absolute z-0 rounded-2xl border-2 border-emerald-500 bg-emerald-500/10 opacity-0 shadow-sm"
              style={{ top: 0, left: 0, width: 0, height: 0 }}
            />
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = preferences.theme === opt.value;

              return (
                <button
                  key={opt.value}
                  ref={(el) => {
                    if (el) themeButtonRefs.current.set(opt.value, el);
                    else themeButtonRefs.current.delete(opt.value);
                  }}
                  type="button"
                  onClick={() => handleThemeSelect(opt.value)}
                  aria-pressed={isActive}
                  className={cn(
                    "relative z-10 flex flex-col items-center gap-2 rounded-2xl border-2 border-transparent p-3.5 transition-colors duration-200 sm:p-4",
                    !isActive && "hover:bg-muted/30",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          <ToggleRow
            icon={Play}
            iconColor="text-blue-600"
            iconBg="bg-blue-500/10"
            title="Autoplay Videos"
            description="Automatically play topic videos when you open a lesson."
            checked={preferences.autoplay_videos}
            onChange={(value) =>
              setPreferences((prev) => ({ ...prev, autoplay_videos: value }))
            }
          />
          <ToggleRow
            icon={Sigma}
            iconColor="text-violet-600"
            iconBg="bg-violet-500/10"
            title="Mathematical Notation Rendering"
            description="Render LaTeX math formulas in lessons and quizzes."
            checked={preferences.math_rendering}
            onChange={(value) =>
              setPreferences((prev) => ({ ...prev, math_rendering: value }))
            }
          />
          <ToggleRow
            icon={Bell}
            iconColor="text-amber-600"
            iconBg="bg-amber-500/10"
            title="Email Notifications"
            description="Receive course updates and announcements via email."
            checked={preferences.email_notifications}
            onChange={(value) =>
              setPreferences((prev) => ({
                ...prev,
                email_notifications: value,
              }))
            }
          />
          <ToggleRow
            icon={Clock}
            iconColor="text-rose-600"
            iconBg="bg-rose-500/10"
            title="Quiz Reminder Notifications"
            description="Get reminded about pending and upcoming quizzes."
            checked={preferences.quiz_reminders}
            onChange={(value) =>
              setPreferences((prev) => ({ ...prev, quiz_reminders: value }))
            }
          />
        </div>

        {/* Language */}
        <div className="space-y-2" data-animate-item>
          <Label htmlFor="language">Preferred Language</Label>
          <Select
            value={preferences.language}
            onValueChange={(value) =>
              setPreferences((prev) => ({ ...prev, language: value }))
            }
          >
            <SelectTrigger id="language" className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Used for interface text and email communications.
          </p>
        </div>

        <div
          className="flex flex-col-reverse gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-end"
          data-animate-item
        >
          {isDirty && (
            <span className="mr-auto hidden text-xs text-muted-foreground sm:inline">
              You have unsaved changes
            </span>
          )}
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={!isDirty || saving}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            disabled={saving || !isDirty}
            onClick={handleSave}
            className="w-full transition-transform duration-150 active:scale-95 sm:w-auto"
          >
            {saving ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ToggleRowProps {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function ToggleRow({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  description,
  checked,
  onChange,
}: ToggleRowProps) {
  return (
    <div
      data-animate-item
      className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 p-3.5 transition-colors duration-200 hover:bg-muted/30 sm:p-4"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10",
            iconBg,
          )}
        >
          <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", iconColor)} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="flex-shrink-0"
      />
    </div>
  );
}
