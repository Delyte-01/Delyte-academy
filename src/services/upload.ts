import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

async function uploadImage(
  file: File,
  bucket: "course-thumbnails" | "course-banners"
) {
  const fileExt = file.name.split(".").pop();

  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage.from(bucket).upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

  return data.publicUrl;
}

async function deleteImage(url: string) {
  if (!url) return;

  const supabase = createClient();

  const bucket = "course-images";

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
  deleteImage
};
