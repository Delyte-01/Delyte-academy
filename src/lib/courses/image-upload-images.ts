import { CourseFormData } from "@/components/admin/courses/courseForm";
import { uploadService } from "@/services/upload";

export async function uploadCourseImages(data: CourseFormData) {
  try {
    const [bannerUrl, thumbnailUrl] = await Promise.all([
      data.bannerFile
        ? uploadService.uploadImage(data.bannerFile, "course-banners")
        : Promise.resolve(data.banner),

      data.thumbnailFile
        ? uploadService.uploadImage(data.thumbnailFile, "course-thumbnails")
        : Promise.resolve(data.thumbnail),
    ]);

    return {
      bannerUrl,
      thumbnailUrl,
      bannerChanged: !!data.bannerFile,
      thumbnailChanged: !!data.thumbnailFile,
    };
  } catch (error) {
    console.error("Image upload failed:", error);
    throw new Error("Failed to upload course images.");
  }
}
