"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TABLES } from "@/constants/database";

export interface AttentionEntry {
  id: string;
  title: string;
  href: string;
}

export interface AttentionGroup {
  id: "draft-courses" | "empty-quizzes" | "empty-topics";
  label: string;
  /** True number of matching rows (entries below are only a preview). */
  count: number;
  entries: AttentionEntry[];
  /** Set when this particular query failed, so the UI can say so instead of showing "all clear". */
  failed?: boolean;
}

const PREVIEW = 3;

/**
 * Real "needs attention" signals for the admin dashboard — read-only queries,
 * replacing the hard-coded sample list. Each group fails independently.
 */
export function useAdminAttention() {
  const [groups, setGroups] = useState<AttentionGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const drafts = async (): Promise<AttentionGroup> => {
      const base = { id: "draft-courses" as const, label: "Draft courses not yet published" };
      const { data, count, error } = await supabase
        .from(TABLES.COURSES)
        .select("id, title", { count: "exact" })
        .eq("status", "draft")
        .order("updated_at", { ascending: false })
        .limit(PREVIEW);
      if (error) return { ...base, count: 0, entries: [], failed: true };
      return {
        ...base,
        count: count ?? data?.length ?? 0,
        entries: (data ?? []).map((c) => ({ id: c.id, title: c.title, href: `/admin/courses/${c.id}` })),
      };
    };

    const emptyTopics = async (): Promise<AttentionGroup> => {
      const base = { id: "empty-topics" as const, label: "Topics with no lesson content" };
      const { data, count, error } = await supabase
        .from(TABLES.TOPICS)
        .select("id, title, course_id", { count: "exact" })
        .or("content.is.null,content.eq.")
        .order("updated_at", { ascending: false })
        .limit(PREVIEW);
      if (error) return { ...base, count: 0, entries: [], failed: true };
      return {
        ...base,
        count: count ?? data?.length ?? 0,
        entries: (data ?? []).map((t) => ({
          id: t.id,
          title: t.title,
          href: `/admin/courses/${t.course_id}/topics/${t.id}`,
        })),
      };
    };

    const emptyQuizzes = async (): Promise<AttentionGroup> => {
      const base = { id: "empty-quizzes" as const, label: "Quizzes with no questions" };
      const { data, error } = await supabase
        .from(TABLES.QUIZZES)
        .select("id, title, topic:topics(id, title, course_id), questions(count)");
      if (error) return { ...base, count: 0, entries: [], failed: true };

      type Row = {
        id: string;
        title: string | null;
        topic: { id: string; title: string; course_id: string } | { id: string; title: string; course_id: string }[] | null;
        questions: { count: number }[] | null;
      };
      const rows = ((data ?? []) as unknown as Row[]).filter((q) => (q.questions?.[0]?.count ?? 0) === 0);
      return {
        ...base,
        count: rows.length,
        entries: rows.slice(0, PREVIEW).map((q) => {
          const topic = Array.isArray(q.topic) ? q.topic[0] : q.topic;
          return {
            id: q.id,
            title: q.title || topic?.title || "Untitled quiz",
            href: topic ? `/admin/courses/${topic.course_id}/topics/${topic.id}` : "/admin/courses",
          };
        }),
      };
    };

    Promise.all([drafts(), emptyQuizzes(), emptyTopics()])
      .then((result) => !cancelled && setGroups(result))
      .catch(() => !cancelled && setGroups([]))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  return { groups, loading };
}
