"use client";

import { useMemo, useState } from "react";
import {
  MoreHorizontal,
  ShieldCheck,
  UserX,
  Trash2,
  Inbox,
} from "lucide-react";

import { useAdminAdmins, AdminUser } from "@/hooks/useAdminAdmins";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminDetailSheet } from "@/components/admin/admin-details-sheet";


export default function AdminsPage() {
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const {
    admins,
    loading,
    handleRevokeAdmin,
    handleDeleteAdmin,
    removeAdminLocal,
  } = useAdminAdmins();

  const [search, setSearch] = useState("");

  const filteredAdmins = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return admins;

    return admins.filter(
      (admin) =>
        admin.full_name.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query) ||
        admin.username.toLowerCase().includes(query),
    );
  }, [admins, search]);

  const revoke = async (admin: AdminUser) => {
    const confirmed = window.confirm(
      `Revoke admin access from ${admin.full_name}?`,
    );

    if (!confirmed) return;

    try {
      await handleRevokeAdmin(admin.id);

      toast.success(`${admin.full_name} is now a student`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to revoke admin",
      );
    }
  };

  const remove = async (admin: AdminUser) => {
    const confirmed = window.confirm(
      `Delete ${admin.full_name}? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await handleDeleteAdmin(admin.id);

      toast.success("Admin deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete admin",
      );
    }
  };

  const handleSelectAdmin = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />

          <h1 className="text-2xl font-extrabold tracking-tight">
            Administrators
          </h1>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage administrators and platform access.
        </p>
      </div>

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Admins</p>

            <p className="mt-2 text-3xl font-extrabold">{admins.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Active Admins</p>

            <p className="mt-2 text-3xl font-extrabold">
              {admins.filter((admin) => admin.status === "active").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Suspended Admins</p>

            <p className="mt-2 text-3xl font-extrabold">
              {admins.filter((admin) => admin.status === "suspended").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search administrators..."
          className="h-10 w-full max-w-md rounded-xl border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted">
                <Inbox className="h-8 w-8 text-muted-foreground" />
              </div>

              <p className="mt-4 text-sm font-semibold">
                No administrators found
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Administrators promoted from the Students page will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="pl-5">Administrator</TableHead>

                    <TableHead>Email</TableHead>

                    <TableHead>Status</TableHead>

                    <TableHead>Joined</TableHead>

                    <TableHead className="pr-5 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredAdmins.map((admin) => (
                    <TableRow
                      key={admin.id}
                      className="cursor-pointer transition-colors hover:bg-muted/30"
                      onClick={() => handleSelectAdmin(admin)}
                    >
                      <TableCell
                        className="pl-5 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-11 w-11">
                            <AvatarImage
                              src={admin.avatar_url ?? undefined}
                              alt={admin.full_name}
                            />

                            <AvatarFallback>{admin.initials}</AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="font-medium">{admin.full_name}</p>

                            <p className="text-xs text-muted-foreground">
                              @{admin.username}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {admin.email}
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={
                            admin.status === "active"
                              ? "border-0 bg-emerald-500/15 text-emerald-700"
                              : "border-0 bg-rose-500/15 text-rose-700"
                          }
                        >
                          {admin.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(admin.created_at).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="pr-5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                              Admin Controls
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem onSelect={() => revoke(admin)}>
                              <UserX className="mr-2 h-4 w-4" />
                              Revoke Admin
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onSelect={() => remove(admin)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AdminDetailSheet
        admin={selectedAdmin}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onAdminUpdated={(updates) => {
          if (!selectedAdmin) return;

          setSelectedAdmin({
            ...selectedAdmin,
            ...updates,
          });
        }}
        onAdminRemoved={() => {
          if (!selectedAdmin) return;

          removeAdminLocal(selectedAdmin.id);
          setSheetOpen(false);
          setSelectedAdmin(null);
        }}
      />
    </div>
  );
}
