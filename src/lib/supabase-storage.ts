import { createClient } from "@supabase/supabase-js";

const rawUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  process.env.SUPABASE_REST_URL ||
  "https://ikfoozxpwyregnxexmnu.supabase.co";

// Normalize to origin URL if REST path provided
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

// Create Supabase client for storage operations
export const supabaseStorage = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const DEFAULT_BUCKET = "buyera-media";

/**
 * Ensures bucket exists or attempts to create it
 */
async function ensureBucket(bucketName: string = DEFAULT_BUCKET) {
  try {
    const { data: buckets } = await supabaseStorage.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === bucketName);
    if (!exists) {
      await supabaseStorage.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
    }
  } catch (err) {
    console.warn(`Bucket check for '${bucketName}':`, err);
  }
}

/**
 * Uploads a file buffer or Blob/File to Supabase storage and returns the public URL
 */
export async function uploadToSupabase(
  file: File | Blob | Buffer,
  folder: string = "products",
  fileName?: string,
  contentType?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
    const originalName = fileName || (file as any).name || "upload.jpg";
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
    const uniquePath = `${cleanFolder}/${Date.now()}-${sanitizedName}`;

    // Target bucket (try buyera-media, fallback to product-images if needed)
    let bucket = DEFAULT_BUCKET;
    await ensureBucket(bucket);

    let bodyData: any = file;
    if (typeof Buffer !== "undefined" && Buffer.isBuffer(file)) {
      bodyData = file;
    }

    const { data, error } = await supabaseStorage.storage
      .from(bucket)
      .upload(uniquePath, bodyData, {
        contentType: contentType || (file as any).type || "image/jpeg",
        upsert: true,
      });

    if (error) {
      // Fallback try with 'product-images' bucket
      const { data: fallbackData, error: fallbackError } = await supabaseStorage.storage
        .from("product-images")
        .upload(uniquePath, bodyData, {
          contentType: contentType || (file as any).type || "image/jpeg",
          upsert: true,
        });

      if (fallbackError) {
        throw new Error(error.message || fallbackError.message);
      }
      bucket = "product-images";
    }

    const { data: publicUrlData } = supabaseStorage.storage
      .from(bucket)
      .getPublicUrl(uniquePath);

    return {
      success: true,
      url: publicUrlData.publicUrl,
    };
  } catch (err: any) {
    console.error("Supabase Storage Upload Error:", err);
    return {
      success: false,
      error: err.message || "Failed to upload image to Supabase Storage",
    };
  }
}

/**
 * Deletes a file from Supabase storage using its public or signed URL
 */
export async function deleteFromSupabase(
  fileUrl: string
): Promise<{ success: boolean; error?: string }> {
  if (!fileUrl || typeof fileUrl !== "string") return { success: true };

  // Only attempt delete if URL is from our Supabase instance
  if (!fileUrl.includes("supabase.co/storage")) {
    return { success: true };
  }

  try {
    // Extract bucket and path from URL
    // e.g. .../storage/v1/object/public/buyera-media/products/123-abc.jpg
    // or .../storage/v1/object/sign/product-images/123-abc.jpg?token=...
    const urlObj = new URL(fileUrl);
    const pathname = decodeURIComponent(urlObj.pathname);

    let bucket = DEFAULT_BUCKET;
    let filePath = "";

    const publicMatch = pathname.match(/\/storage\/v1\/object\/(?:public|sign)\/([^/]+)\/(.+)$/);
    if (publicMatch) {
      bucket = publicMatch[1];
      filePath = publicMatch[2];
    } else {
      const parts = pathname.split("/").filter(Boolean);
      const storageIdx = parts.findIndex((p) => p === "object");
      if (storageIdx !== -1 && parts.length > storageIdx + 2) {
        bucket = parts[storageIdx + 2];
        filePath = parts.slice(storageIdx + 3).join("/");
      }
    }

    if (!filePath) {
      return { success: true };
    }

    const { error } = await supabaseStorage.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.warn(`Supabase file deletion notice (${filePath}):`, error.message);
    }

    return { success: true };
  } catch (err: any) {
    console.warn("deleteFromSupabase error (non-fatal):", err);
    return { success: false, error: err.message };
  }
}
