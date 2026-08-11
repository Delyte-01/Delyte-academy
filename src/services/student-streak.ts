import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

function toDayKey(date: string) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export async function getStudentStreak(studentId: string): Promise<number> {
  const [quizRes, topicRes] = await Promise.all([
    supabase
      .from("quiz_attempts")
      .select("completed_at")
      .eq("student_id", studentId)
      .not("completed_at", "is", null),

    supabase
      .from("topic_progress")
      .select("completed_at")
      .eq("student_id", studentId)
      .eq("completed", true)
      .not("completed_at", "is", null),
  ]);

  const dates = [
    ...(quizRes.data ?? []).map((r) => r.completed_at as string),
    ...(topicRes.data ?? []).map((r) => r.completed_at as string),
  ];

  if (dates.length === 0) return 0;

  // Unique days with activity
  const activityDays = Array.from(new Set(dates.map(toDayKey))).sort(
    (a, b) => b - a,
  );

  const today = new Date();
  const todayKey = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).getTime();

  const yesterdayKey = todayKey - 24 * 60 * 60 * 1000;

  // Streak must start from today or yesterday
  if (activityDays[0] !== todayKey && activityDays[0] !== yesterdayKey) {
    return 0;
  }

  let streak = 1;
  let expected = activityDays[0] - 24 * 60 * 60 * 1000;

  for (let i = 1; i < activityDays.length; i++) {
    if (activityDays[i] === expected) {
      streak++;
      expected -= 24 * 60 * 60 * 1000;
    } else if (activityDays[i] < expected) {
      break;
    }
  }

  return streak;
}