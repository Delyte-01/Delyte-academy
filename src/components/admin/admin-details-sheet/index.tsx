"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  UserCheck,
  UserX,
  Trash2,
  Loader2,
  Quote,
} from "lucide-react";
import { toast } from "sonner";

import { AdminUser } from "@/hooks/useAdminAdmins";
import { revokeAdmin, deleteAdmin, updateAdmin } from "@/services/admin-admins";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface AdminDetailSheetProps {
  admin: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdminUpdated?: (updates: Partial<AdminUser>) => void;
  onAdminRemoved?: () => void;
}

type Action = "revoke" | "suspend" | "reactivate" | "delete" | null;

export function AdminDetailSheet({
  admin,
  open,
  onOpenChange,
  onAdminUpdated,
  onAdminRemoved,
}: AdminDetailSheetProps) {
  const [processing, setProcessing] = useState<Action>(null);

  if (!admin) return null;

  const handleRevokeAdmin = async () => {
    try {
      setProcessing("revoke");

      await revokeAdmin(admin.id);

      onAdminRemoved?.();
      onOpenChange(false);

      toast.success(`${admin.full_name} is now a student`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to revoke admin",
      );
    } finally {
      setProcessing(null);
    }
  };

  const handleSuspend = async () => {
    try {
      setProcessing("suspend");

      await updateAdmin(admin.id, { status: "suspended" });

      onAdminUpdated?.({ status: "suspended" });

      toast.success("Admin account suspended");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to suspend admin",
      );
    } finally {
      setProcessing(null);
    }
  };

  const handleReactivate = async () => {
    try {
      setProcessing("reactivate");

      await updateAdmin(admin.id, { status: "active" });

      onAdminUpdated?.({ status: "active" });

      toast.success("Admin account reactivated");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to reactivate admin",
      );
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async () => {
    try {
      setProcessing("delete");

      await deleteAdmin(admin.id);

      onAdminRemoved?.();
      onOpenChange(false);

      toast.success("Admin account deleted");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete admin",
      );
    } finally {
      setProcessing(null);
    }
  };

  const statusMeta = {
    active: {
      dot: "bg-emerald-500",
      text: "text-emerald-700 dark:text-emerald-400",
      label: "Active",
      description: "Signed in and able to manage the platform.",
    },
    suspended: {
      dot: "bg-rose-500",
      text: "text-rose-700 dark:text-rose-400",
      label: "Suspended",
      description: "Access is paused until reactivated.",
    },
    inactive: {
      dot: "bg-muted-foreground",
      text: "text-muted-foreground",
      label: "Inactive",
      description: "Account is inactive.",
    },
  }[admin.status] ?? {
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    label: admin.status,
    description: "",
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg p-5">
        <SheetHeader className="sr-only">
          <SheetTitle>Administrator details</SheetTitle>
          <SheetDescription>
            View account information and manage administrator access.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-7">
          {/* Profile header */}
          <div className="flex items-start gap-4 pt-2">
            <Avatar className="h-20 w-20 shrink-0 border">
              <AvatarImage
                src={admin.avatar_url ?? undefined}
                alt={admin.full_name}
              />
              <AvatarFallback className="text-lg font-semibold">
                {admin.initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-xl font-semibold tracking-tight">
                  {admin.full_name}
                </h2>
                <Badge className="gap-1 border-0 bg-primary/10 text-primary hover:bg-primary/10">
                  <ShieldCheck className="h-3 w-3" />
                  Administrator
                </Badge>
              </div>

              <p className="mt-0.5 text-sm text-muted-foreground">
                @{admin.username}
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Administrator since{" "}
                {new Date(admin.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between border-b pb-5">
            <div className="flex items-center gap-2.5">
              <span
                className={`h-2 w-2 rounded-full ${statusMeta.dot}`}
                aria-hidden
              />
              <div>
                <p className={`text-sm font-medium ${statusMeta.text}`}>
                  {statusMeta.label}
                </p>
                {statusMeta.description && (
                  <p className="text-xs text-muted-foreground">
                    {statusMeta.description}
                  </p>
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Updated{" "}
              {new Date(admin.updated_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Contact information */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground/90">
              Contact information
            </h3>

            <div className="divide-y rounded-lg border">
              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={admin.email || "Not provided"}
              />
              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={admin.phone || "Not provided"}
              />
              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label="Country"
                value={admin.country || "Not provided"}
              />
            </div>
          </div>

          {/* Bio */}
          {admin.bio && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-foreground/90">
                About
              </h3>
              <div className="flex gap-3 border-l-2 pl-4">
                <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                <p className="text-sm leading-6 text-muted-foreground">
                  {admin.bio}
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* Administrator controls */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground/90">
              Administrator controls
            </h3>

            <div className="space-y-2">
              {admin.status === "suspended" ? (
                <Button
                  variant="outline"
                  className="w-full justify-start font-normal"
                  onClick={handleReactivate}
                  disabled={processing !== null}
                >
                  {processing === "reactivate" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserCheck className="mr-2 h-4 w-4" />
                  )}
                  Reactivate account
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-start font-normal"
                  onClick={handleSuspend}
                  disabled={processing !== null}
                >
                  {processing === "suspend" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserX className="mr-2 h-4 w-4" />
                  )}
                  Suspend account
                </Button>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start font-normal"
                    disabled={processing !== null}
                  >
                    {processing === "revoke" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UserX className="mr-2 h-4 w-4" />
                    )}
                    Revoke admin access
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Revoke admin access?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {admin.full_name} will lose administrator permissions and
                      become a student. They can be made an admin again later.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRevokeAdmin}>
                      Revoke access
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-lg border border-destructive/30 bg-destructive/[0.03] p-4">
            <h3 className="text-sm font-medium text-destructive">
              Danger zone
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Deleting this account permanently removes their profile and cannot
              be undone.
            </p>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="mt-3 w-full justify-center font-normal"
                  disabled={processing !== null}
                >
                  {processing === "delete" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {admin.full_name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently deletes the account and cannot be undone.
                    Consider revoking admin access instead if you just want to
                    remove their permissions.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="text-muted-foreground">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
