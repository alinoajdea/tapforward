"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useSubscription } from "@/lib/useSubscription";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const router = useRouter();

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const plan = subscription?.plan || "free";
  const canSeeAnalytics = plan === "pro";

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setMessages(data || []);
        setLoading(false);
      });
  }, [user]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this message?")) return;
    setDeleting(id);
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (!error) setMessages(msgs => msgs.filter(m => m.id !== id));
    setDeleting(null);
    if (error) setError(error.message);
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center text-gray-500">
        Please <Link href="/auth/login" className="text-blue-600 underline">log in</Link> to see your messages.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-tr from-red-600 via-orange-500 to-blue-600 text-transparent bg-clip-text">
          Your Messages
        </h1>
        <Link
          href="/messages/new"
          className="py-2 px-5 rounded-lg bg-gradient-to-tr from-blue-600 to-red-500 hover:from-red-600 hover:to-orange-400 font-semibold text-white shadow-lg text-base transition"
        >
          + New Message
        </Link>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <div className="text-gray-400 text-center py-10">Loading…</div>
      ) : messages.length === 0 ? (
        <div className="text-gray-500 text-center py-10">No messages yet. Start by creating one!</div>
      ) : (
        <div className="rounded-xl shadow border bg-white overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-left text-sm font-bold">
                <th className="py-3 px-5">Title</th>
                <th className="py-3 px-5">Unlocks</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg.id} className="border-t">
                  <td className="py-3 px-5">
                    <Link href={`/m/${msg.id}`} className="text-blue-600 underline font-semibold">
                      {msg.title || "Untitled"}
                    </Link>
                  </td>
                  <td className="py-3 px-5">{msg.unlocks || 0}</td>
                  <td className="py-3 px-5">
                    {msg.unlocks >= (msg.unlocks_needed || 1) ? (
                      <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs">
                        Unlocked
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-xs">
                        Locked
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-5 text-center">
                    <Link
                      href={`/messages/edit/${msg.id}`}
                      className="inline-block mr-2 text-blue-500 hover:underline font-medium"
                      title="Edit"
                    >
                      Edit
                    </Link>
                    {canSeeAnalytics && (
                      <Link
                        href={`/messages/analytics/${msg.id}`}
                        className="inline-block mr-2 text-purple-600 hover:underline font-medium"
                        title="Analytics"
                      >
                        Analytics
                      </Link>
                    )}
                    <button
                      onClick={() => handleDelete(msg.id)}
                      disabled={deleting === msg.id}
                      className="inline-block text-red-500 hover:underline font-medium"
                      title="Delete"
                    >
                      {deleting === msg.id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
