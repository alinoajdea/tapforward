import { supabase } from "@/lib/supabaseClient";

// Define the type to make it clear for TS
type Profile = {
  email: string;
  full_name: string;
  avatar_url: string | null;
  company_name: string;      // Faked for now
  custom_branding: string;   // Faked for now
};

export async function getProfile(): Promise<Profile> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .select("email, full_name, avatar_url")
    .eq("id", user.id)
    .single();

  if (error) throw error;

  return {
    ...data,
    company_name: "",      // Fake value
    custom_branding: "",   // Fake value
  };
}

export async function updateProfile({
  full_name,
  avatar_url,
  company_name,      // Accept for future!
  custom_branding,   // Accept for future!
}: {
  full_name?: string;
  avatar_url?: string;
  company_name?: string;
  custom_branding?: string;
}): Promise<Profile> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const updates: any = { updated_at: new Date().toISOString() };
  if (full_name !== undefined) updates.full_name = full_name;
  if (avatar_url !== undefined) updates.avatar_url = avatar_url;
  // Not used in db yet, but you can add logic here in the future:
  // if (company_name !== undefined) updates.company_name = company_name;
  // if (custom_branding !== undefined) updates.custom_branding = custom_branding;

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw error;

  return {
    ...data,
    company_name: company_name ?? "",
    custom_branding: custom_branding ?? "",
  };
}
