"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

const MessageCard = ({ msg, onShare }) => (
  <div className="bg-white/80 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-xl rounded-2xl p-6 flex flex-col gap-4 transition hover:scale-[1.01]">
    <div>
      <h2 className="font-bold text-lg mb-1 text-gray-900 dark:text-gray-50 truncate">{msg.title}</h2>
      <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{msg.content}</p>
    </div>
    <div className="flex items-center justify-between gap-2 mt-2">
      <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold shadow-sm">
        Unlocks needed: {msg.unlocks_needed}
      </span>
      <div className="flex gap-2">
        <Link href={`/messages/edit/${msg.id}`} className="px-3 py-1 rounded-lg text-xs font-semibold bg-orange-100 hover:bg-orange-200 text-orange-600 transition">Edit</Link>
        <button
          onClick={() => onShare(msg)}
          className="px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-500 to-red-400 hover:from-blue-600 hover:to-red-500 text-white shadow transition"
        >
          Start Sharing
        </button>
        <Link href={`/messages/analytics/${msg.id}`} className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-100 hover:bg-purple-200 text-purple-600 transition">Analytics</Link>
        <Link href={`/messages/delete/${msg.id}`} className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-500 transition">Delete</Link>
      </div>
    </div>
  </div>
);

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; message: any }>({ open: false, message: null });
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setMessages(data || []))
      .finally(() => setLoading(false));
  }, [user]);

  const handleShare = (msg) => {
    setModal({ open: true, message: msg });
  };

  const closeModal = () => setModal({ open: false, message: null });

  // Generate the share URL for a message (customize as needed)
  const getShareUrl = (id: string) => `${process.env.NEXT_PUBLIC_BASE_URL || "https://tapforward.app"}/m/${id}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-tr from-red-600 via-orange-500 to-blue-600 text-transparent bg-clip-text">
          Messages
        </h1>
        <Link
          href="/messages/new"
          className="inline-block py-3 px-6 rounded-xl bg-gradient-to-tr from-blue-600 to-red-500 hover:from-red-600 hover:to-orange-400 font-semibold text-white shadow-lg text-lg transition-all"
        >
          + Create New Message
        </Link>
      </div>
      {loading ? (
        <div className="text-center text-gray-500 py-16">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {messages.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
              You haven’t created any messages yet.
            </div>
          ) : (
            messages.map((msg) => (
              <MessageCard key={msg.id} msg={msg} onShare={handleShare} />
            ))
          )}
        </div>
      )}

      {/* Share Modal */}
      {modal.open && (
        <ShareModal
          message={modal.message}
          url={getShareUrl(modal.message.id)}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

// Share Modal Component
function ShareModal({ message, url, onClose }: { message: any; url: string; onClose: () => void }) {
  // Sharing URLs
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`Unlock this message: ${url}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl">&times;</button>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-50">Share Message</h2>
        <div className="mb-4">
          <input
            readOnly
            className="w-full border px-3 py-2 rounded font-mono bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-200"
            value={url}
            onFocus={e => e.target.select()}
          />
          <button
            className="mt-2 w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition"
            onClick={() => {
              navigator.clipboard.writeText(url);
              alert("Link copied to clipboard!");
            }}
          >
            Copy Link
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <a
            href={`https://wa.me/?text=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-100 text-green-700 font-semibold hover:bg-green-200"
          >
            <svg width={20} height={20} fill="none" viewBox="0 0 24 24"><path d="M12 3C7.03 3 3 7.03 3 12c0 1.42.37 2.75 1.02 3.89L3 21l5.2-1.34A8.96 8.96 0 0 0 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9Zm0 2c3.87 0 7 3.13 7 7a7 7 0 0 1-8.19 6.92l-.47-.11-3.08.8.82-3-.19-.47A7 7 0 0 1 5 12c0-3.87 3.13-7 7-7Zm3.34 10.14c-.28.56-.81 1.02-1.48 1.15-.4.08-.91.15-2.62-.54a7.15 7.15 0 0 1-2.17-1.4 7.15 7.15 0 0 1-1.41-2.18c-.53-1.22-.06-1.87.5-2.09.5-.2.87-.09 1.15.38.28.46.46 1.2.5 1.28.12.25.22.44.41.57.2.14.33.12.57.05.16-.04.59-.25 1.1-.69.52-.45.91-.5 1.23-.39.44.15.73.61.82.97.1.4.02.78-.19 1.12Z" fill="#25D366"/></svg>
            WhatsApp
          </a>
          <a
            href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200"
          >
            <svg width={20} height={20} fill="none" viewBox="0 0 24 24"><path d="M21.05 4.63 3.56 11.07c-1.39.52-1.38 1.24-.25 1.56l3.53 1.1 1.36 4.23c.18.55.31.76.66.84.35.07.56-.07.78-.34l2.01-2.19 4.17 3.08c.76.42 1.3.2 1.48-.7l2.52-11.62c.25-1.09-.41-1.59-1.32-1.09Z" fill="#229ED9"/></svg>
            Telegram
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100"
          >
            <svg width={20} height={20} fill="none" viewBox="0 0 24 24"><path d="M21 6.09c-.7.3-1.45.5-2.24.59a3.94 3.94 0 0 0 1.74-2.18c-.77.46-1.62.8-2.52.98A3.92 3.92 0 0 0 16.14 4c-2.15 0-3.9 1.74-3.9 3.9 0 .3.03.6.1.88A11.13 11.13 0 0 1 3.21 5.17a3.88 3.88 0 0 0-.53 1.96c0 1.35.69 2.53 1.75 3.22-.65-.02-1.25-.2-1.78-.5v.05c0 1.89 1.34 3.47 3.11 3.83-.33.09-.68.14-1.04.14-.25 0-.49-.02-.73-.07.5 1.54 1.94 2.65 3.64 2.68A7.85 7.85 0 0 1 2 19.54c-.26 0-.51-.01-.76-.04A11.1 11.1 0 0 0 8.29 21.5c7.24 0 11.21-6 11.21-11.2 0-.17 0-.35-.01-.52A7.72 7.72 0 0 0 21 6.09Z" fill="#1DA1F2"/></svg>
            X (Twitter)
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-200 text-blue-800 font-semibold hover:bg-blue-300"
          >
            <svg width={20} height={20} fill="none" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-7H7.9v-2.88h2.54v-2.2c0-2.5 1.5-3.89 3.78-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.86h2.78l-.44 2.88h-2.34v7C18.34 21.12 22 16.99 22 12Z" fill="#1877F3"/></svg>
            Facebook
          </a>
        </div>
      </div>
    </div>
  );
}
