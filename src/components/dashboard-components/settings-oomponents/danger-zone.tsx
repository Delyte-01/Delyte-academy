"use client";

import React, { useState } from "react";
import { Trash2, Download, AlertTriangle, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { accountService } from "@/services/account";
import { toast } from "sonner";

export function DangerZoneSection() {
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);

      const data = await accountService.exportLearningData();

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `delyte-academy-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success("Learning data exported successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export learning data.");
    } finally {
      setExporting(false);
    }
  };

  // Note the (e) param + e.preventDefault(): Radix's AlertDialogAction
  // closes the dialog automatically on click unless we stop it. We only
  // want it to close on success — on failure it should stay open so the
  // user sees the error and can retry without re-triggering the whole flow.

  
  const handleDelete = async () => {
    try {
      setDeleting(true);

      await accountService.deleteAccount();

      toast.success("Account deleted successfully.");

      window.location.href = "/login";
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card id="danger" className="scroll-mt-6 border-rose-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold text-rose-700 dark:text-rose-400">
          <Trash2 className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>
          Irreversible actions. Proceed with caution.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Export data */}
        <div className="flex flex-col gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
              <Download className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Export My Learning Data
              </p>
              <p className="text-xs text-muted-foreground">
                Download all your progress, quiz results, and certificates.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exporting}
            className="border-rose-500/30 text-rose-600 hover:bg-rose-500/10 hover:text-rose-600"
          >
            {exporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {exporting ? "Exporting..." : "Export Data"}
          </Button>
        </div>

        {/* Delete account */}
        <div className="flex flex-col gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
              <Trash2 className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Delete Account
              </p>
              <p className="text-xs text-muted-foreground">
                Permanently remove your account and all associated data.
              </p>
            </div>
          </div>

          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action is permanent and cannot be undone. All your course
                  progress, quiz results, certificates, and personal data will
                  be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-rose-600 hover:bg-rose-700"
                >
                  {deleting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {deleting ? "Deleting..." : "Delete Account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
          <p className="text-xs text-muted-foreground">
            Deleting your account is permanent and cannot be undone. Consider
            exporting your learning data before proceeding.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
