"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { studentNotificationService } from "@/services/student-notification";
import { Notification } from "@/types/notification";

export function useStudentNotifications(studentId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const lastSignature = useRef("");

  const load = useCallback(async () => {
    if (!studentId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      const items =
        await studentNotificationService.getStudentNotifications(studentId);

      // Build a small signature so we only update state when data changes
      const signature = items.map((n) => `${n.id}:${n.read}`).join("|");

      if (signature !== lastSignature.current) {
        lastSignature.current = signature;
        setNotifications(items);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();

    const interval = setInterval(load, 2000);

    const onFocus = () => load();
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [load]);

  const markAsRead = async (id: string) => {
    await studentNotificationService.markAsRead(id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = async () => {
    if (!studentId) return;

    await studentNotificationService.markAllAsRead(studentId);

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return {
    notifications,
    loading,
    unreadCount: notifications.filter((n) => !n.read).length,
    markAsRead,
    markAllAsRead,
    reload: load,
  };
}
