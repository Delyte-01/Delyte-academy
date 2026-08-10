// src/services/profile.ts

import { TABLES } from "@/constants/database";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types/profile";

async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("AUTH USER:", user);
  console.log("AUTH ERROR:", userError);

  if (!user) return null;

  const { data, error } = await supabase
    .from(TABLES.Profiles)
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  console.log("PROFILE QUERY DATA:", data);
  console.log("PROFILE QUERY ERROR:", error);

  if (error) throw error;

  return data;
}
async function upsertProfile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  const fullName =
    user.user_metadata?.full_name ??
    [user.user_metadata?.first_name, user.user_metadata?.last_name]
      .filter(Boolean)
      .join(" ") ??
    user.user_metadata?.name ??
    "";

  const username =
    user.user_metadata?.username ??
    `${(user.email ?? "student")
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_")}_${user.id.slice(0, 4)}`;

  const googleAvatar =
    user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null;

  // Check existing profile so we don't overwrite a custom uploaded avatar
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      full_name: fullName,
      username,
      avatar_url: existingProfile?.avatar_url || googleAvatar,
      role: "student",
    },
    { onConflict: "id" },
  );

  if (error) throw error;
}

async function updateProfile(
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
    >
  >,
): Promise<Profile> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found.");

  const { data, error } = await supabase
    .from(TABLES.Profiles)
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
