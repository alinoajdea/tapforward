"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Message = {
  id: string;
  slug: string;
  title: string;
  unlocks_needed: number;
  created_at: string;
};

type ForwardRow = {
  id: string;
  message_id: string;
  unique_code: string;
  parent_id: string | null;
  sender_id: string | null;
  created_at: string;
};

type ProgressRow = {
  forward_id: string;
  unique_code: string;
  message_id: string;
  unique_views: number;
};

export default function AnalyticsPage() {
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<Message | null>(null);
  const [forwards, setForwards] = useState<ForwardRow[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({}); // key: forward_id -> unique_views
  const [error, setError] = useState<string | null>(null);

  // Derived
  const totals = useMemo(() => {
    const views = Object.values(progress).reduce((a, b) => a + b, 0);
    const totalLinks = forwards.length;
    const bestLinkViews = Math.max(0, ...Object.values(progress));
    return { views, totalLinks, bestLinkViews };
  }, [progress, forwards]);

  const topLinks = useMemo(() => {
    // join forwards + progress by forward id
    const byId: Record<string, ForwardRow> = {};
    forwards.forEach((f) => (byId[f.id] = f));
    return Object.entries(progress)
      .map(([forward_id, unique_views]) => ({
        forward_id,
        unique_views,
        unique_code: byId[forward_id]?.unique_code,
        created_at: byId[forward_id]?.created_at,
        parent_id: byId[forward_id]?.parent_id ?? null,
      }))
      .sort((a, b) => b.unique_views - a.unique_views)
      .slice(0, 10);
  }, [forwards, progress]);

  useEffect(() => {
    let cancel = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // 1) Message
        const { data: msg, error: msgErr } = await supabase
          .from("messages")
          .select("id, slug, title, unlocks_needed, created_at")
          .eq("id", id)
          .maybeSingle();
        if (msgErr) throw msgErr;
        if (!msg) {
          setError("Message not found.");
          setLoading(false);
          return;
        }
        if (cancel) return;
        setMessage(msg as Message);

        // 2) All forwards for this message
        const { data: fwdRows, error: fwdErr } = await supabase
          .from("forwards")
          .select("id, message_id, unique_code, parent_id, sender_id, created_at")
          .eq("message_id", id)
          .order("created_at", { ascending: true });

        if (fwdErr) throw fwdErr;
        if (cancel) return;
        setForwards((fwdRows || []) as ForwardRow[]);

        // 3) Try fast path: forward_progress view
        const { data: progRows, error: progErr } = await supabase
          .from("forward_progress")
          .select("forward_id, unique_code, message_id, unique_views")
          .eq("message_id", id);

        if (!progErr && progRows) {
          const map: Record<string, number> = {};
          (progRows as ProgressRow[]).forEach((r) => {
            map[r.forward_id] = r.unique_views ?? 0;
          });
          if (!cancel) {
            setProgress(map);
            setLoading(false);
          }
          return;
        }

        // 4) Fallback: count per forward (slower, but safe)
        const map: Record<string, number> = {};
        for (const f of fwdRows || []) {
          const { count } = await supabase
            .from("forward_views")
            .select("*", { count: "exact", head: true })
            .eq("forward_id", f.id);
          map[f.id] = count ?? 0;
        }
        if (!cancel) {
          setProgress(map);
          setLoading(false);
        }
      } catch (e: any) {
        if (!cancel) {
          setError(e?.message || "Failed to load analytics.");
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancel = true;
    };
  }, [id]);

  // Live updates: listen to any new forward_views and update the progress for this message’s forwards
  useEffect(() => {
    if (!forwards.length) return;
    const ids = new Set(forwards.map((f) => f.id));

    const channel = supabase
      .channel(`analytics-${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "forward_views" },
        async (payload) => {
          const insertedForwardId = (payload.new as any)?.forward_id;
          if (!ids.has(insertedForwardId)) return;

          // refresh just that forward’s count
          const { count } = await supabase
            .from("forward_views")
            .select("*", { count: "exact", head: true })
            .eq("forward_id", insertedForwardId);

          setProgress((prev) => ({
            ...prev,
            [insertedForwardId]: count ?? 0,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, forwards]);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || "https://www.tapforward.app";

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-gradient-to-br from-gray-50 to-red-100 py-12 px-4 flex items-center justify-center">
        <div className="text-gray-400">Loading…</div>
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="min-h-[80vh] bg-gradient-to-br from-gray-50 to-red-100 py-12 px-4 flex items-center justify-center">
        <div className="bg-white/90 border border-red-200 text-red-700 rounded-xl p-6 shadow max-w-lg text-center">
          {error || "Message not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-gray-50 to-red-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-600 text-center sm:text-left">
            Analytics
          </h1>
          <p className="text-gray-500 mt-1 text-center sm:text-left">
            <span className="font-semibold">{message.title}</span>
            <span className="text-gray-400"> &middot; </span>
            <span className="font-mono text-sm">{message.slug}</span>
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Unique Views" value={totals.views} />
          <StatCard label="Personal Links Created" value={totals.totalLinks} />
          <StatCard
            label={`Best Link Progress / ${message.unlocks_needed}`}
            value={`${Math.min(totals.bestLinkViews, message.unlocks_needed)} / ${message.unlocks_needed}`}
          />
        </div>

        {/* Shareable base link */}
        <div className="bg-white/90 border border-gray-100 rounded-2xl p-4 shadow mb-8">
          <div className="text-sm text-gray-500 mb-2">Public message URL</div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <input
              className="flex-1 bg-transparent border-0 outline-none font-mono text-blue-700"
              readOnly
              value={`${baseUrl}/m/${message.slug}`}
            />
            <CopyButton text={`${baseUrl}/m/${message.slug}`} />
          </div>
        </div>

        {/* Top links table */}
        <div className="bg-white/90 border border-gray-100 rounded-2xl p-4 shadow">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-700">Top Links</h2>
            <span className="text-sm text-gray-400">
              Showing {topLinks.length} of {forwards.length}
            </span>
          </div>

          {topLinks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No link activity yet. Share your message to start the chain!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2 pr-3">Link</th>
                    <th className="py-2 pr-3">Views</th>
                    <th className="py-2 pr-3 hidden sm:table-cell">Created</th>
                    <th className="py-2 pr-3">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {topLinks.map((row) => {
                    const url = `${baseUrl}/m/${message.slug}?ref=${row.unique_code}`;
                    return (
                      <tr key={row.forward_id} className="border-b last:border-0">
                        <td className="py-2 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-blue-700 truncate max-w-[220px]">
                              {row.unique_code}
                            </span>
                            {row.parent_id && (
                              <span className="text-xs text-gray-400 bg-gray-100 rounded px-2 py-0.5">
                                child
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2 pr-3 font-semibold">{row.unique_views}</td>
                        <td className="py-2 pr-3 hidden sm:table-cell text-gray-500">
                          {row.created_at
                            ? new Date(row.created_at).toLocaleString()
                            : "—"}
                        </td>
                        <td className="py-2 pr-3">
                          <CopyButton text={url} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Hint */}
        <div className="mt-6 text-xs text-gray-500 text-center sm:text-left">
          Analytics update in real time as new people open links in your chain.
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white/90 border border-gray-100 rounded-2xl p-5 shadow flex flex-col">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-extrabold text-gray-700 mt-1">{value}</div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1000);
        } catch {}
      }}
      className="text-xs px-3 py-1 rounded bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
