import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

class SecurityService {
  async changePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  }

  async signOutAllDevices() {
    const { error } = await supabase.auth.signOut({
      scope: "global",
    });

    if (error) throw error;
  }

  async getCurrentSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session;
  }
}

export const securityService = new SecurityService();
