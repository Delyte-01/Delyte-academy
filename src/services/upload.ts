import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
type StorageBucket =
  | "course-thumbnails"
  | "course-banners"
  | "course-content"
  | "lesson-attachment";

async function uploadImage(file: File, bucket: StorageBucket, folder?: string) {
  const fileExt = file.name.split(".").pop();

  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const { error } = await supabase.storage.from(bucket).upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return data.publicUrl;
}

async function deleteImage(url: string, bucket: StorageBucket) {
  if (!url) return;

  const supabase = createClient();

  const pathname = new URL(url).pathname;

  const filePath = pathname.split(`${bucket}/`)[1];

  if (!filePath) return;

  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    console.error(error);
  }
}

export const uploadService = {
  uploadImage,
  deleteImage,
};
