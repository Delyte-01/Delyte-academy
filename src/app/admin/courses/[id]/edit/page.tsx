"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Clock, FileEdit, Target } from "lucide-react";
import {
  CourseForm,
  CourseFormData,
  CourseFormErrors,
} from "@/components/admin/courses/courseForm";
import { CourseHeader } from "@/components/admin/courses/courseHeader";
import { PreviewCard } from "@/components/admin/courses/PreviewCard";
import { StatisticsCard } from "@/components/admin/courses/statisticsCard";
import { ActionBar } from "@/components/admin/courses/actionBar";
import { toast } from "sonner";
import { courseService } from "@/services/course";
import { validateCourse } from "@/lib/validators/course";
import { uploadCourseImages } from "@/lib/courses/image-upload-images";
import { Course } from "@/types/course";
import { uploadService } from "@/services/upload";

const mockCourse = {
  title: "Advanced Mathematics",
  code: "MATH101",
  description:
    "A comprehensive course covering algebra, calculus, geometry, and statistics. Designed for students preparing for JAMB, WAEC, and NECO examinations. Includes 24 topics with video lessons, practice questions, and downloadable resources.",
  status: "Published" as const,
  banner:
    "https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=1200",
  thumbnail:
    "https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=400",
  allowDownloads: true,
  allowPracticeBeforeTopics: false,
  showOnHomepage: true,
  enableCertificates: false,
};

const mockMetadata = {
  createdBy: "Super Admin",
  createdDate: "Jan 15, 2025",
  lastUpdated: "Jul 8, 2025",
  topics: 24,
  practiceSets: 12,
  questions: 320,
};

const mockStats = [
  {
    label: "Topics",
    value: "24",
    icon: FileEdit,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Practice Sets",
    value: "12",
    icon: Target,
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Questions",
    value: "320",
    icon: FileEdit,
    color: "text-violet-600",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Resources",
    value: "8",
    icon: FileEdit,
    color: "text-rose-600",
    bgColor: "bg-rose-500/10",
  },
  {
    label: "Enrolled",
    value: "1,240",
    icon: User,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
  {
    label: "Completion",
    value: "68%",
    icon: Target,
    color: "text-cyan-600",
    bgColor: "bg-cyan-500/10",
  },
];

export default function EditCoursePage() {
  const router = useRouter();
  const [originalCourse, setOriginalCourse] = useState<Course | null>(null);

  const [saving, setSaving] = useState(false);
  const [savingMessage, setSavingMessage] = useState("");

  const [data, setData] = useState<CourseFormData>({
    title: "",
    code: "",
    description: "",
    status: "draft",
    banner: "",
    thumbnail: "",
    allowDownloads: true,
    allowPracticeBeforeTopics: false,
    showOnHomepage: true,
    enableCertificates: false,
  });
  const [errors, setErrors] = useState<CourseFormErrors>({});

  const params = useParams();

  const id = params.id as string;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCourse = async () => {
    try {
      setSaving(true);

      const course = await courseService.getCourseById(id);
      console.log(course);
      setOriginalCourse(course);

      setData({
        title: course.title,
        code: course.course_code,
        description: course.description,
        status: course.status,
        banner: course.banner ?? "",
        thumbnail: course.thumbnail ?? "",
        bannerFile: undefined,
        thumbnailFile: undefined,
        allowDownloads: course.allow_downloads,
        allowPracticeBeforeTopics: course.allow_practice_before_topics,
        showOnHomepage: course.show_on_homepage,
        enableCertificates: course.enable_certificates,
      });
    } catch {
      toast.error("Unable to load course.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = <K extends keyof CourseFormData>(
    field: K,
    value: CourseFormData[K]
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof CourseFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSaveDraft = async () => {
    setSavingMessage("Uploading images...");
    const errs = validateCourse(data);
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the errors");
      return;
    }

    const { bannerUrl, thumbnailUrl, bannerChanged, thumbnailChanged } =
      await uploadCourseImages(data);
    setSavingMessage("Saving course...");
    try {
      setSaving(true);

      await courseService.updateCourse({
        id,
        title: data.title,
        courseCode: data.code,
        description: data.description,
        banner: bannerUrl,
        thumbnail: thumbnailUrl,

        status: "draft",
      });

      if (bannerChanged && originalCourse?.banner) {
        await uploadService.deleteImage(
          originalCourse.banner,
          "course-banners"
        );
      }

      if (thumbnailChanged && originalCourse?.thumbnail) {
        await uploadService.deleteImage(
          originalCourse.thumbnail,
          "course-banners"
        );
      }

      toast.success("Draft updated successfully");

      router.push("/admin/courses");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update draft."
      );
    } finally {
      setSaving(false);
      setSavingMessage("");
    }
  };

  const handlePublish = async () => {
    setSavingMessage("Uploading images...");
    const errs = validateCourse(data);
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the errors");
      return;
    }
    const { bannerUrl, thumbnailUrl, bannerChanged, thumbnailChanged } =
      await uploadCourseImages(data);
    setSavingMessage("Saving course...");

    try {
      setSaving(true);

      await courseService.updateCourse({
        id,
        title: data.title,
        courseCode: data.code,
        description: data.description,
        banner: bannerUrl,
        thumbnail: thumbnailUrl,
        status: "published",
      });
      setSavingMessage("Finishing...");
      if (bannerChanged && originalCourse?.banner) {
        await uploadService.deleteImage(
          originalCourse.banner,
          "course-banners"
        );
      }

      if (thumbnailChanged && originalCourse?.thumbnail) {
        await uploadService.deleteImage(
          originalCourse.thumbnail,
          "course-banners"
        );
      }
      toast.success("Course updated successfully");

      router.push("/admin/courses");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update course."
      );
    } finally {
      setSaving(false);
      setSavingMessage("");
    }
  };
  const handleCancel = () => router.push("/admin/courses");

  return (
    <div className="space-y-6 pb-24">
      <CourseHeader
        title="Edit course"
        subtitle="Update and manage this academic course."
        breadcrumbs={[
          { label: "Courses", href: "/admin/courses" },
          { label: mockCourse.title },
          { label: "Edit" },
        ]}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onCancel={handleCancel}
        saving={saving}
        savingMessage={savingMessage}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <CourseForm data={data} errors={errors} onChange={handleChange} />

          {/* Metadata */}
          <Card className="overflow-hidden rounded-2xl border-slate-100">
            <CardHeader className="pb-4">
              <CardTitle className="font-[var(--font-display)] text-base font-bold text-slate-900">
                Course metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {[
                {
                  icon: User,
                  label: "Created by",
                  value: mockMetadata.createdBy,
                },
                {
                  icon: Calendar,
                  label: "Created date",
                  value: mockMetadata.createdDate,
                },
                {
                  icon: Clock,
                  label: "Last updated",
                  value: mockMetadata.lastUpdated,
                },
                { icon: FileEdit, label: "Topics", value: mockMetadata.topics },
                {
                  icon: Target,
                  label: "Practice sets",
                  value: mockMetadata.practiceSets,
                },
                {
                  icon: FileEdit,
                  label: "Questions",
                  value: mockMetadata.questions,
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-colors hover:bg-violet-50/40"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                    <Icon className="h-4 w-4 text-[#6D5BF5]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11.5px] text-slate-400">{label}</p>
                    <p className="truncate text-[13.5px] font-semibold text-slate-800">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <PreviewCard
            title={data.title}
            code={data.code}
            description={data.description}
            status={data.status}
            banner={data.banner}
            thumbnail={data.thumbnail}
          />
        </div>
      </div>
      <StatisticsCard stats={mockStats} />
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
