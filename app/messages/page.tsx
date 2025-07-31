"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Message = {
  id: string;
  title: string;
  content: string;
  unlocks_needed: number;
  created_at: string;
};

const shareBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tapforward.com";

function ShareModal({
  open,
  onClose,
  message,
}: {
  open: boolean;
  onClose: () => void;
  message: Message | null;
}) {
  const [copied, setCopied] = useState(false);
  if (!open || !message) return null;
  const link = `${shareBaseUrl}/m/${message.id}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 flex flex-col gap-4"
        style={{
          maxWidth: "400px",
          marginLeft: "10px",
          marginRight: "10px",
        }}
      >
        <h3 className="text-lg font-bold mb-2">Share Your Message</h3>
        <div className="flex flex-col gap-3">
          <div className="bg-gray-100 dark:bg-neutral-800 rounded px-3 py-2 flex items-center justify-between">
            <span className="truncate text-gray-700 dark:text-gray-200">{link}</span>
            <button
              className="ml-3 px-2 py-1 bg-blue-600 text-white rounded font-semibold text-xs hover:bg-blue-700 transition"
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="flex gap-3 mt-2 flex-wrap">
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=Check out my viral message on TapForward!`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded px-3 py-2 text-sm flex items-center gap-2"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M21.5 7.1c.01.14.01.29.01.43 0 4.42-3.37 9.53-9.53 9.53-1.89 0-3.65-.56-5.13-1.51.26.03.52.05.78.05 1.57 0 3.01-.54 4.16-1.44-1.47-.03-2.71-1-3.14-2.34.2.03.41.06.63.06.3 0 .59-.04.87-.12-1.54-.31-2.7-1.67-2.7-3.3v-.04c.45.25.96.4 1.5.42A3.33 3.33 0 0 1 4.6 5.44c0-.02 0-.03.01-.05 1.81 1.01 3.89 1.63 6.12 1.7-.06-.23-.09-.46-.09-.7 0-1.68 1.36-3.04 3.04-3.04.87 0 1.66.37 2.21.96.69-.13 1.34-.38 1.92-.72a3.1 3.1 0 0 1-1.34 1.68c.61-.07 1.2-.23 1.74-.47A6.6 6.6 0 0 1 21.5 7.1z" /></svg>
              Share on X
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded px-3 py-2 text-sm flex items-center gap-2"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M13.005 22.936v-9.073h3.041l.456-3.541h-3.497v-2.263c0-1.024.285-1.721 1.758-1.721h1.881V3.092c-.326-.043-1.445-.141-2.746-.141-2.716 0-4.58 1.66-4.58 4.709v2.662H5.003v3.541h3.315v9.073h4.687z" /></svg>
              Facebook
            </a>
            <a
              href={`mailto:?subject=Check%20this%20out&body=${encodeURIComponent(link)}`}
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded px-3 py-2 text-sm flex items-center gap-2"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 13.065 2 6.535V18h20V6.535l-10 6.53zm10-9.03v.01l-10 6.53-10-6.53V4.035C2 2.929 2.928 2 4.035 2h15.93A2.036 2.036 0 0 1 22 4.035z" /></svg>
              Email
            </a>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-2 px-5 py-2 w-full rounded-lg font-semibold bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 text-gray-800 dark:text-gray-100 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function MessageCard({
  msg,
  onShare,
  onEdit,
  onDelete,
}: {
  msg: Message;
  onShare: (msg: Message) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white/80 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-xl rounded-2xl p-6 flex flex-col gap-4 transition hover:scale-[1.01]">
      <div>
        <h2 className="font-bold text-lg mb-1 text-gray-900 dark:text-gray-50 truncate">{msg.title}</h2>
        <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{msg.content}</div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 font-semibold">
            {msg.unlocks_needed} unlock{msg.unlocks_needed !== 1 && "s"} needed
          </span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-400">{new Date(msg.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        <button
          onClick={() => onShare(msg)}
          className="mt-3 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold px-4 py-2 rounded shadow transition"
        >
          Start Sharing
        </button>
        <button
          onClick={() => onEdit(msg.id)}
          className="px-4 py-2 rounded-lg font-semibold border border-blue-400 text-blue-600 bg-white hover:bg-blue-50 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(msg.id)}
          className="px-4 py-2 rounded-lg font-semibold border border-red-400 text-red-600 bg-white hover:bg-red-50 transition"
        >
          Delete
        </button>
        <Link
          href={`/messages/analytics/${msg.id}`}
          className="mt-3 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold px-4 py-2 rounded shadow transition"
        >
          Analytics
        </Link>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareModal, setShareModal] = useState<{ open: boolean; message: Message | null }>({ open: false, message: null });
  const router = useRouter();

  useEffect(() => {
    // Fetch messages for the user
    async function fetchMessages() {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setMessages(data as Message[]);
      setLoading(false);
    }
    fetchMessages();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this message?")) return;
    await supabase.from("messages").delete().eq("id", id);
    setMessages((msgs) => msgs.filter((m) => m.id !== id));
  }

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-gray-50 to-red-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-red-600">Your Messages</h1>
          <Link
            href="/messages/new"
            className="mt-3 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold px-4 py-2 rounded shadow transition text-lg"
          >
            + Create New Message
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-16">Loading…</div>
        ) : messages.length === 0 ? (
          <div className="bg-white/80 dark:bg-neutral-900 rounded-2xl p-8 text-center shadow">
            <h2 className="text-xl font-semibold mb-2">No messages yet.</h2>
            <p className="text-gray-500 mb-4">Create your first message and start sharing!</p>
            <Link
              href="/messages/new"
              className="mt-3 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold px-4 py-2 rounded shadow transition"
            >
              Create New Message
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {messages.map((msg) => (
              <MessageCard
                key={msg.id}
                msg={msg}
                onShare={(m) => setShareModal({ open: true, message: m })}
                onEdit={(id) => router.push(`/messages/edit/${id}`)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Share Modal */}
        <ShareModal
          open={shareModal.open}
          onClose={() => setShareModal({ open: false, message: null })}
          message={shareModal.message}
        />
      </div>
    </div>
  );
}
