import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = await createClient();

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("OAuth exchange failed:", exchangeError);
    return NextResponse.redirect(`${origin}/login`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  // Look for an existing profile by ID
  const { data: profileById, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error(profileError);
    return NextResponse.redirect(`${origin}/login`);
  }

  let currentProfile = profileById;

  // If not found by ID, check by email (important for existing admins)
  if (!currentProfile && user.email) {
    const { data: profileByEmail, error: emailLookupError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", user.email)
      .maybeSingle();

    if (emailLookupError) {
      console.error(emailLookupError);
      return NextResponse.redirect(`${origin}/login`);
    }

    if (profileByEmail) {
      // Reattach the existing profile to the current auth user ID
      const { data: updatedProfile, error: updateError } = await supabase
        .from("profiles")
        .update({ id: user.id })
        .eq("email", user.email)
        .select()
        .single();

      if (updateError) {
        console.error(updateError);
        return NextResponse.redirect(`${origin}/login`);
      }

      currentProfile = updatedProfile;
    }
  }

  // Still no profile: create a new student profile
  if (!currentProfile) {
    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        full_name:
          user.user_metadata?.full_name ?? user.user_metadata?.name ?? "",
        role: "student",
      })
      .select()
      .single();

    if (insertError) {
      console.error(insertError);
      return NextResponse.redirect(`${origin}/login`);
    }

    currentProfile = newProfile;
  }

  if (
    currentProfile.role === "admin" ||
    currentProfile.role === "super_admin"
  ) {
    return NextResponse.redirect(`${origin}/admin`);
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
