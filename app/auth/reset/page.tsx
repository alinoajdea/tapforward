"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Listen for access_token from URL
  useEffect(() => {
    const access_token = params.get("access_token");
    if (!access_token) {
      setMsg("Invalid or missing token. Please try your reset link again.");
    }
  }, [params]);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const access_token = params.get("access_token");
    if (!access_token) {
      setMsg("Missing access token.");
      setLoading(false);
      return;
    }

    // Set the session using the access_token
    const { error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token: params.get("refresh_token") || "",
    });

    if (sessionError) {
      setMsg(sessionError.message);
      setLoading(false);
      return;
    }

    // Update password
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) setMsg(error.message);
    else {
      setMsg("Password updated! You can now log in.");
      setTimeout(() => router.replace("/auth/login"), 2500);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-orange-50 to-blue-50">
      <div className="bg-white p-8 max-w-md w-full rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-600 mb-2">
          Reset your password
        </h1>
        <form onSubmit={handleReset} className="space-y-5">
          <input
            type="password"
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            placeholder="New password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={6}
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-tr from-blue-600 to-red-500 font-semibold text-white shadow-lg transition-all"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
        {msg && <div className="mt-4 text-center text-red-600">{msg}</div>}
      </div>
    </div>
  );
}
