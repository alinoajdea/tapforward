"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { generateUniqueSlug } from "@/lib/slugify";
import MarkdownEditor from "@/components/MarkdownEditor";

// strip tags to count visible characters
function htmlToPlain(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function CreateMessagePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [contentHtml, setContentHtml] = useState(""); // HTML from Quill
  const [unlocksNeeded, setUnlocksNeeded] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleCount = `${title.length}/60`;
  const contentPlain = useMemo(() => htmlToPlain(contentHtml), [contentHtml]);
  const contentCount = `${contentPlain.length}/500`;

  const slugPreview = useMemo(() => {
    if (!title.trim()) return "";
    try {
      return generateUniqueSlug(title);
    } catch {
      return "";
    }
  }, [title]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("You must be logged in to create a message.");
      return;
    }
    if (!title.trim() || contentPlain.length === 0) {
      setError("Please fill in the title and content.");
      return;
    }
    if (contentPlain.length > 500) {
      setError("Please keep the content under 500 characters.");
      return;
    }

    setLoading(true);
    try {
      const slug = generateUniqueSlug(title);

      const { error: insertError } = await supabase.from("messages").insert([
        {
          user_id: user.id,
          title,
          content: contentHtml, // save HTML
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
    <div className="min-h-screen flex items-start sm:items-center justify-center bg-gradient-to-br from-white via-orange-50 to-blue-50 pt-10 sm:pt-0">
      <div
        className="
          bg-white p-8 w-full max-w-3xl
          sm:rounded-2xl sm:shadow-2xl sm:border sm:border-gray-100
          rounded-none shadow-none border-none
          min-h-screen sm:min-h-fit
          flex flex-col justify-center
        "
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-600 mb-2 text-center">
            Create new message
          </h1>
          <p className="text-gray-500 text-base text-center max-w-xl">
            Share a message that unlocks after enough people open your link.
          </p>
          {!!slugPreview && (
            <div className="mt-3 text-xs text-gray-500">
              Preview slug:&nbsp;
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                {slugPreview}
              </span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <div className="relative">
              <input
                id="title"
                type="text"
                required
                maxLength={60}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition placeholder-gray-400"
                placeholder="Give your message a compelling title"
                autoFocus
                disabled={loading}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {titleCount}
              </span>
            </div>
          </div>

          {/* Content (Quill) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message content
            </label>

            <MarkdownEditor
              value={contentHtml}
              onChange={setContentHtml}
              placeholder="What will they unlock when enough people open their link?"
            />

            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                Rich text supported (bold, italic, lists, links).
              </p>
              <span
                className={`text-xs ${
                  contentPlain.length > 500 ? "text-red-600" : "text-gray-400"
                }`}
              >
                {contentCount}
              </span>
            </div>
          </div>

          {/* Unlocks Needed */}
          <div>
            <label
              htmlFor="unlocks"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Required unlocks
            </label>
            <div className="flex items-center gap-3">
              <input
                id="unlocks"
                type="number"
                min={1}
                max={10}
                required
                value={unlocksNeeded}
                onChange={(e) =>
                  setUnlocksNeeded(
                    Math.min(10, Math.max(1, Number(e.target.value || 1)))
                  )
                }
                className="w-28 px-4 py-2 rounded-lg border border-gray-300 bg-white font-semibold text-center focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition"
                disabled={loading}
              />
              <span className="text-xs text-gray-500">
                How many unique viewers of your shared link are required to
                reveal the message.
              </span>
            </div>
          </div>

          {/* Info / Error */}
          <div className="grid gap-3">
            <p className="text-xs text-gray-500">
              Visibility depends on your plan: Free 48h • Growth 7d • Pro 30d.
            </p>
            {error && (
              <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* CTA */}
          <button
            type="submit"
            disabled={
              loading ||
              !title.trim() ||
              contentPlain.length === 0 ||
              contentPlain.length > 500
            }
            className="w-full py-2 px-4 rounded-lg bg-gradient-to-tr from-blue-600 to-red-500 hover:from-red-600 hover:to-orange-400 font-semibold text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating…" : "Create Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
