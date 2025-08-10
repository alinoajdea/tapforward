"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getAnonFingerprint, createForward } from "@/lib/createForward";
import {
  FaWhatsapp,
  FaFacebookF,
  FaFacebookMessenger ,
  FaXTwitter,
  FaEnvelope,
  FaLinkedinIn,
} from "react-icons/fa6";

const PLAN_DURATIONS: Record<string, number> = {
  free: 48 * 60 * 60 * 1000,
  growth: 7 * 24 * 60 * 60 * 1000,
  pro: 30 * 24 * 60 * 60 * 1000,
};

function formatTimeLeft(ms: number) {
  if (ms < 0) return "0:00:00";
  const d = Math.floor(ms / (24 * 60 * 60 * 1000));
  const h = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const m = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  const s = Math.floor((ms % (60 * 1000)) / 1000);
  return [
    d > 0 ? `${d}d` : null,
    `${h}`.padStart(2, "0"),
    `${m}`.padStart(2, "0"),
    `${s}`.padStart(2, "0"),
  ]
    .filter(Boolean)
    .join(":");
}

export default function ViewMessagePage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");

  const [message, setMessage] = useState<any>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<Date>(new Date());
  const [copied, setCopied] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [myShareLink, setMyShareLink] = useState<string>("");
  const [duplicateView, setDuplicateView] = useState(false);
  const [forwardId, setForwardId] = useState<string | null>(null);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || "https://www.tapforward.app";

  // ticking timer
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // fetch message
  useEffect(() => {
    async function fetchMessage() {
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!messageData || messageError) {
        setMessage(null);
        setLoading(false);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("subscription_plan")
        .eq("id", messageData.user_id)
        .single();

      const plan = profileData?.subscription_plan?.toLowerCase?.() || "free";
      const createdAt = new Date(messageData.created_at);
      const durationMs = PLAN_DURATIONS[plan] ?? PLAN_DURATIONS.free;
      setExpiresAt(new Date(createdAt.getTime() + durationMs));

      setMessage(messageData);
      setLoading(false);
    }

    fetchMessage();
  }, [slug]);

  // Track view + create threaded share link
  useEffect(() => {
    if (!message) return;

    async function handleForward() {
  try {
    if (!refCode) return;

    // Get parent forward
    const { data: fwd } = await supabase
      .from("forwards")
      .select("id, message_id, sender_id, anon_fingerprint")
      .eq("unique_code", refCode)
      .maybeSingle();

    if (!fwd) return;

    setForwardId(fwd.id);

    // Get current viewer fingerprint
    const viewer_fingerprint = await getAnonFingerprint();

    // Skip if viewer is the original creator of this forward
    if (fwd.anon_fingerprint === viewer_fingerprint) {
      console.log("Viewer is the creator — not counting as a new view.");
    } else {
      // Try insert view
      const { error: insErr } = await supabase
        .from("forward_views")
        .insert({
          forward_id: fwd.id,
          viewer_user_id: null,
          viewer_fingerprint,
        });

      if ((insErr as any)?.code === "23505") {
        setDuplicateView(true);
      }
    }

    // Update count immediately
    const { count } = await supabase
      .from("forward_views")
      .select("*", { count: "exact", head: true })
      .eq("forward_id", fwd.id);

    const vc = count ?? 0;
    setViewCount(vc);
    setUnlocked(vc >= (message.unlocks_needed ?? 0));

    // Generate child's share link only if not creator
    if (fwd.anon_fingerprint !== viewer_fingerprint) {
      const childCode = await createForward(message.id, null, refCode);
      setMyShareLink(`${baseUrl}/m/${message.slug}?ref=${childCode}`);
    } else {
      // Creator reuses same link
      setMyShareLink(`${baseUrl}/m/${message.slug}?ref=${refCode}`);
    }
  } catch (err) {
    console.error("Forward handling failed", err);
  }
}

    handleForward();
  }, [message, refCode, baseUrl]);

  // Real-time subscription for live unlock
  useEffect(() => {
    if (!forwardId) return;
    const channel = supabase
      .channel(`forward-${forwardId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "forward_views",
          filter: `forward_id=eq.${forwardId}`,
        },
        async () => {
          const { count } = await supabase
            .from("forward_views")
            .select("*", { count: "exact", head: true })
            .eq("forward_id", forwardId);
          const vc = count ?? 0;
          setViewCount(vc);
          setUnlocked(vc >= (message.unlocks_needed ?? 0));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [forwardId, message]);

  if (loading) return <div className="text-center py-20">Loading…</div>;
  if (!message)
    return (
      <div className="text-center py-20 text-red-500">Message not found.</div>
    );

  const isExpired = expiresAt ? now >= expiresAt : false;
  const timeLeft = expiresAt
    ? formatTimeLeft(expiresAt.getTime() - now.getTime())
    : "";

  const remainingShares = Math.max(
    (message.unlocks_needed ?? 0) - viewCount,
    0
  );
  const effectiveShare = myShareLink || `${baseUrl}/m/${slug}`;
  const encodedUrl = encodeURIComponent(effectiveShare);
  const encodedTitle = encodeURIComponent(
    message.title || "Unlock this TapForward message!"
  );

  const socialNetworks = [
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: <FaWhatsapp />,
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FaFacebookF />,
    },
    {
      name: "X",
      url: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <FaXTwitter />,
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      icon: <FaLinkedinIn />,
    },
  ];

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <h1 className="text-2xl font-extrabold text-center mb-4">
        {message.title || "Secret Message"}
      </h1>

      {!isExpired ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center shadow mb-8">
          <div className="text-2xl font-mono font-bold text-blue-700">
            {timeLeft}
          </div>
          <div className="mt-1 text-blue-700 text-sm">
            This message will expire in {timeLeft}
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center shadow mb-8">
          <div className="text-xl font-bold text-red-600">
            This message has expired.
          </div>
        </div>
      )}

      {duplicateView && !unlocked && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-3 mb-4 text-sm">
          You’ve already visited this link from this IP. Share it with new
          people to unlock.
        </div>
      )}

      {!isExpired && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow text-center mb-8">
          {unlocked ? (
            <div className="text-gray-700 text-lg whitespace-pre-wrap">
              {message.content}
            </div>
          ) : (
            <div className="text-gray-500 font-medium">
              Share it with <strong>{remainingShares}</strong> more{" "}
              {remainingShares === 1 ? "person" : "people"} to see the message.
              <br />({viewCount} of {message.unlocks_needed} unlocks reached)
            </div>
          )}
        </div>
      )}

      {!isExpired && (
        <>
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
              Your link to share:
            </label>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
              <input
                className="flex-1 bg-transparent border-0 outline-none font-mono text-blue-600 text-sm sm:text-base"
                value={effectiveShare}
                readOnly
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(effectiveShare);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1000);
                }}
                className="text-xs sm:text-sm px-3 py-1 rounded bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition"
                disabled={!myShareLink}
                title={!myShareLink ? "Generating your unique link…" : "Copy"}
              >
                {copied ? "Copied!" : myShareLink ? "Copy" : "…"}
              </button>
            </div>
          </div>

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
        </>
      )}
    </div>
  );
}
