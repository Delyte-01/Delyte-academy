"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await authService.logout();

      if (error) throw error;

      toast.success("Logged out successfully.");

      router.replace("/login");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to log out."
      );
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
