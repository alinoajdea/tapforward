"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useSubscription } from "@/lib/useSubscription"; // if you use plans

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const [profileName, setProfileName] = useState<string | null>(null);
  const { subscription } = useSubscription?.() || {};
  const planLabel =
    subscription?.plan === "pro"
      ? "Pro"
      : subscription?.plan === "growth"
      ? "Growth"
      : "Free";

  // Fetch full name from profiles table when logged in
  useEffect(() => {
    if (!user) {
      setProfileName(null);
      return;
    }
    // Fetch full_name from profiles (make sure user.id is correct UUID)
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        if (data?.full_name) setProfileName(data.full_name);
        else setProfileName(null);
      });
  }, [user]);

  function getDisplayName() {
    if (profileName && profileName.trim()) return profileName;
    return user?.email?.split("@")[0] || "User";
  }

  function getInitial() {
    if (profileName && profileName.trim()) return profileName[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return "?";
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  // Avatar/name/plan JSX for re-use (desktop & mobile)
  function ProfileAvatar() {
    return (
      <span className="flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full font-bold text-lg select-none">
          {getInitial()}
        </span>
        <span className="flex flex-col">
          <span className="font-medium text-black text-sm">{getDisplayName()}</span>
          <span className="text-xs text-gray-500 font-semibold">{planLabel}</span>
        </span>
      </span>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/75 shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-tr from-red-600 via-orange-500 to-blue-600 flex items-center gap-2"
        >
          <svg width={30} height={30} viewBox="0 0 62 65" fill="none" className="inline mr-2">
            <circle cx="31" cy="32.5" r="30" fill="url(#logoGradient)" />
            <defs>
              <linearGradient id="logoGradient" x1="0" y1="0" x2="62" y2="65" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FF2D20" />
                <stop offset="0.5" stopColor="#FFAD27" />
                <stop offset="1" stopColor="#2196F3" />
              </linearGradient>
            </defs>
          </svg>
          TapForward
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
            Home
          </Link>
          <Link href="/#features" className="text-gray-700 hover:text-orange-500 font-medium transition">
            Features
          </Link>
          <Link href="/pricing" className="text-gray-700 hover:text-red-600 font-medium transition">
            Pricing
          </Link>
          <Link href="/#faq" className="text-gray-700 hover:text-blue-600 font-medium transition">
            FAQ
          </Link>
          {!user ? (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-md font-medium border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 shadow-sm transition"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="ml-2 px-4 py-2 rounded-md font-medium bg-gradient-to-br from-red-600 to-orange-400 text-white shadow-lg hover:from-blue-600 hover:to-red-400 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/account"
                title="Account settings"
                className="flex items-center gap-3 hover:opacity-80 transition"
              >
                <ProfileAvatar />
              </Link>
              <Link
                href="/messages"
                className="ml-2 px-4 py-2 rounded-md font-medium border border-orange-400 text-orange-500 bg-white hover:bg-orange-50 shadow-sm transition"
              >
                Messages
              </Link>
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 rounded-md font-medium border border-gray-300 text-gray-600 bg-gray-50 hover:bg-gray-100 shadow-sm transition"
              >
                Log out
              </button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex items-center p-2 text-red-600 focus:outline-none"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            {menuOpen ? (
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>

        {/* Mobile Slide Menu */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black/30 z-50 flex">
            <div className="ml-auto w-4/5 max-w-xs h-screen bg-white shadow-xl flex flex-col gap-2 px-6 py-6 animate-slide-in">
              <button
                className="mb-4 ml-auto p-2 rounded-full hover:bg-gray-100"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <Link
                href="/"
                className="py-2 text-lg font-semibold text-gray-800 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/#features"
                className="py-2 text-lg font-semibold text-gray-800 hover:text-orange-500"
                onClick={() => setMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="py-2 text-lg font-semibold text-gray-800 hover:text-red-600"
                onClick={() => setMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/#faq"
                className="py-2 text-lg font-semibold text-gray-800 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                FAQ
              </Link>
              {!user ? (
                <>
                  <Link
                    href="/auth/login"
                    className="mt-2 px-4 py-2 rounded-md font-medium border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 shadow-sm transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="mt-2 px-4 py-2 rounded-md font-medium bg-gradient-to-br from-red-600 to-orange-400 text-white shadow-lg hover:from-blue-600 hover:to-red-400 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/account"
                    title="Account settings"
                    className="flex items-center gap-3 mb-3"
                    onClick={() => setMenuOpen(false)}
                  >
                    <ProfileAvatar />
                  </Link>
                  <Link
                    href="/messages"
                    className="mt-2 px-4 py-2 rounded-md font-medium border border-orange-400 text-orange-500 bg-white hover:bg-orange-50 shadow-sm transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Messages
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="mt-2 px-4 py-2 rounded-md font-medium border border-gray-300 text-gray-600 bg-gray-50 hover:bg-gray-100 shadow-sm transition text-left"
                  >
                    Log out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      {/* Custom slide-in animation */}
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%);}
          to { transform: translateX(0);}
        }
        .animate-slide-in {
          animation: slide-in 0.25s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
    </header>
  );
}
