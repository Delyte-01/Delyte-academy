"use client";

import {
  Camera,
  Mail,
  Phone,
  Globe,
  FileText,
  User,
  AtSign,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useMemo, useRef, useState } from "react";
import { uploadService } from "@/services/upload";
import { toast } from "sonner";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { useProfile } from "@/context/profile-context";

const countries = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United Kingdom",
  "United States",
  "Canada",
];

const BIO_MAX_LENGTH = 200;

interface ProfileForm {
  full_name: string;
  username: string;
  phone: string;
  country: string;
  bio: string;
}

const EMPTY_FORM: ProfileForm = {
  full_name: "",
  username: "",
  phone: "",
  country: "Nigeria",
  bio: "",
};

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ProfileSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { profile, loading, saving, saveProfile } = useProfile();

  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
  const initialFormRef = useRef<ProfileForm>(EMPTY_FORM);

  useEffect(() => {
    if (profile) {
      const newForm: ProfileForm = {
        full_name: profile.full_name ?? "",
        username: profile.username ?? "",
        phone: profile.phone ?? "",
        country: profile.country ?? "Nigeria",
        bio: profile.bio ?? "",
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(newForm);
      initialFormRef.current = newForm;
    }
  }, [profile]);

  // Entrance animation, once.
  useEffect(() => {
    if (!cardRef.current || prefersReducedMotion()) return;
    const tween: gsap.core.Tween = gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
    );
    return () => {
      tween.kill();
    };
  }, []);

  const isDirty = useMemo(
    () =>
      (Object.keys(form) as (keyof ProfileForm)[]).some(
        // eslint-disable-next-line react-hooks/refs
        (key) => form[key] !== initialFormRef.current[key],
      ),
    [form],
  );

  const bioCount = form.bio.length;
  const bioNearLimit = bioCount >= BIO_MAX_LENGTH - 20;

  const popAvatar = () => {
    if (!avatarRef.current || prefersReducedMotion()) return;
    gsap.fromTo(
      avatarRef.current,
      { scale: 0.85, opacity: 0.6 },
      { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.5)" },
    );
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file || !profile) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Maximum avatar size is 2MB.");
      return;
    }

    try {
      setUploadingAvatar(true);

      const imageUrl = await uploadService.uploadImage(
        file,
        "avatars",
        profile.id,
      );

      await saveProfile({
        avatar_url: imageUrl,
      });

      popAvatar();
      toast.success("Profile photo updated.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload profile photo.");
    } finally {
      setUploadingAvatar(false);
      event.target.value = "";
    }
  };

  const handleRemovePhoto = async () => {
    if (!profile?.avatar_url) return;

    try {
      await uploadService.deleteImage(profile.avatar_url, "avatars");
      await saveProfile({ avatar_url: null });
      popAvatar();
      toast.success("Profile photo removed.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove photo.");
    }
  };

  const handleCancel = () => {
    setForm(initialFormRef.current);
  };

  const handleSave = async () => {
    await saveProfile(form);
    initialFormRef.current = form;
    toast.success("Profile updated.");
  };

  return (
    <Card id="profile" ref={cardRef} className="scroll-mt-6 border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <User className="h-5 w-5 text-primary" />
          Profile
        </CardTitle>
        <CardDescription>
          Update your personal information and how others see you on the
          platform.
        </CardDescription>
      </CardHeader>
      <CardContent
        className={cn(
          "space-y-6 transition-opacity duration-300",
          loading && "pointer-events-none animate-pulse opacity-60",
        )}
      >
        {/* Avatar */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
          <div className="relative flex-shrink-0">
            <div ref={avatarRef}>
              <Avatar className="h-20 w-20 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                <AvatarImage
                  src={profile?.avatar_url ?? undefined}
                  alt="Profile"
                />
                <AvatarFallback className="bg-primary text-xl font-bold text-primary-foreground">
                  {(profile?.full_name ?? "U")
                    .split(" ")
                    .filter(Boolean)
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {uploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70 backdrop-blur-sm">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              hidden
              onChange={handleAvatarUpload}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Profile Photo
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF. Max 2MB.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? "Uploading..." : "Change Photo"}
              </Button>
              {profile?.avatar_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-rose-600"
                  onClick={handleRemovePhoto}
                  disabled={uploadingAvatar}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="fullName"
                value={form.full_name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, full_name: e.target.value }))
                }
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="username"
                value={form.username}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, username: e.target.value }))
                }
                placeholder="Enter your username"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={profile?.email ?? ""}
                className="cursor-not-allowed pl-9"
                disabled
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Select
                value={form.country}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, country: value }))
                }
              >
                <SelectTrigger id="country" className="w-full pl-9">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="bio">Bio</Label>
              <span
                className={cn(
                  "text-xs tabular-nums",
                  bioNearLimit ? "text-amber-600" : "text-muted-foreground",
                )}
              >
                {bioCount}/{BIO_MAX_LENGTH}
              </span>
            </div>
            <div className="relative">
              <FileText className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    bio: e.target.value.slice(0, BIO_MAX_LENGTH),
                  }))
                }
                maxLength={BIO_MAX_LENGTH}
                placeholder="Write a short description about yourself..."
                className="resize-none pl-9"
                rows={3}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Brief description for your profile. Max {BIO_MAX_LENGTH}{" "}
              characters.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-end">
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
            onClick={handleSave}
            disabled={saving || loading || !isDirty}
            className="w-full transition-transform duration-150 active:scale-95 sm:w-auto"
          >
            {saving ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
