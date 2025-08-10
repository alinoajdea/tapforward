import { supabase } from "./supabaseClient";
import { nanoid } from "nanoid";

/** Hash helper for anon_fingerprint */
async function sha256(input: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const enc = new TextEncoder().encode(input);
    const buf = await window.crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Fallback
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return `x${Math.abs(hash)}`;
}

/** Get public IP */
export async function getPublicIp(): Promise<string | null> {
  try {
    const res = await fetch("https://api.ipify.org?format=json", { cache: "no-store" });
    const j = await res.json();
    return j?.ip ?? null;
  } catch {
    return null;
  }
}

/** Generate the same fingerprint used for dedupe */
export async function getAnonFingerprint(): Promise<string> {
  const ip = await getPublicIp();
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  return sha256(`${ip ?? ""}|${ua}`);
}

/**
 * Create (or fetch existing) forward code.
 * Dedupes per (message, parent, person).
 */
export async function createForward(
  messageId: string,
  senderId: string | null = null,
  parentRef?: string | null
): Promise<string> {
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

  const anon_fingerprint = senderId ? null : await getAnonFingerprint();
  const unique_code = nanoid(8);

  const { data, error } = await supabase
    .from("forwards")
    .insert({
      message_id: messageId,
      sender_id: senderId,
      parent_id: parentId,
      unique_code,
      anon_fingerprint,
    })
    .select("unique_code")
    .single();

  if (!error && data) return data.unique_code;

  if ((error as any)?.code === "23505") {
    let q = supabase
      .from("forwards")
      .select("unique_code")
      .eq("message_id", messageId)
      .eq("parent_id", parentId);

    const { data: existing } = senderId
      ? await q.eq("sender_id", senderId).maybeSingle()
      : await q.eq("anon_fingerprint", anon_fingerprint).maybeSingle();

    if (existing?.unique_code) return existing.unique_code;
  }

  throw error;
}
