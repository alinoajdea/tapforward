"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) setError(error.message);
    else router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-orange-50 to-blue-50 dark:from-neutral-900 dark:to-neutral-950">
      <div className="bg-white/95 dark:bg-neutral-950/95 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-neutral-900">
        <div className="flex flex-col items-center mb-8">
          {/* Gradient Logo Circle */}
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
            Sign in to TapForward
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base">
            Welcome back! Please login to your account.
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:focus:ring-orange-500 dark:focus:border-orange-500 shadow-sm transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-red-400 focus:border-red-400 dark:focus:ring-orange-500 dark:focus:border-orange-500 shadow-sm transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-500 dark:hover:text-orange-400 transition"
                onClick={() => setShowPwd((v) => !v)}
                tabIndex={-1}
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? (
                  // Eye Off
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
                  // Eye
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
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-lg bg-gradient-to-tr from-blue-600 to-red-500 hover:from-red-600 hover:to-orange-400 font-semibold text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        {error && (
          <div className="mt-4 text-red-600 dark:text-orange-400 text-sm text-center">
            {error}
          </div>
        )}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-blue-600 dark:text-orange-400 hover:underline font-semibold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
