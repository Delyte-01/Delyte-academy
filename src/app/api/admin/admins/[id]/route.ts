import { NextRequest, NextResponse } from "next/server";
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireSuperAdmin();

    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const body = await request.json();

    if (body.role !== "student") {
      return NextResponse.json(
        { error: "This endpoint only supports revoking admin access." },
        { status: 400 },
      );
    }

    if (id === auth.user.id) {
      return NextResponse.json(
        { error: "You cannot revoke your own admin access." },
        { status: 403 },
      );
    }

    const { data: target, error: targetError } = await admin
      .from("profiles")
      .select("id, role")
      .eq("id", id)
      .single();

    if (targetError || !target) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    if (target.role !== "admin") {
      return NextResponse.json(
        { error: "This user is not an admin." },
        { status: 400 },
      );
    }

    const { data, error } = await admin
      .from("profiles")
      .update({ role: "student" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("PATCH admin crashed:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireSuperAdmin();

    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;

    if (id === auth.user.id) {
      return NextResponse.json(
        { error: "You cannot delete your own account." },
        { status: 403 },
      );
    }

    const { data: target, error: targetError } = await admin
      .from("profiles")
      .select("id, role")
      .eq("id", id)
      .single();

    if (targetError || !target) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    if (target.role !== "admin") {
      return NextResponse.json(
        { error: "This user is not an admin." },
        { status: 400 },
      );
    }

    const { error: authDeleteError } = await admin.auth.admin.deleteUser(id);

    if (authDeleteError) {
      return NextResponse.json(
        { error: authDeleteError.message },
        { status: 400 },
      );
    }

    await admin.from("profiles").delete().eq("id", id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE admin crashed:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
