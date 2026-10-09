export async function getAdmins() {
  const res = await fetch("/api/admin/admins", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch admins");
  }

  return res.json();
}

export async function revokeAdmin(id: string) {
  const res = await fetch(`/api/admin/admins/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      role: "student",
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to revoke admin");
  }

  return res.json();
}

export async function deleteAdmin(id: string) {
  const res = await fetch(`/api/admin/admins/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete admin");
  }

  return res.json();
}

export async function updateAdmin(
  id: string,
  updates: {
    status?: "active" | "inactive" | "suspended";
  },
) {
  const res = await fetch(`/api/admin/admins/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update admin");
  }

  return res.json();
}
