"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EditMessagePage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [unlocksNeeded, setUnlocksNeeded] = useState(2);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessage() {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (data) {
        setTitle(data.title || "");
        setContent(data.content || "");
        setUnlocksNeeded(data.unlocks_needed || 2);
      }
      setLoading(false);
      if (error) setError(error.message);
    }
    fetchMessage();
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from("messages")
      .update({
        title,
        content,
        unlocks_needed: unlocksNeeded,
        updated_at: new Date(),
      })
      .eq("id", id);

    setSaving(false);
    if (error) return setError(error.message);
    router.push("/messages");
  }

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Message</h1>
      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Message Content</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Unlocks Needed</label>
          <input
            type="number"
            className="w-24 border px-3 py-2 rounded"
            value={unlocksNeeded}
            onChange={(e) => setUnlocksNeeded(Number(e.target.value))}
            min={1}
            max={10}
            required
          />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-6 py-2 font-bold"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
