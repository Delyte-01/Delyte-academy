// src/services/profile.ts

import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types/profile";

async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function upsertProfile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? "",
    role: "student",
  });

  if (error) throw error;
}


async function updateProfile(
  updates: Partial<Pick<Profile, "full_name" | "email"| "username" | "phone" | "country" | "bio" | "avatar_url">>,
): Promise<Profile> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export const profileService = {
  getCurrentProfile,
  upsertProfile,
  updateProfile,
};
