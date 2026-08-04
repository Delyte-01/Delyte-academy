"use client";

import { useEffect, useState } from "react";

import { getRecentActivity, RecentActivityItem } from "@/services/dashboard";

export function useRecentActivity(studentId?: string) {
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(() => (studentId ? true : false));

  useEffect(() => {
    if (!studentId) {
      return;
    }

    let mounted = true;

    const id = studentId;

    async function load() {
      try {
        setLoading(true);

        const data = await getRecentActivity(id);

        if (mounted) setActivities(data);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [studentId]);

  return {
    activities: studentId ? activities : [],
    loading: studentId ? loading : false,
  };
}
