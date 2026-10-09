import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function StudentsAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in
  if (!user) {
    redirect("/login");
  }

  // Get the user's role
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // If profile doesn't exist or isn't super admin
  if (error || profile?.role !== "super_admin") {
    redirect("/admin");
  }

  return children;
}
