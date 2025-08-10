// lib/createForward.ts
import { supabase } from "./supabaseClient";
import { nanoid } from "nanoid";

/** Hash helper that works in browser (Web Crypto) and falls back if needed */
async function sha256(input: string): Promise<string> {
  try {
    // Browser path
    if (typeof window !== "undefined" && window.crypto?.subtle) {
      const enc = new TextEncoder().encode(input);
      const buf = await window.crypto.subtle.digest("SHA-256", enc);
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
  } catch {}
  // Fallback (not cryptographically strong, but fine as a last resort)
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return `x${Math.abs(hash)}`;
}

/** Try to read public IP; ok if it fails */
async function getPublicIp(): Promise<string | null> {
  try {
    const res = await fetch("https://api.ipify.org?format=json", { cache: "no-store" });
    const j = await res.json();
    return j?.ip ?? null;
  } catch {
    return null;
  }
}

/**
 * Create (or fetch existing) forward code.
 * - If `parentRef` provided, chains this forward under that parent.
 * - If `senderId` is null, we generate anon_fingerprint from IP|UA.
 * Returns the forward's unique_code (string) for drop-in compatibility.
 */
export async function createForward(
  messageId: string,
  senderId: string | null = null,
  parentRef?: string | null
): Promise<string> {
  // Resolve optional parent by code
  let parentId: string | null = null;
  if (parentRef) {
    const { data: parent, error } = await supabase
      .from("forwards")
      .select("id, message_id")
      .eq("unique_code", parentRef)
      .maybeSingle();
    if (error || !parent) throw new Error("Invalid parent ref");
    if (parent.message_id !== messageId) throw new Error("Parent/message mismatch");
    parentId = parent.id;
  }

  // Compute anon fingerprint (IP|UA) for anonymous viewers
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const ip = await getPublicIp();
  const anon_fingerprint = senderId ? null : await sha256(`${ip ?? ""}|${ua}`);

  const unique_code = nanoid(8);

  // Attempt insert
  const { data, error } = await supabase
    .from("forwards")
    .insert({
      message_id: messageId,
      sender_id: senderId,          // null when anonymous
      parent_id: parentId,          // null at root
      unique_code,
      anon_fingerprint,             // null if logged-in creator
    })
    .select("id, unique_code")
    .single();

  if (!error && data) {
    return data.unique_code;
  }

  // If unique index hit (duplicate for same (message, parent, person)), return the existing forward
  // Supabase PostgREST puts PG error code at error.code; 23505 = unique_violation
  if ((error as any)?.code === "23505") {
    let q = supabase
      .from("forwards")
      .select("unique_code")
      .eq("message_id", messageId)
      .eq("parent_id", parentId);

    const { data: existing, error: readErr } = senderId
      ? await q.eq("sender_id", senderId).maybeSingle()
      : await q.eq("anon_fingerprint", anon_fingerprint).maybeSingle();

    if (existing?.unique_code) return existing.unique_code;
    if (readErr) throw readErr;
  }

  // Otherwise, bubble up the insert error
  throw error;
}
