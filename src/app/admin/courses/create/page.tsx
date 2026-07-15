"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

import { CourseHeader } from "@/components/admin/courses/courseHeader";
import { ActionBar } from "@/components/admin/courses/actionBar";
import { PreviewCard } from "@/components/admin/courses/PreviewCard";
import {
  CourseForm,
  type CourseFormData,
  type CourseFormErrors,
} from "@/components/admin/courses/courseForm";
import { toast } from "sonner";
import { courseService } from "@/services/course";
import { validateCourse } from "@/lib/validators/course";
import { uploadCourseImages } from "@/lib/courses/image-upload-images";

export default function CreateCoursePage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [savingMessage, setSavingMessage] = useState("");
  const [data, setData] = useState<CourseFormData>({
    title: "",
    code: "",
    description: "",
    status: "draft",
    banner: "",
    bannerFile: undefined,
    thumbnail: "",
    thumbnailFile: undefined,
    allowDownloads: true,
    allowPracticeBeforeTopics: false,
    showOnHomepage: true,
    enableCertificates: false,
  });
  const [errors, setErrors] = useState<CourseFormErrors>({});
  const pageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pageRef.current) return;
    gsap.fromTo(
      pageRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  }, []);

  // Indeterminate progress bar while a save/publish request is in flight
  useEffect(() => {
    if (!progressRef.current) return;
    if (saving) {
      gsap.set(progressRef.current, { scaleX: 0, opacity: 1 });
      gsap.to(progressRef.current, {
        scaleX: 0.85,
        duration: 0.8,
        ease: "power2.out",
      });
    } else {
      gsap.to(progressRef.current, {
        scaleX: 1,
        duration: 0.25,
        ease: "power1.out",
        onComplete: () =>
          gsap.set(progressRef.current, { opacity: 0, scaleX: 0 }),
      });
    }
  }, [saving]);

  const handleChange = <K extends keyof CourseFormData>(
    field: K,
    value: CourseFormData[K]
  ) => {
    console.log(field, value);

    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // const validate = (): CourseFormErrors => {
  //   const errs: CourseFormErrors = {};
  //   if (!data.title.trim()) errs.title = "Course title is required";
  //   if (!data.code.trim()) errs.code = "Course code is required";
  //   if (!data.description.trim())
  //     errs.description = "Course description is required";
  //   return errs;
  // };

  const handleSaveDraft = async () => {
    if (saving) return;
    setSaving(true);
    setSavingMessage("Uploading images...");
    const errs = validateCourse(data);
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the errors");
      return;
    }
    const { bannerUrl, thumbnailUrl } = await uploadCourseImages(data);
    setSavingMessage("Saving course...");

    try {
      await courseService.createCourse({
        title: data.title,
        courseCode: data.code,
        description: data.description,
        banner: bannerUrl,
        thumbnail: thumbnailUrl,

        status: "draft",
      });
      setSavingMessage("Finishing...");

      toast.success("Course saved as draft");

      router.push("/admin/courses");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save course."
      );
    } finally {
      setSaving(false);
      setSavingMessage("");
    }
  };

  const handlePublish = async () => {
    const errs = validateCourse(data);
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the errors");
      return;
    }
    const { bannerUrl, thumbnailUrl } = await uploadCourseImages(data);
    try {
      setSaving(true);

      await courseService.createCourse({
        title: data.title,
        courseCode: data.code,
        description: data.description,
        banner: bannerUrl,
        thumbnail: thumbnailUrl,
        status: "published",
      });

      toast.success("Course published successfully");

      router.push("/admin/courses");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to publish course."
      );
    } finally {
      setSaving(false);
    }
  };
  const handleCancel = () => router.push("/admin/courses");

  return (
    <div className="relative space-y-6 pb-20">
      {/* Indeterminate save/publish progress bar */}
      <div
        ref={progressRef}
        className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-gradient-to-r from-primary to-indigo-500 opacity-0"
      />

      <div ref={pageRef} className="space-y-6">
        <CourseHeader
          title="Create Course"
          subtitle="Create and manage academic courses for students."
          breadcrumbs={[
            { label: "Courses", href: "/admin/courses" },
            { label: "Create Course" },
          ]}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          onCancel={handleCancel}
          saving={saving}
          savingMessage={savingMessage}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CourseForm data={data} errors={errors} onChange={handleChange} />
          </div>
          <div className="lg:col-span-1">
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
