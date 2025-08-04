"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { generateUniqueSlug } from "@/lib/slugify"; // 👈 import the slug helper

export default function CreateMessagePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [unlocksNeeded, setUnlocksNeeded] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user) {
      setError("You must be logged in to create a message.");
      setLoading(false);
      return;
    }

    const slug = generateUniqueSlug(title); // 👈 generate slug

    const { data, error } = await supabase
      .from("messages")
      .insert([{
        user_id: user.id,
        title,
        content,
        unlocks_needed: unlocksNeeded,
        slug, // 👈 insert the slug
      }])
      .select()
      .single();

    setLoading(false);

    if (error) return setError(error.message);
    router.push("/messages");
  }

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-red-50 via-orange-50 to-blue-50 flex items-center justify-center py-8 px-3">
      <div className="w-full max-w-xl mx-auto">
        {/* Card */}
        <div className="bg-white/95 border border-gray-100 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col gap-8 animate-fade-in">
          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-red-500 via-orange-400 to-blue-600 shadow-lg">
              <svg width={32} height={32} fill="none" viewBox="0 0 24 24">
                <path
                  d="M3.75 5.75A2.25 2.25 0 0 1 6 3.5h12A2.25 2.25 0 0 1 20.25 5.75v8.5A2.25 2.25 0 0 1 18 16.5H9.314a.75.75 0 0 0-.53.22l-2.92 2.92A1 1 0 0 1 4 18.293V5.75Z"
                  stroke="#fff" strokeWidth={2} strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-tr from-red-600 via-orange-500 to-blue-600 text-transparent bg-clip-text mb-1">
                Create New Message
              </h1>
              <div className="text-gray-500 text-sm">
                Share a message that unlocks only when forwarded.
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="relative">
              <input
                className="peer block w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl bg-gray-50 font-semibold focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition placeholder-transparent"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={60}
                required
                id="message-title"
                autoFocus
                placeholder=" "
              />
              <label
                htmlFor="message-title"
                className="absolute left-4 top-2 text-xs text-gray-500 font-semibold pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-orange-500 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
              >
                Title
              </label>
            </div>

            <div className="relative">
              <textarea
                className="peer block w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl bg-gray-50 font-medium focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition placeholder-transparent resize-none"
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={4}
                required
                id="message-content"
                placeholder=" "
                maxLength={500}
              />
              <label
                htmlFor="message-content"
                className="absolute left-4 top-2 text-xs text-gray-500 font-semibold pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-orange-500 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
              >
                Message Content
              </label>
              <div className="absolute right-4 bottom-2 text-xs text-gray-400">
                {content.length}/500
              </div>
            </div>

            <div className="relative flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="font-semibold text-gray-700 mb-1 sm:mb-0 sm:w-40">
                Unlocks Needed
              </label>
              <input
                type="number"
                className="w-24 border border-gray-300 px-4 py-2 rounded-xl bg-gray-50 font-semibold focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                value={unlocksNeeded}
                onChange={e => setUnlocksNeeded(Number(e.target.value))}
                min={1}
                max={10}
                required
              />
              <span className="text-xs text-gray-400 ml-1">
                (1–10, how many people must share to unlock)
              </span>
            </div>

            {error && <div className="text-red-600 bg-red-50 rounded p-2">{error}</div>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-lg bg-gradient-to-tr from-blue-600 via-orange-500 to-red-600 text-white shadow-md hover:scale-[1.02] transition-all disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Creating…" : "Create Message"}
            </button>
          </form>
        </div>
      </div>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px);}
          to { opacity: 1; transform: none;}
        }
      `}</style>
    </div>
  );
}
