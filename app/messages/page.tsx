"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import { useSubscription } from "@/lib/useSubscription";
import { createForward } from "@/lib/createForward";
import styles from './MessagesPage.module.css';

type Message = {
  id: string;
  slug: string;
  title: string;
  content: string;
  unlocks_needed: number;
  created_at: string;
  deleted_at?: string | null;
};

const PLAN_LIMITS: Record<string, { maxMessages: number; visibilityH: number }> = {
  free: { maxMessages: 1, visibilityH: 12 },
  growth: { maxMessages: 3, visibilityH: 24 },
  pro: { maxMessages: 6, visibilityH: 72 },
};

const shareBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tapforward.com";

function isCampaignFinished(createdAt: string, visibilityH: number) {
  const created = new Date(createdAt);
  const end = new Date(created.getTime() + visibilityH * 60 * 60 * 1000);
  return new Date() > end;
}

function ShareModal({
  open,
  onClose,
  message,
}: {
  open: boolean;
  onClose: () => void;
  message: Message | null;
}) {
  const { user } = useAuth(); // To get sender id for forwards
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState<string>("");

  useEffect(() => {
    if (!open || !message) return;
    // Generate a forward record and update share link
    async function createShareLink() {
      try {
        if (!message) return;
        const refCode = await createForward(message.id, user?.id || null);
        setShareLink(`${shareBaseUrl}/m/${message.slug}?ref=${refCode}`);
      } catch (err) {
        // fallback to normal share link if something fails
        setShareLink(`${shareBaseUrl}/m/${message.slug}`);
      }
    }
    createShareLink();
    // eslint-disable-next-line
  }, [open, message]);

  if (!open || !message) return null;
  const shareText = message.title;

  async function handleCopy() {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 flex flex-col gap-4"
        style={{
          maxWidth: "400px",
          marginLeft: "10px",
          marginRight: "10px",
        }}
      >
        <h3 className="text-lg font-bold mb-2">Share Your Message</h3>
        <div className="flex flex-col gap-3">
          <div className="bg-gray-100 rounded px-3 py-2 flex items-center justify-between">
            <span className="truncate text-gray-700">{shareLink}</span>
            <button
              className="ml-3 px-2 py-1 bg-blue-600 text-white rounded font-semibold text-xs hover:bg-blue-700 transition"
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded px-3 py-2 text-sm flex items-center gap-2"
            >
              WhatsApp
            </a>
            {/* Telegram */}
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded px-3 py-2 text-sm flex items-center gap-2"
            >
              Telegram
            </a>
            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}&quote=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded px-3 py-2 text-sm flex items-center gap-2"
            >
              Facebook
            </a>
            {/* X / Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded px-3 py-2 text-sm flex items-center gap-2"
            >
              Share on X
            </a>
            {/* Messenger */}
            <a
              href={`https://www.messenger.com/share?link=${encodeURIComponent(shareLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0084FF] hover:bg-[#006ee6] text-white font-semibold rounded px-3 py-2 text-sm flex items-center gap-2"
            >
              Messenger
            </a>
            {/* Email */}
            <a
              href={`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareLink)}`}
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded px-3 py-2 text-sm flex items-center gap-2"
            >
              Email
            </a>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-2 px-5 py-2 w-full rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
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
  plan,
}: {
  msg: Message;
  onShare: (msg: Message) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  plan: string;
}) {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS["free"];
  const campaignFinished = isCampaignFinished(msg.created_at, limits.visibilityH);

  return (
    <div className="bg-white/80 border border-gray-100 shadow-xl rounded-2xl p-6 flex flex-col gap-4 transition hover:scale-[1.01] relative">
      {campaignFinished && (
        <span className={`absolute top-0 bg-gray-300 text-gray-700 px-3 py-1 font-bold text-xs shadow ${styles['campaign-finished-badge']}`}>
          Campaign Finished
        </span>
      )}
      <div>
        <h2 className="font-bold text-lg mb-1 text-gray-900 truncate">{msg.title}</h2>
        <div className="text-sm text-gray-600 line-clamp-2">{msg.content}</div>
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
          className="flex-1 min-w-[120px] border border-gray-300 text-green-600 font-bold px-4 py-2 rounded shadow transition text-base bg-white hover:bg-green-50"
          disabled={campaignFinished}
        >
          {campaignFinished ? "Expired" : "Start Sharing"}
        </button>
        <button
          onClick={() => onEdit(msg.id)}
          className="flex-1 min-w-[120px] border border-gray-300 text-blue-600 font-bold px-4 py-2 rounded shadow transition text-base bg-white hover:bg-blue-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(msg.id)}
          className="flex-1 min-w-[120px] border border-gray-300 text-red-600 font-bold px-4 py-2 rounded shadow transition text-base bg-white hover:bg-red-50"
        >
          Delete
        </button>
        {plan === "pro" ? (
          <Link
            href={`/messages/analytics/${msg.id}`}
            className="flex-1 min-w-[120px] border border-gray-300 text-gray-700 font-bold px-4 py-2 rounded shadow transition text-base bg-white hover:bg-gray-50 text-center"
          >
            Analytics
          </Link>
        ) : (
          <button
          disabled
          className="flex-1 min-w-[120px] border border-gray-300 text-gray-400 font-bold px-4 py-2 rounded shadow transition text-base bg-white text-center opacity-60 flex items-center justify-center gap-1"
          title="Upgrade to Pro for Analytics"
        >
          Analytics
          <span className="text-red-500 text-xs ml-1 font-normal">(Pro Only)</span>
        </button>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const { subscription } = useSubscription();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareModal, setShareModal] = useState<{ open: boolean; message: Message | null }>({ open: false, message: null });
  const router = useRouter();

  const plan = subscription?.plan || "free";
  const limits = PLAN_LIMITS[plan];

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Always count all messages created this month, even soft deleted
  const messagesThisMonth = messages.filter(
    m => new Date(m.created_at) > monthStart
  ).length;

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace("/auth/login");
  }, [user, authLoading, router]);

  // Fetch all messages (including deleted) for quota, only show not deleted
  useEffect(() => {
    if (!user) return;
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
  }, [user]);

  // SOFT DELETE: just set deleted_at!
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this message?")) return;
    const nowIso = new Date().toISOString();
    await supabase.from("messages").update({ deleted_at: nowIso }).eq("id", id);
    setMessages((msgs) =>
      msgs.map((m) => (m.id === id ? { ...m, deleted_at: nowIso } : m))
    );
  }

  const canCreateNew = messagesThisMonth < limits.maxMessages;

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-gray-50 to-red-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-600">Your Messages</h1>
          <button
            onClick={() => router.push("/messages/new")}
            disabled={!canCreateNew}
            className={`mt-3 bg-gradient-to-tr from-blue-600 to-red-500 hover:from-red-600 hover:to-orange-400 font-semibold text-white px-4 py-2 rounded shadow transition text-lg
              ${!canCreateNew ? "opacity-50 cursor-not-allowed" : ""}`}
            title={!canCreateNew ? `Limit reached: ${limits.maxMessages} messages/month` : ""}
          >
            {!canCreateNew ? `Limit reached (${limits.maxMessages}/month)` : "+ Create New Message"}
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-16">Loading…</div>
        ) : messages.filter((m) => !m.deleted_at).length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-8 text-center shadow">
            <h2 className="text-xl font-semibold mb-2">No messages yet.</h2>
            <p className="text-gray-500 mb-4">Create your first message and start sharing!</p>
            <button
              onClick={() => router.push("/messages/new")}
              disabled={!canCreateNew}
              className={`mt-3 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold px-4 py-2 rounded shadow transition
                ${!canCreateNew ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {!canCreateNew ? `Limit reached (${limits.maxMessages}/month)` : "Create New Message"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {messages
              .filter((msg) => !msg.deleted_at)
              .map((msg) => (
                <MessageCard
                  key={msg.id}
                  msg={msg}
                  plan={plan}
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
