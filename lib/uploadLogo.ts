// lib/uploadLogo.ts
import { supabase } from "@/lib/supabaseClient";

function safeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").slice(0, 80);
}

/**
 * Upload a company logo to the "logos" bucket and return its public URL.
 * - Stores at: logos/{userId}/{timestamp}-{filename}
 * - Overwrites if the same path is reused (unlikely due to timestamp)
 */
export async function uploadLogo(userId: string, file: File): Promise<string> {
  // quick client-side checks (also handled in your UI)
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("File must be under 2MB");
  }

  const path = `${userId}/${Date.now()}-${safeName(file.name || "logo.png")}`;

  const { error: uploadErr } = await supabase.storage
    .from("logos")
    .upload(path, file, {
      upsert: false,
      cacheControl: "3600",
      contentType: file.type || "image/png",
    });

  if (uploadErr) {
    throw new Error(uploadErr.message || "Upload failed");
  }

  // Get a public URL (requires the bucket to be public, see notes below)
  const {
    data: { publicUrl },
  } = supabase.storage.from("logos").getPublicUrl(path);

  return publicUrl;
}
