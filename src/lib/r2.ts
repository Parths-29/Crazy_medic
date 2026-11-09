import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";
export const R2_BUCKET = process.env.R2_BUCKET || "crazy-medic-notes";

export const isR2Configured = Boolean(
  R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET
);

export const s3Client = isR2Configured
  ? new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

/**
 * Generate a presigned PUT URL for direct client-to-R2 upload (e.g. for large PDFs)
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  if (!s3Client) {
    console.warn("[R2 DEV SIMULATOR] Cloudflare R2 credentials not configured. Generating simulated upload URL.");
    return `http://localhost:3000/api/dev/mock-upload?key=${encodeURIComponent(key)}`;
  }

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Generate a short-lived presigned GET URL for secure PDF viewing or downloading
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn = 600
): Promise<string> {
  if (!s3Client) {
    console.warn("[R2 DEV SIMULATOR] Cloudflare R2 credentials not configured. Returning local mock path.");
    return `/mock-notes/${key}`;
  }

  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Upload a Buffer or Uint8Array directly from server (e.g. watermarked PDF bytes)
 */
export async function uploadBufferToR2(
  key: string,
  buffer: Buffer | Uint8Array,
  contentType = "application/pdf"
): Promise<boolean> {
  if (!s3Client) {
    console.log(`[R2 DEV SIMULATOR] Stored buffer for key: ${key} (${buffer.length} bytes)`);
    return true;
  }

  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });
    await s3Client.send(command);
    return true;
  } catch (err) {
    console.error("Failed to upload buffer to Cloudflare R2:", err);
    return false;
  }
}

