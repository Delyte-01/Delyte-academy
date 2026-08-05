"use client";

import { useEffect, useState } from "react";
import { profileService } from "@/services/profile";
import { Profile } from "@/types/profile";

export function useAdminProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await profileService.getCurrentProfile();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { profile, loading };
}
