import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

class AccountService {
  async exportLearningData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated.");

    const [profileRes, enrollmentsRes, progressRes, attemptsRes] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase
          .from("enrollments")
          .select("*, course:courses(*)")
          .eq("student_id", user.id),
        supabase.from("topic_progress").select("*").eq("student_id", user.id),
        supabase.from("quiz_attempts").select("*").eq("student_id", user.id),
      ]);

    return {
      exported_at: new Date().toISOString(),
      profile: profileRes.data,
      enrollments: enrollmentsRes.data ?? [],
      topic_progress: progressRes.data ?? [],
      quiz_attempts: attemptsRes.data ?? [],
    };
  }

  async deleteAccount() {
    const response = await fetch("/api/account/delete", {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();

      throw new Error(data.error || "Failed to delete account.");
    }
  }
}

export const accountService = new AccountService();
