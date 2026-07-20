"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { PlayCircle, FileText, ClipboardList, HelpCircle } from "lucide-react";
import {
  TopicForm,
  TopicFormData,
  TopicFormErrors,
} from "@/components/admin/topics/topic-form";
import { toast } from "sonner";
import { TopicHeader } from "@/components/admin/topics/topic-header";
import { ModulePlaceholders } from "@/components/admin/topics/module-placeholders";
import { TopicPreviewCard } from "@/components/admin/topics/topic-preview-card";
import { ActionBar } from "@/components/admin/courses/actionBar";
import { validateTopic } from "@/lib/validators/topics";
import { TopicService } from "@/services/topic";
import { useCourse } from "@/hooks/useCourse";



const upcomingModules = [
  {
    icon: PlayCircle,
    label: "Lessons",
    description: "Add video lessons & walkthroughs",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: FileText,
    label: "Resources",
    description: "Attach PDFs & worksheets",
    color: "text-rose-600",
    bgColor: "bg-rose-500/10",
  },
  {
    icon: HelpCircle,
    label: "Practice Questions",
    description: "Build the question bank",
    color: "text-violet-600",
    bgColor: "bg-violet-500/10",
  },
  {
    icon: ClipboardList,
    label: "Quiz",
    description: "Create quizzes & assessments",
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
];

export default function EditTopicPage() {
  const router = useRouter();

  const params = useParams();
  const id = params.id as string;
  const topicId = params.topicsId as string;

  console.log(id, topicId);
  const [saving, setSaving] = useState(false);
  const [savingMessage, setSavingMessage] = useState("");
  const { course } = useCourse(id);

  const [data, setData] = useState<TopicFormData>({
    title: "",
    slug: "",
    description: "",
    estimatedTime: "",
    difficulty: "beginner",
    status: "draft",
    objectives: [],
    prerequisites: [],
  });

  const [errors, setErrors] = useState<TopicFormErrors>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadTopic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadTopic() {
    try {
      setSaving(true);

      const topic = await TopicService.getTopicById(topicId);

      setData({
        title: topic.title,
        description: topic.description,
        estimatedTime: String(topic.estimated_time),
        difficulty: topic.difficulty,
        status: topic.status,
        slug: topic.slug,
        prerequisites: [],
        objectives: [],
      });
    } finally {
      setSaving(false);
    }
  }

  const handleChange = (
    field: keyof TopicFormData,
    value: string | boolean | string[]
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof TopicFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSaveDraft = async () => {
    const errs = validateTopic(data);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the errors");
      return;
    }
    try {
      setSaving(true);

      await TopicService.updateTopic({
        id: topicId,
        title: data.title,
        description: data.description,
        estimatedTime: Number(data.estimatedTime),
        difficulty: data.difficulty,
        status: "draft",
        courseId: id,
      });
      setSavingMessage("Saving Topic...");
      toast.success("Topic saved as draft.");

      router.push(`/admin/courses/${id}/?tab=topics`);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    const errs = validateTopic(data);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the errors");
      return;
    }
    try {
      setSaving(true);
      console.log("Sending topic:", {
        status: data.status,
        difficulty: data.difficulty,
        data,
      });
      await TopicService.updateTopic({
        id: topicId,
        courseId: id,
        title: data.title,
        description: data.description,
        estimatedTime: Number(data.estimatedTime),
        difficulty: data.difficulty,
        status: "published",
      });
      setSavingMessage("Saving Topic...");
      toast.success("Topic Published.");

      router.push(`/admin/courses/${id}/?tab=topics`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => router.push(`/admin/courses/${id}`);

  return (
    <div className="space-y-6 pb-24">
      <TopicHeader
        title="Edit Topic"
        subtitle="Edit existing topic to this course."
        breadcrumbs={[
          { label: "Courses", href: "/admin/courses" },
          {
            label: course?.title ?? "course title",
            href: `/admin/courses/${id}/?tab=topics`,
          },
          { label: "Edit Topic" },
        ]}
        belongsTo={{
          label: course?.title ?? "course title",
          code: course?.course_code ?? "course code",
          href: `/admin/courses/${id}/?tab=topics`,
        }}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <TopicForm data={data} errors={errors} onChange={handleChange} />
          <ModulePlaceholders modules={upcomingModules} />
        </div>
        <div className="lg:col-span-1">
          <TopicPreviewCard
            courseName={course?.title ?? "course title"}
            courseCode={course?.course_code ?? "course code "}
            title={data.title}
            slug={data.slug}
            description={data.description}
            estimatedTime={data.estimatedTime}
            difficulty={data.difficulty}
            status={data.status}
            objectives={data.objectives}
            thumbnail={course?.thumbnail ?? "course image"}
          />
        </div>
      </div>

      <ActionBar
        onCancel={handleCancel}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        saving={saving}
        savingMessage={savingMessage}
      />
    </div>
  );
}
