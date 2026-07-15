import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  console.log(request.url);
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );
    console.log("Redirecting to admin");

    if (exchangeError) {
      console.error("Exchange Error:", exchangeError);
      console.log("Redirecting to dashboard");
      return NextResponse.redirect(`${origin}/login`);
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("Session:", session);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("User:", user);
    if (!user) {
      return NextResponse.redirect(`${origin}/login`);
    }

    // Create profile if it doesn't exist
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) throw error;

    let currentProfile = profile;

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

      if (insertError) throw insertError;

      currentProfile = newProfile;
    }

    console.log("Current Profile:", currentProfile);
    console.log("Role:", currentProfile.role);

    if (
      currentProfile.role === "admin" ||
      currentProfile.role === "super_admin"
    ) {
      return NextResponse.redirect(`${origin}/admin`);
    }

    return NextResponse.redirect(`${origin}/dashboard`);
  }

  return NextResponse.redirect(`${origin}/login`);
}
