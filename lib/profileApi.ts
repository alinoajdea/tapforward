// lib/profileApi.ts
import { supabase } from "@/lib/supabaseClient";

export type Profile = {
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;     // used as company logo URL
  company_name: string | null;
  // kept for backward compatibility with older UI code
  custom_branding?: string | null; // mirrors avatar_url
};

export async function getProfile(): Promise<Profile> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .select("email, full_name, avatar_url, company_name")
    .eq("id", user.id)
    .single();

  if (error) throw error;

  // Mirror avatar_url -> custom_branding for any legacy code still reading it
  return {
    email: data.email ?? null,
    full_name: data.full_name ?? null,
    avatar_url: data.avatar_url ?? null,
    company_name: data.company_name ?? null,
    custom_branding: data.avatar_url ?? null,
  };
}

export async function updateProfile({
  full_name,
  avatar_url,
  company_name,
  // accept custom_branding for legacy callers and map it to avatar_url
  custom_branding,
}: {
  full_name?: string;
  avatar_url?: string | null;
  company_name?: string | null;
  custom_branding?: string | null;
}): Promise<Profile> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const updates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (typeof full_name !== "undefined") updates.full_name = full_name;

  // If a legacy caller passes custom_branding, use it as the logo (avatar_url)
  const nextAvatar =
    typeof avatar_url !== "undefined"
      ? avatar_url
      : typeof custom_branding !== "undefined"
      ? custom_branding
      : undefined;

  if (typeof nextAvatar !== "undefined") updates.avatar_url = nextAvatar;
  if (typeof company_name !== "undefined") updates.company_name = company_name;

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select("email, full_name, avatar_url, company_name")
    .single();

  if (error) throw error;

  return {
    email: data.email ?? null,
    full_name: data.full_name ?? null,
    avatar_url: data.avatar_url ?? null,
    company_name: data.company_name ?? null,
    custom_branding: data.avatar_url ?? null, // mirror for legacy UI
  };
}
