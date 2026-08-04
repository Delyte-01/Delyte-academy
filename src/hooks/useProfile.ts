"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

import { profileService } from "@/services/profile";
import { Profile } from "@/types/profile";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      const data = await profileService.getCurrentProfile();

      setProfile(data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadProfile();
  }, [loadProfile]);

  const saveProfile = async (
    updates: Partial<
      Pick<
        Profile,
        | "full_name"
        | "email"
        | "username"
        | "phone"
        | "country"
        | "bio"
        | "avatar_url"
        | "language"
        | "autoplay_videos"
        | "math_rendering"
        | "email_notifications"
        | "quiz_reminders"
        
      >
    >,
  ) => {
    try {
      setSaving(true);

      const updated = await profileService.updateProfile(updates);

      setProfile(updated);

      toast.success("Profile updated successfully.");

      return updated;
    } catch (error) {
      console.error(error);

      toast.error("Failed to update profile.");

      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    saving,
    saveProfile,
    reload: loadProfile,
    user,
  };
}
