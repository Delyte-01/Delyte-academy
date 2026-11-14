"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, Search, ShieldCheck, Trash2, UserCheck, UserX, X } from "lucide-react";
import { toast } from "sonner";

import { useAdminAdmins, type AdminUser } from "@/hooks/useAdminAdmins";
import AdminPageShell from "@/components/admin/admin-page-shell";
import { AdminDetailSheet } from "@/components/admin/admin-details-sheet";
import { EmptyState } from "@/components/empty-states";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DataTableShell } from "@/components/ui/data-table-shell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Pending = { kind: "revoke" | "delete"; admin: AdminUser } | null;

export default function AdminsPage() {
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pending, setPending] = useState<Pending>(null);
  const [working, setWorking] = useState(false);
  const [search, setSearch] = useState("");
  const { admins, loading, handleRevokeAdmin, handleDeleteAdmin, removeAdminLocal } = useAdminAdmins();

  const filteredAdmins = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return admins;
    return admins.filter(
      (a) =>
        a.full_name.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query) ||
        a.username.toLowerCase().includes(query),
    );
  }, [admins, search]);

  const activeCount = admins.filter((a) => a.status === "active").length;
  const suspendedCount = admins.filter((a) => a.status === "suspended").length;

  // Same operations as before; the native window.confirm is now a proper dialog.
  const confirmPending = async () => {
    if (!pending) return;
    const { kind, admin } = pending;
    try {
      setWorking(true);
      if (kind === "revoke") {
        await handleRevokeAdmin(admin.id);
        toast.success(`${admin.full_name} is now a student`);
      } else {
        await handleDeleteAdmin(admin.id);
        toast.success("Admin deleted");
      }
      setPending(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : kind === "revoke"
            ? "Failed to revoke admin"
            : "Failed to delete admin",
      );
    } finally {
      setWorking(false);
    }
  };

  const open = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setSheetOpen(true);
  };

  return (
    <AdminPageShell title="Administrators" description="Manage administrators and platform access.">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total admins" value={admins.length} icon={ShieldCheck} tone="brand" />
          <StatCard label="Active admins" value={activeCount} icon={UserCheck} tone="success" />
          <StatCard label="Suspended admins" value={suspendedCount} icon={UserX} tone="warning" />
        </div>

        <DataTableShell
          toolbar={
            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or username"
                aria-label="Search administrators"
                className="pl-9 pr-9"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" aria-hidden />
                </button>
              )}
            </div>
          }
          footer={
            !loading && admins.length > 0 ? (
              <span>
                Showing <b className="tabular-nums text-foreground">{filteredAdmins.length}</b> of{" "}
                <b className="tabular-nums text-foreground">{admins.length}</b>
              </span>
            ) : undefined
          }
        >
          {loading ? (
            <div className="space-y-3 p-5" role="status" aria-label="Loading administrators">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={ShieldCheck}
                title={admins.length === 0 ? "No administrators yet" : "No administrators match"}
                description={
                  admins.length === 0
                    ? "Administrators promoted from the Students page will appear here."
                    : "Try a different name, email or username."
                }
                action={
                  search ? (
                    <Button variant="soft" onClick={() => setSearch("")}>
                      Clear search
                    </Button>
                  ) : undefined
                }
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Administrator</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-12">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => open(admin)}
                        className="group flex items-center gap-3 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Avatar className="size-10">
                          <AvatarImage src={admin.avatar_url ?? undefined} alt="" />
                          <AvatarFallback className="bg-primary-soft text-xs font-bold text-primary-soft-foreground">
                            {admin.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          <span className="block font-semibold text-foreground group-hover:text-primary">{admin.full_name}</span>
                          <span className="block text-[13px] text-muted-foreground">@{admin.username}</span>
                        </span>
                      </button>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                    <TableCell>
                      <Badge variant={admin.status === "active" ? "success" : "danger"} size="sm" className="capitalize">
                        {admin.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {new Date(admin.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label={`Actions for ${admin.full_name}`}>
                            <MoreHorizontal aria-hidden />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Admin controls</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={() => setPending({ kind: "revoke", admin })}>
                            <UserX aria-hidden /> Revoke admin
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={() => setPending({ kind: "delete", admin })}
                          >
                            <Trash2 aria-hidden /> Delete account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DataTableShell>
      </div>

      <AlertDialog open={!!pending} onOpenChange={(o) => !o && !working && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pending?.kind === "revoke" ? "Revoke admin access?" : "Delete this account?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.kind === "revoke"
                ? `${pending.admin.full_name} will become a student and lose access to the admin area.`
                : `${pending?.admin.full_name} will be permanently deleted. This can’t be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={working}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={working}
              onClick={(e) => {
                e.preventDefault();
                void confirmPending();
              }}
            >
              {working ? "Working…" : pending?.kind === "revoke" ? "Revoke access" : "Delete account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AdminDetailSheet
        admin={selectedAdmin}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onAdminUpdated={(updates) => {
          if (!selectedAdmin) return;
          setSelectedAdmin({ ...selectedAdmin, ...updates });
        }}
        onAdminRemoved={() => {
          if (!selectedAdmin) return;
          removeAdminLocal(selectedAdmin.id);
          setSheetOpen(false);
          setSelectedAdmin(null);
        }}
      />
    </AdminPageShell>
  );
}
