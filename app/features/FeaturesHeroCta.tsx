// app/features/FeaturesHeroCta.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

/**
 * Shows:
 *  - If logged OUT:  [Start Free]  [Go to Messages]
 *  - If logged IN:              [Go to Messages]  (hides Start Free)
 */
export default function FeaturesHeroCta() {
  const { user } = useAuth();

  if (user) {
    return (
      <Link
        href="/messages"
        className="py-3 px-7 rounded-lg bg-white/80 hover:bg-white font-semibold text-blue-700 border border-blue-200 shadow text-lg transition-all"
      >
        Go to Messages
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/auth/register"
        className="py-3 px-7 rounded-lg bg-gradient-to-tr from-blue-600 to-red-500 hover:from-red-600 hover:to-orange-400 font-semibold text-white shadow-lg text-lg transition-all"
      >
        Start Free
      </Link>
      <Link
        href="/messages"
        className="py-3 px-7 rounded-lg bg-white/80 hover:bg-white font-semibold text-blue-700 border border-blue-200 shadow text-lg transition-all"
      >
        Go to Messages
      </Link>
    </>
  );
}
