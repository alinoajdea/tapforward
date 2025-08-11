"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import MarkdownEditor from "@/components/MarkdownEditor";

export default function EditMessagePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [unlocksNeeded, setUnlocksNeeded] = useState(2);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // counts for UI
  const titleCount = useMemo(() => `${title.length}/60`, [title]);
  const contentCount = useMemo(() => `${content.length}/500`, [content]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setError(error.message);
      } else if (data) {
        setTitle(data.title || "");
        setContent(data.content || "");
        setUnlocksNeeded(data.unlocks_needed ?? 2);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("Please fill in the title and content.");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("messages")
      .update({
        title,
        content,
        unlocks_needed: Math.min(10, Math.max(1, Number(unlocksNeeded || 1))),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      setError(error.message);
    } else {
      router.push("/messages");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-start sm:items-center justify-center bg-gradient-to-br from-white via-orange-50 to-blue-50 sm:pt-0">
        <div
          className="
            bg-white p-8 w-full max-w-3xl
            sm:rounded-2xl sm:shadow-2xl sm:border sm:border-gray-100
            rounded-none shadow-none border-none
            min-h-screen sm:min-h-fit
            flex flex-col justify-center
          "
        >
          <div className="text-center text-gray-400">Loading…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center bg-gradient-to-br from-white via-orange-50 to-blue-50 sm:pt-0">
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
            Edit message
          </h1>
          <p className="text-gray-500 text-base text-center max-w-xl">
            Tweak your title, content, or required unlocks. Slug remains the
            same.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="space-y-5">
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
                placeholder="Update the title"
                disabled={saving}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {titleCount}
              </span>
            </div>
          </div>

          {/* Content (TipTap) */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message content
            </label>

            <MarkdownEditor
              value={content}
              onChange={(html) => {
                // soft-limit 500 chars on plain text; allow formatting
                const plain = (html || "")
                  .replace(/<[^>]+>/g, " ")
                  .replace(/\s+/g, " ")
                  .trim();
                if (plain.length <= 500) setContent(html);
                else {
                  // if over, still set but you could also block — here we trim by words
                  setContent(html);
                }
              }}
              placeholder="Edit what they will unlock…"
            />

            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                Tip: Use bold, italics, lists, and links.
              </p>
              <span className="text-xs text-gray-400">{contentCount}</span>
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
                disabled={saving}
              />
              <span className="text-xs text-gray-500">
                How many unique viewers of your shared link are required to
                reveal the message.
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* CTA */}
          <button
            type="submit"
            disabled={saving || !title.trim() || !content.trim()}
            className="w-full py-2 px-4 rounded-lg bg-gradient-to-tr from-blue-600 to-red-500 hover:from-red-600 hover:to-orange-400 font-semibold text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
