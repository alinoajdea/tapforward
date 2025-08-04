"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import dayjs from "dayjs";

type Message = {
  id: string;
  title: string;
  content: string;
  unlocks_needed: number;
  unlocks: number;
  created_at: string;
  expires_at?: string | null;
  is_active: boolean;
};

export default function ViewMessagePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : null;

  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    // Fetch message details
    supabase
      .from("messages")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setError("Message not found.");
        } else {
          setMessage(data as Message);
        }
        setLoading(false);
      });
  }, [id]);

  // Helper: check if message is expired
  const isExpired = (msg: Message) => {
    if (!msg.expires_at) return false;
    return dayjs().isAfter(dayjs(msg.expires_at));
  };

  // Helper: how many more unlocks needed
  const unlocksLeft = (msg: Message) => Math.max(msg.unlocks_needed - msg.unlocks, 0);

  // Handler: Share (copy to clipboard)
  async function handleCopyLink() {
    if (typeof window === "undefined" || !id) return;
    await navigator.clipboard.writeText(window.location.href);
  }

  // UI

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-orange-50 to-blue-50 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10 flex flex-col items-center">
        {/* Loading or Error */}
        {loading ? (
          <div className="text-gray-500 py-20 text-center text-lg">Loading message…</div>
        ) : error ? (
          <div className="text-red-500 text-center py-16">{error}</div>
        ) : message ? (
          <>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 text-center bg-gradient-to-tr from-red-600 via-orange-500 to-blue-600 text-transparent bg-clip-text">
              {message.title || "Untitled Message"}
            </h1>

            {/* Expired message */}
            {isExpired(message) && (
              <div className="my-10 bg-red-50 text-red-600 font-semibold px-6 py-4 rounded-lg border border-red-100 text-center">
                This message has expired and can no longer be unlocked.
              </div>
            )}

            {/* Message is unlocked and active */}
            {message.is_active && !isExpired(message) && unlocksLeft(message) <= 0 ? (
              <div className="w-full flex flex-col items-center">
                <div className="bg-gradient-to-r from-blue-50 via-orange-50 to-red-50 border border-gray-100 rounded-lg p-6 my-6 text-center w-full">
                  <div className="text-4xl mb-3">🎉</div>
                  <h2 className="font-bold text-lg mb-2 text-gray-800">Unlocked Message</h2>
                  <div className="text-gray-700 text-base whitespace-pre-line break-words">{message.content}</div>
                </div>
                <div className="mt-4 flex flex-col gap-2 w-full">
                  <button
                    onClick={handleCopyLink}
                    className="w-full py-2 px-4 rounded-lg bg-gradient-to-tr from-blue-600 to-red-500 hover:from-red-600 hover:to-orange-400 font-semibold text-white shadow-md transition"
                  >
                    Copy Message Link
                  </button>
                  <Link href="/" className="text-center text-blue-600 mt-2 hover:underline">
                    Create your own message
                  </Link>
                </div>
              </div>
            ) : (
              // Message is locked or waiting for more unlocks
              <div className="w-full flex flex-col items-center">
                <div className="bg-gradient-to-r from-gray-100 via-orange-50 to-red-50 border border-gray-100 rounded-lg p-6 my-6 text-center w-full">
                  <div className="text-4xl mb-3">🔒</div>
                  <h2 className="font-bold text-lg mb-2 text-gray-800">Locked Message</h2>
                  <p className="text-gray-600 mb-2">
                    This message will unlock after <span className="font-semibold">{message.unlocks_needed}</span> people have viewed it.<br />
                    <span className="font-semibold">{message.unlocks}</span> / {message.unlocks_needed} unlocks so far.
                  </p>
                  <div className="mb-2">
                    {unlocksLeft(message) > 1
                      ? `Share this link with ${unlocksLeft(message)} more people to unlock the message!`
                      : unlocksLeft(message) === 1
                        ? "Share this link with one more person to unlock the message!"
                        : ""}
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 h-2 rounded-full my-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 via-orange-400 to-red-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (message.unlocks / message.unlocks_needed) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="w-full py-2 px-4 rounded-lg bg-gradient-to-tr from-blue-600 to-red-500 hover:from-red-600 hover:to-orange-400 font-semibold text-white shadow-md transition mb-2"
                >
                  Copy Link to Share
                </button>
                <span className="text-gray-500 text-xs mt-2 text-center">
                  Each new person who visits helps unlock this message!
                </span>
              </div>
            )}
            {/* Show created/expiry info */}
            <div className="mt-8 text-xs text-gray-400 text-center">
              Created: {dayjs(message.created_at).format("MMM D, YYYY, h:mm A")}
              {message.expires_at && (
                <>
                  {" "}| Expires: {dayjs(message.expires_at).format("MMM D, YYYY, h:mm A")}
                </>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
