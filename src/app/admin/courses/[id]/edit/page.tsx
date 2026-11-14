"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";
import {
  CourseForm,
  CourseFormData,
  CourseFormErrors,
} from "@/components/admin/courses/courseForm";
import { CourseHeader } from "@/components/admin/courses/courseHeader";
import { PreviewCard } from "@/components/admin/courses/PreviewCard";
import { ActionBar } from "@/components/admin/courses/actionBar";
import { toast } from "sonner";
import { courseService } from "@/services/course";
import { validateCourse } from "@/lib/validators/course";
import { uploadCourseImages } from "@/lib/courses/image-upload-images";
import { Course } from "@/types/course";
import { uploadService } from "@/services/upload";
import { formatReadableDate } from "@/constants/date-format";

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
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const errorCount = Object.values(errors).filter(Boolean).length;

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
    const errs = validateCourse(data);
    setErrors(errs);
    setSubmitAttempted(true);

    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the errors");
      return;
    }

    setSavingMessage("Uploading images...");
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
    const errs = validateCourse(data);
    setErrors(errs);
    setSubmitAttempted(true);

    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the errors");
      return;
    }
    setSavingMessage("Uploading images...");
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
    <div className="space-y-6">
      <CourseHeader
        title="Edit course"
        subtitle="Update and manage this academic course."
        breadcrumbs={[
          { label: "Courses", href: "/admin/courses" },
          { label: data.title || "Course" },
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
          <CourseForm
            data={data}
            errors={errors}
            onChange={handleChange}
            submitAttempted={submitAttempted}
          />

          {/* Metadata — real values from the course record */}
          {originalCourse && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold">Course metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    {
                      icon: User,
                      label: "Created by",
                      value:
                        originalCourse.creator?.full_name ||
                        originalCourse.creator?.username ||
                        originalCourse.creator?.email ||
                        "Unknown",
                    },
                    {
                      icon: Calendar,
                      label: "Created",
                      value: formatReadableDate(originalCourse.created_at),
                    },
                    {
                      icon: Clock,
                      label: "Last updated",
                      value: formatReadableDate(originalCourse.updated_at),
                    },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3.5">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <dt className="text-[13px] text-muted-foreground">{label}</dt>
                        <dd className="truncate text-[15px] font-semibold text-foreground">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6 lg:sticky lg:top-4 lg:col-span-1 lg:self-start">
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
      <ActionBar
        onCancel={handleCancel}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        saving={saving}
        savingMessage={savingMessage}
        errorCount={submitAttempted ? errorCount : 0}
        publishLabel="Save & publish"
      />
    </div>
  );
}
