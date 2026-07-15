"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, Info, ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { StatusSelector, type CourseStatus } from "./statusSelector";
import { ImageUploader } from "./imageUploader";
import { SettingsCard } from "./settingsCard";

export interface CourseFormData {
  title: string;
  code: string;
  description: string;
  status: CourseStatus;
  banner: string;
  thumbnail: string;
  bannerFile?: File;
  thumbnailFile?: File;
  allowDownloads: boolean;
  allowPracticeBeforeTopics: boolean;
  showOnHomepage: boolean;
  enableCertificates: boolean;
}

export interface CourseFormErrors {
  title?: string;
  code?: string;
  description?: string;
  status?: string;
}

interface SettingsToggle {
  key: string;
  label: string;
  description: string;
  icon: typeof CheckCircle2;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface CourseFormProps {
  data: CourseFormData;
  errors: CourseFormErrors;
  onChange: <K extends keyof CourseFormData>(
    field: K,
    value: CourseFormData[K]
  ) => void;
  children?: React.ReactNode;
}

const MAX_DESCRIPTION_LENGTH = 500;

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: typeof CheckCircle2;
  children: React.ReactNode;
}) {
  return (
    <CardTitle className="flex items-center gap-2.5 text-base font-bold">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-3.5 w-3.5" />
      </span>
      {children}
    </CardTitle>
  );
}

export function CourseForm({
  data,
  errors,
  onChange,
  children,
}: CourseFormProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(
      rootRef.current?.querySelectorAll("[data-form-section]") ?? []
    );
    gsap.fromTo(
      sections,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" }
    );
  }, []);

  const settings: SettingsToggle[] = [
    {
      key: "allowDownloads",
      label: "Allow Students to Download Resources",
      description: "Students can download PDF materials for offline study",
      icon: CheckCircle2,
      checked: data.allowDownloads,
      onChange: (v) => onChange("allowDownloads", v),
    },
    {
      key: "allowPracticeBeforeTopics",
      label: "Allow Practice Before Completing Topics",
      description:
        "Students can take practice tests without finishing topics first",
      icon: CheckCircle2,
      checked: data.allowPracticeBeforeTopics,
      onChange: (v) => onChange("allowPracticeBeforeTopics", v),
    },
    {
      key: "showOnHomepage",
      label: "Show Course on Homepage",
      description: "Display this course on the public homepage for discovery",
      icon: CheckCircle2,
      checked: data.showOnHomepage,
      onChange: (v) => onChange("showOnHomepage", v),
    },
    {
      key: "enableCertificates",
      label: "Enable Course Certificates",
      description: "Award certificates to students upon completion",
      icon: CheckCircle2,
      checked: data.enableCertificates,
      onChange: (v) => onChange("enableCertificates", v),
    },
  ];

  const descriptionPct = Math.min(
    100,
    Math.round((data.description.length / MAX_DESCRIPTION_LENGTH) * 100)
  );

  return (
    <div ref={rootRef} className="space-y-6">
      {/* Course Information */}
      <Card
        data-form-section
        className="border-border/60 transition-colors focus-within:border-primary/30"
      >
        <CardHeader className="pb-4">
          <SectionTitle icon={Info}>Course Information</SectionTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Course Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => onChange("title", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, title: true }))}
              placeholder="Introduction to Computer Science"
              className={cn(
                "transition-shadow dark:text-white/80",
                touched.title &&
                  errors.title &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            {touched.title && errors.title && (
              <p className="flex items-center gap-1.5 text-xs text-destructive duration-200 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-3 w-3" />
                {errors.title}
              </p>
            )}
            {touched.title && !errors.title && data.title && (
              <p className="flex items-center gap-1.5 text-xs text-emerald-600 duration-200 animate-in fade-in slide-in-from-top-1">
                <CheckCircle2 className="h-3 w-3" />
                Looks good
              </p>
            )}
          </div>

          {/* Code */}
          <div className="space-y-2">
            <Label htmlFor="code">
              Course Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="code"
              value={data.code}
              onChange={(e) => onChange("code", e.target.value.toUpperCase())}
              onBlur={() => setTouched((t) => ({ ...t, code: true }))}
              placeholder="CSC101"
              className={cn(
                "font-mono transition-shadow dark:text-white/80",
                touched.code &&
                  errors.code &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            {touched.code && errors.code && (
              <p className="flex items-center gap-1.5 text-xs text-destructive duration-200 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-3 w-3" />
                {errors.code}
              </p>
            )}
            {touched.code && !errors.code && data.code && (
              <p className="flex items-center gap-1.5 text-xs text-emerald-600 duration-200 animate-in fade-in slide-in-from-top-1">
                <CheckCircle2 className="h-3 w-3" />
                Valid course code
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">
                Course Description <span className="text-destructive">*</span>
              </Label>
              <span
                className={cn(
                  "text-xs tabular-nums",
                  data.description.length > MAX_DESCRIPTION_LENGTH - 50
                    ? "font-medium text-amber-600"
                    : "text-muted-foreground"
                )}
              >
                {data.description.length} / {MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => {
                if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                  onChange("description", e.target.value);
                }
              }}
              onBlur={() => setTouched((t) => ({ ...t, description: true }))}
              placeholder="Provide a brief description of what students will learn in this course..."
              rows={4}
              className={cn(
                "resize-none transition-shadow",
                touched.description &&
                  errors.description &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-[width,background-color] duration-300",
                  descriptionPct >= 100
                    ? "bg-destructive"
                    : descriptionPct > 80
                    ? "bg-amber-500"
                    : "bg-gradient-to-r from-primary to-indigo-500"
                )}
                style={{ width: `${descriptionPct}%` }}
              />
            </div>
            {touched.description && errors.description && (
              <p className="flex items-center gap-1.5 text-xs text-destructive duration-200 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-3 w-3" />
                {errors.description}
              </p>
            )}
            {touched.description && !errors.description && data.description && (
              <p className="flex items-center gap-1.5 text-xs text-emerald-600 duration-200 animate-in fade-in slide-in-from-top-1">
                <CheckCircle2 className="h-3 w-3" />
                Description looks good
              </p>
            )}
          </div>

          {/* Status */}
          <StatusSelector
            value={data.status}
            onChange={(v) => onChange("status", v)}
          />
          {errors.status && (
            <p className="flex items-center gap-1.5 text-xs text-destructive duration-200 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-3 w-3" />
              {errors.status}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Banner */}
      <Card data-form-section className="border-border/60">
        <CardHeader className="pb-4">
          <SectionTitle icon={ImageIcon}>Course Banner</SectionTitle>
        </CardHeader>
        <CardContent>
          <ImageUploader
            label="Banner Image"
            description="PNG, JPG up to 5MB"
            recommendedSize="1200 x 600"
            value={data.banner}
            onChange={(file, preview) => {
              onChange("banner", preview);
              onChange("bannerFile", file ?? undefined);
            }}
            aspect="banner"
          />
        </CardContent>
      </Card>

      {/* Thumbnail */}
      <Card data-form-section className="border-border/60">
        <CardHeader className="pb-4">
          <SectionTitle icon={ImageIcon}>Course Thumbnail</SectionTitle>
        </CardHeader>
        <CardContent>
          <ImageUploader
            label="Thumbnail Image"
            description="Used for course cards"
            recommendedSize="400 x 400"
            value={data.thumbnail}
            onChange={(file, preview) => {
              console.log("Preview:", preview);
              onChange("thumbnail", preview);
              onChange("thumbnailFile", file ?? undefined);
            }}
            aspect="thumbnail"
          />
        </CardContent>
      </Card>

      {/* Settings */}
      <div data-form-section>
        <SettingsCard settings={settings} />
      </div>

      {children}
    </div>
  );
}
