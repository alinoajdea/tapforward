"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password state
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState<string | null>(null);

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

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault();
    setResetLoading(true);
    setResetMsg(null);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail || email);
    setResetLoading(false);
    if (error) setResetMsg(error.message);
    else setResetMsg("Check your email for a password reset link!");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-orange-50 to-blue-50">
      <div
        className="
          bg-white p-8 w-full max-w-md
          sm:rounded-2xl sm:shadow-2xl sm:border sm:border-gray-100
          rounded-none shadow-none border-none
          min-h-screen sm:min-h-fit
          flex flex-col justify-center
        "
      >
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
          <p className="text-gray-500 text-base">
            Welcome back! Please login to your account.
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-red-400 focus:border-red-400 shadow-sm transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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
            <div className="flex justify-end mt-2">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline font-medium"
                onClick={() => setShowReset(true)}
                tabIndex={-1}
              >
                Forgot password?
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
          <div className="mt-4 text-red-600 text-sm text-center">
            {error}
          </div>
        )}
        <p className="mt-8 text-sm text-gray-500 text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-blue-600 hover:underline font-semibold"
          >
            Sign up
          </Link>
        </p>
        {/* Reset password modal */}
        {showReset && (
          <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs mx-4 p-6 flex flex-col gap-4 relative">
              <button
                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500"
                onClick={() => { setShowReset(false); setResetMsg(null); setResetEmail(""); }}
                aria-label="Close"
              >
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <h2 className="text-lg font-bold text-gray-800 mb-2">Forgot your password?</h2>
              <p className="text-gray-500 text-sm">
                Enter your email and we’ll send you a password reset link.
              </p>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full border border-gray-300 px-4 py-2 rounded"
                  value={resetEmail || email}
                  onChange={e => setResetEmail(e.target.value)}
                  required
                  autoFocus
                  disabled={resetLoading}
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-gradient-to-tr from-blue-600 to-red-500 hover:from-red-600 hover:to-orange-400 font-semibold text-white shadow-lg transition-all disabled:opacity-50"
                  disabled={resetLoading}
                >
                  {resetLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
              {resetMsg && (
                <div className={`text-sm mt-2 text-center ${resetMsg.startsWith("Check") ? "text-green-600" : "text-red-600"}`}>
                  {resetMsg}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
