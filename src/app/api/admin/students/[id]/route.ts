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

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return {
      error: "Profile not found",
      status: 403,
    };
  }

  if (profile.role !== "super_admin") {
    return {
      error: "Only super admins can perform this action",
      status: 403,
    };
  }

  return {
    user,
    profile,
  };
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

    const updates: Record<string, unknown> = {};

    /*
     * STATUS
     */
    if (body.status !== undefined) {
      const allowedStatuses = ["active", "inactive", "suspended"];

      if (!allowedStatuses.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

      updates.status = body.status;
    }

    /*
     * ROLE
     */
    if (body.role !== undefined) {
      const allowedRoles = ["student", "admin"];

      if (!allowedRoles.includes(body.role)) {
        return NextResponse.json(
          {
            error:
              "Invalid role. Super admin role cannot be assigned through this endpoint.",
          },
          { status: 400 },
        );
      }

      updates.role = body.role;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid updates provided" },
        { status: 400 },
      );
    }

    /*
     * NEVER allow a super admin to modify another super admin
     * through this student/admin management endpoint.
     */
    const { data: targetUser, error: targetError } = await admin
      .from("profiles")
      .select("id, role")
      .eq("id", id)
      .single();

    if (targetError || !targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.role === "super_admin") {
      return NextResponse.json(
        {
          error: "Super admin accounts cannot be modified from this endpoint.",
        },
        { status: 403 },
      );
    }

    /*
     * Prevent modifying yourself through this endpoint.
     */
    if (id === auth.user.id) {
      return NextResponse.json(
        {
          error: "You cannot modify your own account from this endpoint.",
        },
        { status: 403 },
      );
    }

    const { data, error } = await admin
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);

      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("PATCH route crashed:", err);

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

    /*
     * Prevent deleting yourself.
     */
    if (id === auth.user.id) {
      return NextResponse.json(
        {
          error: "You cannot delete your own account.",
        },
        { status: 403 },
      );
    }

    /*
     * Check target user's role first.
     */
    const { data: targetUser, error: targetError } = await admin
      .from("profiles")
      .select("id, role")
      .eq("id", id)
      .single();

    if (targetError || !targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    /*
     * Never allow deletion of a super admin.
     */
    if (targetUser.role === "super_admin") {
      return NextResponse.json(
        {
          error: "Super admin accounts cannot be deleted.",
        },
        { status: 403 },
      );
    }

    /*
     * Delete Auth user.
     *
     * Your profile should ideally be removed automatically
     * through ON DELETE CASCADE. If it isn't, we handle it below.
     */
    const { error: authDeleteError } = await admin.auth.admin.deleteUser(id);

    if (authDeleteError) {
      console.error("Auth delete error:", authDeleteError);

      return NextResponse.json(
        { error: authDeleteError.message },
        { status: 400 },
      );
    }

    /*
     * Remove profile if it still exists.
     */
    const { error: profileDeleteError } = await admin
      .from("profiles")
      .delete()
      .eq("id", id);

    if (profileDeleteError) {
      console.error("Profile delete error:", profileDeleteError);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error("DELETE route crashed:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
