"use client";

import { useState, useEffect, useRef } from "react";
import { getProfile, updateProfile } from "@/lib/profileApi";
import { useAuth } from "@/lib/AuthContext";
import { useSubscription } from "@/lib/useSubscription";
import { uploadLogo } from "@/lib/uploadLogo";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function AccountPage() {
  const { user } = useAuth();
  const { subscription, loading: subLoading } = useSubscription();

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [customBranding, setCustomBranding] = useState(""); // logo url
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const plan = subscription?.plan || "free";
  const canBrand = plan === "growth" || plan === "pro";

  useEffect(() => {
    setLoading(true);
    getProfile()
      .then((profile) => {
        setFullName(profile.full_name || "");
        setAvatarUrl(profile.avatar_url || null);
        setEmail(profile.email || "");
        setCompanyName(profile.company_name || "");
        setCustomBranding(profile.custom_branding || "");
        setLogoPreview(profile.custom_branding || "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Handle logo file change
  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
        setError("Logo must be an image under 2MB");
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setError(null);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!canBrand) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleLogoChange({ target: { files: [file] } } as any);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    let uploadedLogoUrl = customBranding;
    try {
      if (logoFile && user?.id) {
        uploadedLogoUrl = await uploadLogo(user.id, logoFile);
        setCustomBranding(uploadedLogoUrl);
      }
      await updateProfile({
        full_name: fullName,
        avatar_url: avatarUrl || undefined,
        ...(canBrand && {
          company_name: companyName,
          custom_branding: uploadedLogoUrl,
        }),
      });
      setSuccess("Profile updated!");
    } catch (e: any) {
      setError(e.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordReset() {
    if (!user?.email) return;
    await supabase.auth.resetPasswordForEmail(user.email);
    setSuccess("Check your email for a password reset link.");
  }

  // PLAN UI
  const planLabels: Record<string, string> = {
    free: "Free",
    growth: "Growth",
    pro: "Pro",
  };
  const planColors: Record<string, string> = {
    free: "bg-blue-100 text-blue-600 border-blue-200",
    growth: "bg-red-100 text-red-500 border-red-200",
    pro: "bg-purple-100 text-purple-600 border-purple-200",
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-100">
      <div className="bg-white w-full border flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className="bg-gray-50 md:w-64 py-10 px-6 flex flex-col items-center border-r border-gray-100">
          <div className="flex flex-col items-center">
            {/* Only logo/preview, NOT initials badge */}
            {(logoPreview || customBranding) ? (
              <Image
                src={logoPreview || customBranding}
                width={72}
                height={72}
                alt="Logo"
                className="rounded-full border shadow object-cover bg-white"
              />
            ) : (
              <div className="w-[72px] h-[72px] rounded-full bg-gray-200 border shadow" />
            )}
            <div className="mt-4 font-bold text-lg">{fullName || "—"}</div>
            <div className="text-gray-500 text-sm mb-1">{email}</div>
          </div>
          <div className="mt-6 w-full">
            <div
              className={`inline-block w-full px-4 py-2 rounded-lg font-bold text-center border ${planColors[plan]}`}
            >
              {planLabels[plan]} Plan
            </div>
            {plan === "free" && (
              <div className="mt-3 text-xs text-yellow-600 font-semibold bg-yellow-50 border border-yellow-100 rounded px-3 py-2 text-center">
                Unlock more features:
                <Link href="/pricing" className="block mt-1">
                  <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded font-bold shadow hover:scale-105 transition inline-block">
                    Upgrade Now
                  </span>
                </Link>
              </div>
            )}
            {plan !== "free" && (
              <button
                className="w-full mt-3 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold px-4 py-2 rounded shadow transition"
                onClick={async () => {
                  const res = await fetch("/api/stripe/billing", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user?.id }),
                  });
                  const { url } = await res.json();
                  if (url) window.location.href = url;
                }}
              >
                Manage Billing
              </button>
            )}
            <Link
              href="/messages"
              className="w-full block mt-3 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold px-4 py-2 rounded shadow transition text-center"
            >
              Messages
            </Link>
          </div>
          <button
            type="button"
            onClick={handlePasswordReset}
            className="w-full mt-10 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-red-50 hover:to-pink-100 text-red-500 font-semibold py-2 rounded-xl shadow transition-all duration-150 text-sm"
          >
            Change Password
          </button>
          {/* Password Reset Success Notification */}
          {success === "Check your email for a password reset link." && (
            <div className="w-full mt-2 text-green-700 text-sm text-center bg-green-50 py-2 rounded">
              {success}
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 md:p-12">
          <h1 className="text-3xl font-extrabold text-gray-600 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-500 mb-8 text-base">
            Update your personal and branding details.
          </p>
          {loading ? (
            <div className="text-gray-500 text-center py-12">Loading…</div>
          ) : (
            <form onSubmit={handleSave} className="space-y-10 max-w-xl">
              {/* PERSONAL */}
              <section>
                <h2 className="font-semibold text-gray-800 mb-2 text-lg">
                  Personal Info
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {/* Full name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-100 focus:border-red-400 text-gray-800 font-medium"
                      placeholder="Your full name"
                      maxLength={60}
                    />
                  </div>
                  {/* Email (readonly) */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Email
                    </label>
                    <input
                      value={email}
                      disabled
                      className="block w-full px-4 py-2 border border-gray-200 rounded bg-gray-100 text-gray-400 cursor-not-allowed font-semibold"
                    />
                  </div>
                </div>
              </section>

              {/* BRANDING */}
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="font-semibold text-gray-800 text-lg">
                    Branding
                  </h2>
                  {!canBrand && (
                    <span className="text-xs bg-gray-200 text-gray-500 rounded px-2 py-0.5 ml-2 font-semibold">
                      Upgrade for custom branding
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {/* Company Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      disabled={!canBrand}
                      className={`block w-full px-4 py-2 border rounded font-medium transition ${
                        canBrand
                          ? "border-gray-300 focus:ring-2 focus:ring-red-100 focus:border-red-400 text-gray-800"
                          : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      placeholder="Company"
                      maxLength={80}
                    />
                  </div>
                  {/* Company Logo */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Company Logo
                    </label>
                    <div
                      className={`relative border-2 rounded-lg p-4 bg-gray-50 flex flex-col items-center justify-center transition ${
                        canBrand
                          ? "border-dashed hover:bg-gray-100 cursor-pointer"
                          : "border-solid border-gray-200 bg-gray-100 opacity-70 cursor-not-allowed"
                      }`}
                      onDragOver={(e) => {
                        if (canBrand) e.preventDefault();
                      }}
                      onDrop={canBrand ? handleDrop : undefined}
                      onClick={() => canBrand && fileInputRef.current?.click()}
                    >
                      {logoPreview ? (
                        <Image
                          src={logoPreview}
                          width={72}
                          height={72}
                          alt="Logo Preview"
                          className="rounded shadow border mb-2 object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">
                          {canBrand
                            ? "Drag & drop or click to upload logo (max 2MB)"
                            : "Upgrade to upload a custom logo"}
                        </span>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                        disabled={!canBrand}
                      />
                      {logoFile && (
                        <span className="block mt-1 text-xs text-gray-500">
                          {logoFile.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* PRO-ONLY */}
              {plan === "pro" && (
                <section>
                  <h2 className="font-semibold text-gray-800 text-lg mb-2">
                    Team Analytics
                  </h2>
                  <span className="block px-4 py-2 border border-gray-200 bg-gray-50 rounded text-green-700 font-semibold">
                    Enabled
                  </span>
                </section>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2 px-4 rounded-lg bg-gradient-to-tr from-blue-600 to-red-500 hover:from-red-600 hover:to-orange-400 font-semibold text-white shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
              {success && success !== "Check your email for a password reset link." && (
                <div className="text-green-700 text-sm text-center bg-green-50 py-2 rounded">
                  {success}
                </div>
              )}
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 py-2 rounded">
                  {error}
                </div>
              )}
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
