"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import { useSubscription } from "@/lib/useSubscription";
import { createForward } from "@/lib/createForward";
import styles from "./MessagesPage.module.css";
import {
  FaWhatsapp,
  FaFacebookF,
  FaLinkedinIn,
  FaEnvelope,
  FaFacebookMessenger,
  FaShareAlt,
  FaEdit,
  FaTrash,
  FaChartBar,
  FaLock,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiPlusCircle } from "react-icons/fi";

function htmlToPlain(html: string) {
  return (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function previewText(html: string, max = 120) {
  const t = htmlToPlain(html);
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

type Message = {
  id: string;
  slug: string;
  title: string;
  content: string;
  unlocks_needed: number;
  created_at: string;
  deleted_at?: string | null;
};

const PLAN_LIMITS: Record<
  string,
  { maxMessages: number; visibilityH: number }
> = {
  free: { maxMessages: 1, visibilityH: 12 },
  growth: { maxMessages: 3, visibilityH: 24 },
  pro: { maxMessages: 6, visibilityH: 72 },
};

const shareBaseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://tapforward.com";

function isCampaignFinished(createdAt: string, visibilityH: number) {
  const created = new Date(createdAt);
  const end = new Date(created.getTime() + visibilityH * 60 * 60 * 1000);
  return new Date() > end;
}

/** =========================
 * Share Modal
 * ========================= */
function ShareModal({
  open,
  onClose,
  message,
}: {
  open: boolean;
  onClose: () => void;
  message: Message | null;
}) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    async function createShareLink() {
      if (!open || !message) {
        setShareLink("");
        return;
      }
      try {
        const refCode = await createForward(message.id, user?.id || null);
        if (cancelled) return;
        setShareLink(`${shareBaseUrl}/m/${message.slug}?ref=${refCode}`);
      } catch {
        if (cancelled) return;
        setShareLink(`${shareBaseUrl}/m/${message.slug}`);
      }
    }
    createShareLink();
    return () => {
      cancelled = true;
    };
  }, [open, message, user]);

  if (!open || !message) return null;
  const shareText = message.title;
  const encodedUrl = encodeURIComponent(
    shareLink || `${shareBaseUrl}/m/${message.slug}`
  );
  const encodedTitle = encodeURIComponent(shareText);

  async function handleCopy() {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 flex flex-col gap-4">
        <h3 className="text-lg font-bold mb-2">Share Your Message</h3>

        {/* Your link */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your link to share:
          </label>
          <div className="bg-gray-100 rounded px-3 py-2 flex items-center justify-between">
            <span className="truncate text-gray-700">
              {shareLink || `${shareBaseUrl}/m/${message.slug}`}
            </span>
            <button
              className="ml-3 px-2 py-1 bg-blue-600 text-white rounded font-semibold text-xs hover:bg-blue-700 transition"
              onClick={handleCopy}
              disabled={!shareLink}
              title={!shareLink ? "Generating your unique link…" : "Copy link"}
            >
              {copied ? "Copied!" : shareLink ? "Copy" : "…"}
            </button>
          </div>
        </div>

        {/* Social buttons */}
        <div>
          <div className="text-center font-semibold mb-3 text-gray-700">
            Share it on social:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <a
              href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium shadow transition"
            >
              <FaWhatsapp /> WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow transition"
            >
              <FaFacebookF /> Facebook
            </a>
            <a
              href={`https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-900 text-white font-medium shadow transition"
            >
              <FaXTwitter /> X
            </a>
            <a
              href={`https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=${process.env.NEXT_PUBLIC_FB_APP_ID}&redirect_uri=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium shadow transition"
            >
              <FaFacebookMessenger /> Messenger
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium shadow transition"
            >
              <FaLinkedinIn /> LinkedIn
            </a>
            <a
              href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium shadow transition"
            >
              <FaEnvelope /> Email
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

/** =========================
 * Message Card
 * ========================= */
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
  const campaignFinished = isCampaignFinished(
    msg.created_at,
    limits.visibilityH
  );

  return (
    <div className="bg-white/80 border border-gray-100 shadow-xl rounded-2xl p-6 flex flex-col gap-4 transition hover:scale-[1.01] relative">
      {campaignFinished && (
        <span
          className={`absolute top-0 bg-gray-300 text-gray-700 px-3 py-1 font-bold text-xs shadow ${styles["campaign-finished-badge"]}`}
        >
          Campaign Finished
        </span>
      )}

      {/* Title + Content */}
      <div>
        <h2 className="font-bold text-lg mb-1 text-gray-900 truncate">
          {msg.title}
        </h2>
        <div className="text-sm text-gray-600 line-clamp-2">
          {previewText(msg.content, 140)}
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 font-semibold">
            {msg.unlocks_needed} unlock{msg.unlocks_needed !== 1 && "s"} needed
          </span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-400">
            {new Date(msg.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mt-3">
        <button
          onClick={() => onShare(msg)}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 border text-green-600 font-medium px-4 py-2 rounded-lg shadow-sm transition text-sm hover:bg-green-50 ${
            campaignFinished
              ? "opacity-50 cursor-not-allowed"
              : "border-gray-300 bg-white"
          }`}
          disabled={campaignFinished}
        >
          <FaShareAlt />
          {campaignFinished ? "Expired" : "Share"}
        </button>

        <button
          onClick={() => onEdit(msg.id)}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 border border-gray-300 text-blue-600 font-medium px-4 py-2 rounded-lg shadow-sm transition text-sm bg-white hover:bg-blue-50"
        >
          <FaEdit />
          Edit
        </button>

        <button
          onClick={() => onDelete(msg.id)}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 border border-gray-300 text-red-600 font-medium px-4 py-2 rounded-lg shadow-sm transition text-sm bg-white hover:bg-red-50"
        >
          <FaTrash />
          Delete
        </button>

        {plan === "pro" ? (
          <Link
            href={`/messages/analytics/${msg.id}`}
            className="flex-1 min-w-[120px] flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg shadow-sm transition text-sm bg-white hover:bg-gray-50"
          >
            <FaChartBar />
            Analytics
          </Link>
        ) : (
          <button
            disabled
            className="flex-1 min-w-[120px] flex items-center justify-center gap-2 border border-gray-300 text-gray-400 font-medium px-4 py-2 rounded-lg shadow-sm transition text-sm bg-white opacity-60"
            title="Upgrade to Pro for Analytics"
          >
            <FaLock />
            Analytics <span className="text-red-500 text-xs">(Pro)</span>
          </button>
        )}
      </div>
    </div>
  );
}

/** =========================
 * Page
 * ========================= */
export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const { subscription } = useSubscription();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareModal, setShareModal] = useState<{
    open: boolean;
    message: Message | null;
  }>({
    open: false,
    message: null,
  });
  const router = useRouter();

  const plan = subscription?.plan || "free";
  const limits = PLAN_LIMITS[plan];

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const messagesThisMonth = messages.filter(
    (m) => new Date(m.created_at) > monthStart
  ).length;

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace("/auth/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    async function fetchMessages() {
      setLoading(true);
      const { data } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setMessages(data as Message[]);
      setLoading(false);
    }
    fetchMessages();
  }, [user]);

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
          <h1 className="text-3xl font-extrabold text-gray-600">
            Your Messages
          </h1>

          <button
            onClick={() => router.push("/messages/new")}
            disabled={!canCreateNew}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gradient-to-tr from-blue-600 to-red-500 hover:from-red-600 hover:to-orange-400 font-semibold text-white shadow-lg transition-all ${
              !canCreateNew ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title={
              !canCreateNew
                ? `Limit reached: ${limits.maxMessages} messages/month`
                : ""
            }
          >
            <FiPlusCircle className="w-5 h-5" />
            {!canCreateNew
              ? `Limit reached (${limits.maxMessages}/month)`
              : "New Message"}
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-16">Loading…</div>
        ) : messages.filter((m) => !m.deleted_at).length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-8 text-center shadow">
            <h2 className="text-xl font-semibold mb-2">No messages yet.</h2>
            <p className="text-gray-500 mb-4">
              Create your first message and start sharing!
            </p>
            <button
              onClick={() => router.push("/messages/new")}
              disabled={!canCreateNew}
              className={`w-full py-2 px-4 rounded-lg bg-gradient-to-tr from-blue-600 to-red-500 hover:from-red-600 hover:to-orange-400 font-semibold text-white shadow-lg transition-all ${
                !canCreateNew ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {!canCreateNew
                ? `Limit reached (${limits.maxMessages}/month)`
                : "Create New Message"}
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
