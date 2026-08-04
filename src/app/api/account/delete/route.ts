import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function DELETE() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete user-owned data first
  await Promise.all([
    supabase.from("quiz_attempts").delete().eq("student_id", user.id),
    supabase.from("topic_progress").delete().eq("student_id", user.id),
    supabase.from("enrollments").delete().eq("student_id", user.id),
    supabase.from("profiles").delete().eq("id", user.id),
  ]);

  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
