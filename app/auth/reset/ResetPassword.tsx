"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

function getPasswordErrors(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 8) errors.push("At least 8 characters");
  if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
  if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
  if (!/[0-9]/.test(password)) errors.push("At least one number");
  if (!/[^A-Za-z0-9]/.test(password))
    errors.push("At least one special character");
  return errors;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const hasToken = !!params.get("access_token");

    if (!authLoading && user && !hasToken) {
      router.replace("/");
    }
  }, [user, params, router, authLoading]);

  const accessToken = params.get("access_token");

  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const passwordErrors = getPasswordErrors(password);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!accessToken) {
      setError("Invalid or expired reset link.");
      return;
    }
    if (passwordErrors.length) {
      setError("Please create a stronger password.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) setError(error.message);
    else {
      setSuccess("Password reset! You can now sign in.");
      setTimeout(() => router.push("/auth/login"), 2000);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-orange-50 to-blue-50">
      <div className="bg-white p-8 w-full max-w-md sm:rounded-2xl sm:shadow-2xl sm:border sm:border-gray-100 rounded-none shadow-none border-none min-h-screen sm:min-h-fit flex flex-col justify-center">
        <div className="flex flex-col items-center mb-8">
          <span className="mb-2 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-600 via-orange-400 to-blue-600 shadow-lg">
            <svg width={32} height={32} viewBox="0 0 62 65" fill="none">
              <circle cx="31" cy="32.5" r="30" fill="url(#loginGradient)" />
              <defs>
                <linearGradient
                  id="loginGradient"
                  x1="0"
                  y1="0"
                  x2="62"
                  y2="65"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FF2D20" />
                  <stop offset="0.5" stopColor="#FFAD27" />
                  <stop offset="1" stopColor="#2196F3" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <h1 className="text-3xl font-extrabold bg-gradient-to-tr from-red-600 via-orange-500 to-blue-600 text-transparent bg-clip-text mb-1">
            Reset your password
          </h1>
          <p className="text-gray-500 text-base text-center">
            Set a new password for your account.
            <br />
            Password must be strong for your security.
          </p>
        </div>
        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-red-400 focus:border-red-400 shadow-sm transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-500 transition"
                onClick={() => setShowPwd((v) => !v)}
                tabIndex={-1}
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.52 0-10-4.48-10-10a10.94 10.94 0 0 1 2.06-6.06M1 1l22 22"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>
            </div>
            <ul className="mt-2 ml-1 text-xs text-gray-600 space-y-1">
              <li>
                <span
                  className={
                    password.length >= 8 ? "text-green-600 font-medium" : ""
                  }
                >
                  • At least 8 characters
                </span>
              </li>
              <li>
                <span
                  className={
                    /[a-z]/.test(password) ? "text-green-600 font-medium" : ""
                  }
                >
                  • At least one lowercase letter
                </span>
              </li>
              <li>
                <span
                  className={
                    /[A-Z]/.test(password) ? "text-green-600 font-medium" : ""
                  }
                >
                  • At least one uppercase letter
                </span>
              </li>
              <li>
                <span
                  className={
                    /[0-9]/.test(password) ? "text-green-600 font-medium" : ""
                  }
                >
                  • At least one number
                </span>
              </li>
              <li>
                <span
                  className={
                    /[^A-Za-z0-9]/.test(password)
                      ? "text-green-600 font-medium"
                      : ""
                  }
                >
                  • At least one special character
                </span>
              </li>
            </ul>
          </div>
          <button
            type="submit"
            disabled={loading || !accessToken}
            className="w-full py-2 px-4 rounded-lg bg-gradient-to-tr from-blue-600 to-red-500 hover:from-red-600 hover:to-orange-400 font-semibold text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting…" : "Reset Password"}
          </button>
        </form>
        {error && (
          <div className="mt-4 text-white text-sm text-center px-4 py-2 rounded-lg bg-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 text-white text-sm text-center px-4 py-2 rounded-lg bg-green-400">
            {success}
          </div>
        )}
        <p className="mt-8 text-sm text-gray-500 text-center">
          Back to{" "}
          <Link
            href="/auth/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
