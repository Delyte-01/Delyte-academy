import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const admin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
);

async function requireSuperAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Unauthorized",
      status: 401,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "super_admin") {
    return {
      error: "Only super admins can manage administrators",
      status: 403,
    };
  }

  return { user };
}

export async function GET() {
  try {
    const auth = await requireSuperAdmin();

    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { data: admins, error } = await admin
      .from("profiles")
      .select(
        `
        id,
        full_name,
        username,
        email,
        avatar_url,
        phone,
        country,
        bio,
        role,
        status,
        created_at,
        updated_at
      `,
      )
      .eq("role", "admin")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch admins:", error);

      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(admins ?? []);
  } catch (error) {
    console.error("GET admins crashed:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
