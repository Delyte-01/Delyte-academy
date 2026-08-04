"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { securityService } from "@/services/security";

type CurrentSession = Awaited<ReturnType<typeof securityService.getCurrentSession>>;

export function useSecurity() {
  const [session, setSession] = useState<CurrentSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    securityService.getCurrentSession().then((s) => {
      setSession(s);
      setLoading(false);
    });
  }, []);

  const changePassword = async (password: string) => {
    try {
      await securityService.changePassword(password);
      toast.success("Password updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update password.");
      throw error;
    }
  };

  const signOutAllDevices = async () => {
    try {
      await securityService.signOutAllDevices();
      toast.success("Signed out from all devices.");
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign out from all devices.");
    }
  };

  return {
    session,
    loading,
    changePassword,
    signOutAllDevices,
  };
}
