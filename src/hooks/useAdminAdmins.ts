"use client";

import { useCallback, useEffect, useState } from "react";
import { getAdmins, revokeAdmin, deleteAdmin } from "@/services/admin-admins";

export interface AdminUser {
  id: string;
  full_name: string;
  username: string;
  email: string;
  avatar_url: string | null;
  phone: string;
  country: string;
  bio: string;
  role: "admin";
  status: "active" | "inactive" | "suspended";
  created_at: string;
  updated_at: string;

  initials: string;
}

type AdminApiRecord = {
  id?: string | null;
  full_name?: string | null;
  username?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  country?: string | null;
  bio?: string | null;
  status?: AdminUser["status"] | string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

function formatAdmin(admin: AdminApiRecord): AdminUser {
  const name = admin.full_name || "Admin";

  const initials = name
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: admin.id || "",
    full_name: name,
    username: admin.username || "admin",
    email: admin.email || "",
    avatar_url: admin.avatar_url ?? null,

    phone: admin.phone || "",
    country: admin.country || "",
    bio: admin.bio || "",

    role: "admin",
    status: (admin.status as AdminUser["status"]) || "active",

    created_at: admin.created_at || "",
    updated_at: admin.updated_at || "",

    initials,
  };
}

export function useAdminAdmins() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAdmins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAdmins();

      setAdmins((data ?? []).map(formatAdmin));
    } catch (err) {
      console.error(err);

      setError(err instanceof Error ? err.message : "Failed to load admins");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAdmins();
  }, [loadAdmins]);

  const removeAdminLocal = (id: string) => {
    setAdmins((prev) => prev.filter((admin) => admin.id !== id));
  };

  const handleRevokeAdmin = async (id: string) => {
    await revokeAdmin(id);
    removeAdminLocal(id);
  };

  const handleDeleteAdmin = async (id: string) => {
    await deleteAdmin(id);
    removeAdminLocal(id);
  };

  return {
    admins,
    loading,
    error,
    loadAdmins,
    removeAdminLocal,
    handleRevokeAdmin,
    handleDeleteAdmin,
  };
}
