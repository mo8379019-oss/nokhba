import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true,
});

export { cloudinary };

/**
 * Uploads a file buffer to Cloudinary and returns the secure URL.
 * resourceType:
 *  - "image" for banners/thumbnails/team & subject images
 *  - "raw"   for PDF files
 *  - "video" for audio files (Cloudinary handles audio under the "video" resource type)
 */
export function uploadBuffer(
  buffer: Buffer,
  options: { folder: string; resourceType: "image" | "raw" | "video"; filename?: string }
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: options.resourceType,
        public_id: options.filename,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error("Upload failed"));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteAsset(
  publicId: string,
  resourceType: "image" | "raw" | "video" = "image"
) {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
