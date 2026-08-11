"use client";

import { useCallback, useEffect, useState } from "react";
import { notificationService } from "@/services/notification";
import { Notification } from "@/types/notification";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const [items, unread] = await Promise.all([
        notificationService.getAdminNotifications(),
        notificationService.getUnreadAdminCount(),
      ]);

      setNotifications(items);
      setUnreadCount(unread);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  load();

  const interval = setInterval(() => {
    load();
  }, 2000); // refresh every 5 seconds

  return () => clearInterval(interval);
}, [load]);

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAdminNotificationRead(id);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );

      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (error) {
      console.error(error);
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAdminNotificationsRead();

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

      setUnreadCount(0);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update notifications");
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    reload: load,
    markAsRead,
    markAllAsRead,
  };
}
