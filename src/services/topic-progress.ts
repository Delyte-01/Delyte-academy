import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export class TopicProgressService {
async  markComplete(studentId: string, courseId: string, topicId: string) {
const { error } = await supabase
.from("topic_progress")
.upsert(
{
student_id: studentId,
course_id: courseId,
topic_id: topicId,
completed: true,
completed_at: new Date().toISOString(),
updated_at: new Date().toISOString(),
},
{
onConflict: "student_id,topic_id",
}
);


if (error) throw error;


}

async  getCompletedTopics(studentId: string, courseId: string) {
const { data, error } = await supabase
.from("topic_progress")
.select("topic_id")
.eq("student_id", studentId)
.eq("course_id", courseId)
.eq("completed", true);


if (error) throw error;

return data.map((row) => row.topic_id);


}
}

export const topicProgressService = new TopicProgressService();
