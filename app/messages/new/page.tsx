"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { generateUniqueSlug } from "@/lib/slugify";
import { FiType, FiLock, FiHash, FiAlertCircle, FiSparkles } from "react-icons/fi";

export default function CreateMessagePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [unlocksNeeded, setUnlocksNeeded] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useAuth();

  const titleCount = `${title.length}/60`;
  const contentCount = `${content.length}/500`;

  const slugPreview = useMemo(() => {
    if (!title.trim()) return "";
    return generateUniqueSlug(title);
  }, [title]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user) {
      setError("You must be logged in to create a message.");
      setLoading(false);
      return;
    }

    try {
      const slug = generateUniqueSlug(title);

      const { error: insertError } = await supabase
        .from("messages")
        .insert([
          {
            user_id: user.id,
            title,
            content,
            unlocks_needed: unlocksNeeded,
            slug,
          },
        ]);

      if (insertError) throw insertError;

      router.push("/messages");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-red-50 via-orange-50 to-blue-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-2xl mx-auto">

        {/* Card */}
        <div className="bg-white/95 border border-gray-100 rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-red-500 shadow-lg text-white">
              <FiSparkles size={28} />
            </span>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-tr from-red-600 via-orange-500 to-blue-600 text-transparent bg-clip-text">
                Create New Message
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Write your secret. Set how many people must open your link to unlock it.
              </p>
              {!!slugPreview && (
                <div className="mt-2 inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                  <FiHash />
                  Preview: <span className="font-mono">{slugPreview}</span>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div className="group">
              <label htmlFor="message-title" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiType /> Title
              </label>
              <div className="relative">
                <input
                  id="message-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={60}
                  required
                  autoFocus
                  placeholder="Give your message a compelling title"
                  className="w-full px-4 py-3 pr-20 rounded-xl border border-gray-300 bg-gray-50 font-semibold placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  {titleCount}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="group">
              <label htmlFor="message-content" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiLock /> Message Content
              </label>
              <div className="relative">
                <textarea
                  id="message-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  required
                  maxLength={500}
                  placeholder="Write what readers will unlock after enough people open their link…"
                  className="w-full px-4 py-3 pr-20 rounded-xl border border-gray-300 bg-gray-50 font-medium placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition resize-none"
                />
                <span className="absolute right-3 bottom-2 text-xs text-gray-400">
                  {contentCount}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tip: Keep it concise and intriguing. You can edit later.
              </p>
            </div>

            {/* Unlocks Needed */}
            <div>
              <label htmlFor="unlocks-needed" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                Required Unlocks
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="unlocks-needed"
                  type="number"
                  value={unlocksNeeded}
                  onChange={(e) => setUnlocksNeeded(Math.min(10, Math.max(1, Number(e.target.value || 1))))}
                  min={1}
                  max={10}
                  required
                  className="w-28 px-4 py-2 rounded-xl border border-gray-300 bg-gray-50 font-semibold text-center focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                />
                <span className="text-xs text-gray-500">
                  People who must open a link generated from your share to reveal the message.
                </span>
              </div>
            </div>

            {/* Info / Error */}
            <div className="grid gap-3">
              <div className="text-xs text-gray-500">
                Visibility duration depends on your plan (Free: 48h · Growth: 7d · Pro: 30d).
              </div>
              {error && (
                <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                  <FiAlertCircle className="mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !title.trim() || !content.trim()}
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-tr from-blue-600 to-red-500 hover:from-red-600 hover:to-orange-400 font-semibold text-white shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Creating…" : "Create Message"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
