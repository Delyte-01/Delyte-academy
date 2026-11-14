/** Shape of one row in the dashboard's recent-activity feed (data comes from `useAdminAnalytics`). */
export interface StudentActivity {
  id: string;
  name: string;
  initials: string;
  action: string;
  course: string;
  time: string;
  type: "enrolled" | "quiz" | "topic" | "finished";
}
