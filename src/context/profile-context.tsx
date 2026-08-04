"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { Profile } from "@/types/profile";
import { profileService } from "@/services/profile";

interface ProfileContextValue {
  profile: Profile | null;
  loading: boolean;
  saving: boolean;
  saveProfile: (updates: Partial<Profile>) => Promise<void>;
  reloadProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(
  undefined,
);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getCurrentProfile();
      setProfile(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const saveProfile = async (updates: Partial<Profile>) => {
    try {
      setSaving(true);
      const updated = await profileService.updateProfile(updates);
      setProfile(updated);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        saving,
        saveProfile,
        reloadProfile: loadProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used inside ProfileProvider");
  }

  return context;
}
