"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext"; // <-- import this!
import { supabase } from "@/lib/supabaseClient";

export default function CreateMessagePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [unlocksNeeded, setUnlocksNeeded] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth(); // <-- get user

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user) {
      setError("You must be logged in to create a message.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("messages")
      .insert([{
        user_id: user.id, // <-- must include!
        title,
        content,
        unlocks_needed: unlocksNeeded
      }])
      .select()
      .single();

    setLoading(false);

    if (error) return setError(error.message);
    router.push("/messages");
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Message</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={60}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Message Content</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={content}
            onChange={e => setContent(e.target.value)}
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
            onChange={e => setUnlocksNeeded(Number(e.target.value))}
            min={1}
            max={10}
            required
          />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-6 py-2 font-bold"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Message"}
        </button>
      </form>
    </div>
  );
}
