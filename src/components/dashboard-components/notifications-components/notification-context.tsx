"use client";

import React, { createContext, useContext } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useStudentNotifications } from "@/hooks/useStudentNotification";

const NotificationContext = createContext<ReturnType<
  typeof useStudentNotifications
> | null>(null);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = useProfile();

  const value = useStudentNotifications(profile?.id);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);

  if (!ctx) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }

  return ctx;
}
