const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

type ResourceType = "image" | "raw" | "video";

/**
 * Uploads a file directly from the browser to Cloudinary using an unsigned
 * upload preset. This bypasses the backend entirely, avoiding any server-side
 * request size limits (e.g. Vercel's 4.5MB body limit).
 */
export async function uploadToCloudinary(
  file: File,
  resourceType: ResourceType,
  folder = "educational-platform"
): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("إعدادات Cloudinary غير مكتملة، تأكد من VITE_CLOUDINARY_CLOUD_NAME و VITE_CLOUDINARY_UPLOAD_PRESET");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.error?.message ?? "فشل رفع الملف، برجاء المحاولة مرة أخرى");
  }

  const data = await response.json();
  return data.secure_url as string;
}