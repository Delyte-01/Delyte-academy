import { createClient } from "@/lib/supabase/client";
import type { UpcomingQuiz } from "@/types/dashboard";

const supabase = createClient();

interface QuizRow {
  id: string;
  title: string;
  time_limit: number;
  passing_score: number;
}

interface TopicRow {
  id: string;
  title: string;
  quizzes: QuizRow[] | null;
}

interface CourseRow {
  id: string;
  title: string;
  topics: TopicRow[] | null;
}

interface EnrollmentRow {
  course_id: string;
  courses: CourseRow | null;
}

export interface RecentActivityItem {
  id: string;
  type: "enrollment" | "topic_completed" | "quiz_completed";
  text: string;
  course: string;
  time: string;
  timestamp: string;
}




export async function getUpcomingQuizzesForStudent(
  userId: string,
): Promise<UpcomingQuiz[]> {
  const { data, error } = await supabase
    .from("enrollments")
    .select(
      `       course_id,
      courses (
        id,
        title,
        topics (
          id,
          title,
          quizzes (
            id,
            title,
            time_limit,
            passing_score
          )
        )
      )
    `,
    )
    .eq("student_id", userId);

  if (error) throw error;

  const enrollments = (data ?? []) as unknown as EnrollmentRow[];

  const quizzes: UpcomingQuiz[] = enrollments.flatMap((enrollment) => {
    const course = enrollment.courses;

    if (!course) return [];

   return (course.topics ?? []).flatMap((topic) => {
     const quizzes = Array.isArray(topic.quizzes)
       ? topic.quizzes
       : topic.quizzes
         ? [topic.quizzes]
         : [];

     return quizzes.map((quiz) => ({
       id: quiz.id,
       title: quiz.title,
       course: course.title,
       topicId: topic.id,
       timeLimit: quiz.time_limit,
       passingScore: quiz.passing_score,
     }));
   });
  });

  return quizzes;
}


function formatRelative(date: string) {
const diff = Date.now() - new Date(date).getTime();

const minutes = Math.floor(diff / 60000);

if (minutes < 1) return "Just now";
if (minutes < 60) return `${minutes} min ago`;

const hours = Math.floor(minutes / 60);

if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

const days = Math.floor(hours / 24);

if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

return new Date(date).toLocaleDateString();
}

export async function getRecentActivity(studentId: string) {
const [enrollmentsRes, progressRes, attemptsRes] = await Promise.all([
supabase
.from("enrollments")
.select(
"id, enrolled_at, course(title)"
)
.eq("student_id", studentId),

supabase
  .from("topic_progress")
  .select(
    "id, completed_at, topic:topics(title, course:courses(title))"
  )
  .eq("student_id", studentId)
  .eq("completed", true),

supabase
  .from("quiz_attempts")
  .select(
    "id, completed_at, score, quiz:quizzes(title, topic:topics(course:courses(title)))"
  )
  .eq("student_id", studentId),

]);

const activities: RecentActivityItem[] = [];

for (const row of enrollmentsRes.data ?? []) {
activities.push({
id: row.id,
type: "enrollment",
text: "Enrolled in a new course",
// eslint-disable-next-line @typescript-eslint/no-explicit-any
course: (row.course as any)?.title ?? "Course",
time: formatRelative(row.enrolled_at),
timestamp: row.enrolled_at,
});
}

for (const row of progressRes.data ?? []) {
activities.push({
  id: row.id,
  type: "topic_completed",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  text: `Completed topic ${(row.topic as any)?.title ?? "Topic"}`,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  course: (row.topic as any)?.course?.title ?? "Course",
  time: formatRelative(row.completed_at),
  timestamp: row.completed_at,
});
}

for (const row of attemptsRes.data ?? []) {
activities.push({
  id: row.id,
  type: "quiz_completed",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  text: `Scored ${row.score}% on ${(row.quiz as any)?.title ?? "Quiz"}`,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  course: (row.quiz as any)?.topic?.course?.title ?? "Course",
  time: formatRelative(row.completed_at),
  timestamp: row.completed_at,
});
}

activities.sort(
(a, b) =>
new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
);

return activities.slice(0, 10);
}