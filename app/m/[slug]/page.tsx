"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getAnonFingerprint, createForward } from "@/lib/createForward";
import DOMPurify from "dompurify";
import {
  FaWhatsapp,
  FaFacebookF,
  FaFacebookMessenger,
  FaXTwitter,
  FaEnvelope,
  FaLinkedinIn,
} from "react-icons/fa6";

const H = (n: number) => n * 60 * 60 * 1000;

const PLAN_DURATIONS: Record<string, number> = {
  free:   H(12),  // 12 hours
  growth: H(24),  // 24 hours
  pro:    H(72),  // 72 hours
};

function formatTimeLeft(ms: number) {
  if (ms < 0) return "0:00:00";
  const d = Math.floor(ms / (24 * 60 * 60 * 1000));
  const h = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const m = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  const s = Math.floor((ms % (60 * 1000)) / 1000);
  return [d > 0 ? `${d}d` : null, `${h}`.padStart(2, "0"), `${m}`.padStart(2, "0"), `${s}`.padStart(2, "0")]
    .filter(Boolean)
    .join(":");
}

// Small helper to render initials if no logo/avatar
function initialsFromName(name?: string) {
  if (!name) return "•";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase() ?? "").join("") || "•";
}

// Decide effective plan from latest subscription (fallback to "free")
function resolvePlan(
  subs: Array<{ plan: string | null; status: string | null; period_end: string | null }>
): string {
  if (!subs || subs.length === 0) return "free";
  const s = subs[0];
  const active = s.status === "active" && (!s.period_end || new Date(s.period_end) > new Date());
  return active ? (s.plan || "free").toLowerCase() : "free";
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

  // Creator/company info (all optional)
  const [creator, setCreator] = useState<{
    display_name?: string | null;
    full_name?: string | null;
    company_name?: string | null;
    company_logo_url?: string | null;
    avatar_url?: string | null;
  } | null>(null);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || "https://www.tapforward.app";

  // ticking timer
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // fetch message + compute expiry from creator subscription + fetch creator profile
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

      const userId = messageData.user_id as string;

      // Fetch profile and latest subscription in parallel
      const [profileRes, subsRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, company_name, avatar_url")
          .eq("id", userId)
          .maybeSingle(),
        supabase
          .from("subscriptions")
          .select("plan, status, period_end, created_at")
          .eq("user_id", userId)
          .order("period_end", { ascending: false, nullsFirst: false })
          .limit(1),
      ]);

      const profileData = profileRes.data ?? null;
      const subs = subsRes.data ?? [];
      const plan = resolvePlan(subs);

      const createdAt = new Date(messageData.created_at);
      const durationMs = PLAN_DURATIONS[plan] ?? PLAN_DURATIONS.free;
      setExpiresAt(new Date(createdAt.getTime() + durationMs));

      setMessage(messageData);
      if (profileData) setCreator(profileData);
      setLoading(false);
    }

    fetchMessage();
  }, [slug]);

  // Track view + create threaded link (arriving WITH ?ref=...)
  useEffect(() => {
    if (!message) return;

    async function handleForward() {
      try {
        if (!refCode) return;

        // Load parent forward by code (sender's link)
        const { data: parent } = await supabase
          .from("forwards")
          .select("id, message_id, anon_fingerprint")
          .eq("unique_code", refCode)
          .maybeSingle();

        if (!parent) return;

        const viewer_fingerprint = await getAnonFingerprint();

        // If this ref belongs to me (same fingerprint): use parent's forward for my unlock state
        if (parent.anon_fingerprint === viewer_fingerprint) {
          setMyShareLink(`${baseUrl}/m/${message.slug}?ref=${refCode}`);
          setForwardId(parent.id);

          const { count } = await supabase
            .from("forward_views")
            .select("*", { count: "exact", head: true })
            .eq("forward_id", parent.id);
          const vc = count ?? 0;
          setViewCount(vc);
          setUnlocked(vc >= (message.unlocks_needed ?? 0));
          return;
        }

        // Otherwise I'm a new viewer of someone else's code:
        // 1) count a unique view on the parent (for sender benefit)
        const { error: insErr } = await supabase.from("forward_views").insert({
          forward_id: parent.id,
          viewer_user_id: null,
          viewer_fingerprint,
        });
        if ((insErr as any)?.code === "23505") setDuplicateView(true);

        // 2) Create or fetch MY child forward chained under the parent
        let childCode = refCode;
        try {
          childCode = await createForward(message.id, null, refCode);
        } catch {
          childCode = refCode;
        }
        setMyShareLink(`${baseUrl}/m/${message.slug}?ref=${childCode}`);

        // 3) Use the CHILD forward id for my own unlock progress
        const { data: child } = await supabase
          .from("forwards")
          .select("id")
          .eq("unique_code", childCode)
          .maybeSingle();

        const myForwardId = child?.id ?? null;
        setForwardId(myForwardId);

        if (myForwardId) {
          const { count } = await supabase
            .from("forward_views")
            .select("*", { count: "exact", head: true })
            .eq("forward_id", myForwardId);
          const vc = count ?? 0;
          setViewCount(vc);
          setUnlocked(vc >= (message.unlocks_needed ?? 0));
        } else {
          setViewCount(0);
          setUnlocked(false);
        }
      } catch (err) {
        console.error("Forward handling failed", err);
      }
    }

    handleForward();
  }, [message, refCode, baseUrl]);

  // If there is NO ?ref=..., mint (or fetch) my personal ROOT forward and drive my own progress from it
  useEffect(() => {
    if (!message || refCode) return;

    let cancelled = false;
    (async () => {
      try {
        const code = await createForward(message.id, null, null);
        if (cancelled) return;

        setMyShareLink(`${baseUrl}/m/${message.slug}?ref=${code}`);

        const { data: root } = await supabase
          .from("forwards")
          .select("id")
          .eq("unique_code", code)
          .maybeSingle();

        if (root?.id) {
          setForwardId(root.id);
          const { count } = await supabase
            .from("forward_views")
            .select("*", { count: "exact", head: true })
            .eq("forward_id", root.id);
          const vc = count ?? 0;
          setViewCount(vc);
          setUnlocked(vc >= (message.unlocks_needed ?? 0));
        }
      } catch (e) {
        console.warn("Could not mint personal link", e);
        // Keep button disabled; don't show a ref-less URL
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [message, refCode, baseUrl]);

  // Real-time subscription for live unlock on MY forwardId
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
    return <div className="text-center py-20 text-red-500">Message not found.</div>;

  const isExpired = expiresAt ? now >= expiresAt : false;
  const timeLeft = expiresAt ? formatTimeLeft(expiresAt.getTime() - now.getTime()) : "";

  const remainingShares = Math.max((message.unlocks_needed ?? 0) - viewCount, 0);
  const effectiveShare = myShareLink; // only show link when we have a ref
  const encodedUrl = encodeURIComponent(effectiveShare || "");
  const encodedTitle = encodeURIComponent(message.title || "Unlock this TapForward message!");

  // Display name fallback order
  const creatorName =
    (creator?.display_name || creator?.full_name || "TapForward Creator") ?? "TapForward Creator";
  const companyName = creator?.company_name || null;
  const logoUrl = creator?.company_logo_url || creator?.avatar_url || null;
  const initials =
    (companyName || creatorName)
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "•";

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <h1 className="text-2xl font-extrabold text-center mb-3">
        {message.title || "Secret Message"}
      </h1>

      {/* Trust Header */}
      <div className="mb-6 flex items-center gap-3 justify-center">
        <div className="relative w-24 h-11 overflow-hidden flex items-center justify-center font-bold rounded-md border border-gray-300 text-gray-600">
          {logoUrl ? (
            // using <img> to avoid next/image SSR constraints here
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={companyName ? `${companyName} logo` : `${creatorName} avatar`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="text-center">      
          {companyName && (
            <div className="text-sm font-semibold text-gray-800 leading-tight">{companyName}</div>
          )}
          <div className="text-xs font-semibold text-gray-500 leading-tight">{creatorName}</div>
        </div>
      </div>

      {!isExpired ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center shadow mb-8">
          <div className="text-2xl font-mono font-bold text-blue-700">{timeLeft}</div>
          <div className="mt-1 text-blue-700 text-sm">This message will expire in {timeLeft}</div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center shadow mb-8">
          <div className="text-xl font-bold text-red-600">This message has expired.</div>
        </div>
      )}

      {duplicateView && !unlocked && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-3 mb-4 text-sm">
          You’ve already visited this link from this IP. Share it with new people to unlock.
        </div>
      )}

      {!isExpired && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow text-center mb-8">
          {unlocked ? (
            <div
              className="prose prose-sm sm:prose-base max-w-none text-left mx-auto"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(message.content || "", {
                  ALLOWED_TAGS: [
                    "p",
                    "br",
                    "strong",
                    "b",
                    "em",
                    "i",
                    "u",
                    "s",
                    "blockquote",
                    "ul",
                    "ol",
                    "li",
                    "h2",
                    "h3",
                    "a",
                    "span",
                  ],
                  ALLOWED_ATTR: ["href", "target", "rel"],
                }),
              }}
            />
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
                value={effectiveShare || "Generating your unique link…"}
                readOnly
              />
              <button
                onClick={() => {
                  if (!effectiveShare) return;
                  navigator.clipboard.writeText(effectiveShare);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1000);
                }}
                className="text-xs sm:text-sm px-3 py-1 rounded bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition disabled:opacity-60"
                disabled={!effectiveShare}
                title={!effectiveShare ? "Generating your unique link…" : "Copy"}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div>
            <div className="text-center font-semibold mb-3 text-gray-700">Share it on social:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <a
                href={`https://wa.me/?text=${encodedTitle}%20${encodeURIComponent(effectiveShare || "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium shadow transition"
              >
                <FaWhatsapp /> WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(effectiveShare || "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow transition"
              >
                <FaFacebookF /> Facebook
              </a>
              <a
                href={`https://x.com/intent/tweet?url=${encodeURIComponent(effectiveShare || "")}&text=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-900 text-white font-medium shadow transition"
              >
                <FaXTwitter /> X
              </a>
              <a
                href={`https://www.facebook.com/dialog/send?link=${encodeURIComponent(effectiveShare || "")}&app_id=${process.env.NEXT_PUBLIC_FB_APP_ID}&redirect_uri=${encodeURIComponent(effectiveShare || "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium shadow transition"
              >
                <FaFacebookMessenger /> Messenger
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(effectiveShare || "")}&title=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium shadow transition"
              >
                <FaLinkedinIn /> LinkedIn
              </a>
              <a
                href={`mailto:?subject=${encodedTitle}&body=${encodeURIComponent(effectiveShare || "")}`}
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
