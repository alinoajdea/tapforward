"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { createForward } from "@/lib/createForward";

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
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<Date>(new Date());
  const [copied, setCopied] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [myShareLink, setMyShareLink] = useState<string>("");
  const [duplicateView, setDuplicateView] = useState(false);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || "https://www.tapforward.app";

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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
        .select("subscription_plan, full_name, avatar_url")
        .eq("id", messageData.user_id)
        .single();

      setMessage({ ...messageData, profiles: profileData });

      const userPlan =
        profileData?.subscription_plan?.toLowerCase?.() || "free";
      setPlan(userPlan);

      const createdAt = new Date(messageData.created_at);
      const durationMs = PLAN_DURATIONS[userPlan] ?? PLAN_DURATIONS.free;
      setExpiresAt(new Date(createdAt.getTime() + durationMs));
      setLoading(false);
    }

    fetchMessage();
  }, [slug]);

  useEffect(() => {
    if (!message || !refCode) return;

    async function trackForwardView() {
      try {
        const { data: fwd } = await supabase
          .from("forwards")
          .select("id, message_id")
          .eq("unique_code", refCode)
          .maybeSingle();

        if (!fwd) return;

        const ipRes = await fetch("https://api.ipify.org?format=json", {
          cache: "no-store",
        });
        const { ip } = await ipRes.json();
        const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
        const viewer_fingerprint = `${ip ?? ""}|${ua}`;

        const { error: insErr } = await supabase
          .from("forward_views")
          .insert({
            forward_id: fwd.id,
            viewer_user_id: null,
            viewer_fingerprint,
          })
          .select()
          .maybeSingle();

        if ((insErr as any)?.code === "23505") {
          setDuplicateView(true);
        }

        const { count } = await supabase
          .from("forward_views")
          .select("*", { count: "exact", head: true })
          .eq("forward_id", fwd.id);

        const vc = count ?? 0;
        setViewCount(vc);
        setUnlocked(vc >= (message.unlocks_needed ?? 0));

        const childCode = await createForward(message.id, null, refCode);
        setMyShareLink(`${baseUrl}/m/${message.slug}?ref=${childCode}`);
      } catch (err) {
        console.error("Tracking failed", err);
      }
    }

    trackForwardView();
  }, [message, refCode, baseUrl]);

  useEffect(() => {
    if (!message || refCode) return;

    async function initRootForward() {
      try {
        const rootCode = await createForward(message.id, null);
        setMyShareLink(`${baseUrl}/m/${message.slug}?ref=${rootCode}`);
      } catch (e) {
        console.error("Root forward creation failed", e);
      }
    }

    initRootForward();
  }, [message, refCode, baseUrl]);

  if (loading) return <div className="text-center py-20">Loading…</div>;
  if (!message)
    return (
      <div className="text-center py-20 text-red-500">Message not found.</div>
    );

  const isExpired = expiresAt ? now >= expiresAt : false;
  const timeLeft = expiresAt
    ? formatTimeLeft(expiresAt.getTime() - now.getTime())
    : "";

  const effectiveShare = myShareLink || `${baseUrl}/m/${slug}`;
  const encodedUrl = encodeURIComponent(effectiveShare);
  const encodedTitle = encodeURIComponent(
    message.title || "Unlock this TapForward message!"
  );

  const socialNetworks = [
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: "💬",
      color: "bg-green-500",
    },
    {
      name: "Telegram",
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: "✈️",
      color: "bg-blue-400",
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: "📘",
      color: "bg-blue-600",
    },
    {
      name: "X",
      url: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: "🐦",
      color: "bg-gray-800",
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      icon: "💼",
      color: "bg-blue-700",
    },
  ];

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <h1 className="text-2xl font-extrabold text-center mb-4 bg-gradient-to-tr from-red-600 via-orange-500 to-blue-600 text-transparent bg-clip-text">
        {message.title || "Secret Message"}
      </h1>

      {message.profiles && (
        <div className="flex items-center justify-center gap-2 mb-2">
          {message.profiles.avatar_url && (
            <img
              src={message.profiles.avatar_url}
              alt="author"
              className="w-8 h-8 rounded-full border object-cover"
            />
          )}
          <span className="font-semibold text-gray-500 text-sm">
            by {message.profiles.full_name || "User"}
          </span>
        </div>
      )}

      {!isExpired ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center shadow mb-8">
          <div className="text-2xl font-mono font-bold text-blue-700">
            {timeLeft}
          </div>
          <div className="mt-1 text-blue-700 text-sm">
            {`Expires in ${timeLeft} (${
              plan.charAt(0).toUpperCase() + plan.slice(1)
            } Plan)`}
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
          It looks like you’ve already visited this link from this device. Share
          it with new people to increase your unlock count!
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
              This message is locked. <br />
              {viewCount} of {message.unlocks_needed} unlocks reached.
            </div>
          )}
        </div>
      )}

      {!isExpired && (
        <>
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-600 mb-2 text-center">
              Share this link to unlock for others:
            </label>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
              <input
                className="flex-1 bg-transparent border-0 outline-none font-mono text-blue-600"
                value={effectiveShare}
                readOnly
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(effectiveShare);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1000);
                }}
                className="text-xs px-3 py-1 rounded bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition"
                disabled={!myShareLink}
                title={!myShareLink ? "Generating your unique link…" : "Copy"}
              >
                {copied ? "Copied!" : myShareLink ? "Copy" : "…"}
              </button>
            </div>
          </div>

          <div>
            <div className="text-center font-semibold mb-3 text-gray-600">
              Share on your preferred network:
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {socialNetworks.map((net) => (
                <a
                  key={net.name}
                  href={net.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold shadow transition hover:scale-105 ${net.color}`}
                >
                  <span className="text-lg">{net.icon}</span>
                  <span className="hidden sm:inline">{net.name}</span>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
