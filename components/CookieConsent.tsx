"use client";

import { useEffect, useMemo, useState } from "react";

type Consent = {
  analytics: boolean;
  marketing: boolean;
  ts: number;
};

const COOKIE_NAME = "tf_consent";
const COOKIE_MAX_AGE_DAYS = 180; // re-ask after ~6 months

function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1])) as Consent;
  } catch {
    return null;
  }
}

function writeConsent(consent: Consent) {
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_MAX_AGE_DAYS);
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(consent)
  )}; Path=/; Expires=${expires.toUTCString()}; SameSite=Lax`;
}

export default function CookieConsent() {
  const existing = useMemo(readConsent, []);
  const [open, setOpen] = useState(!existing);
  const [showCustomize, setShowCustomize] = useState(false);

  // toggles for categories
  const [analytics, setAnalytics] = useState<boolean>(existing?.analytics ?? false);
  const [marketing, setMarketing] = useState<boolean>(existing?.marketing ?? false);

  useEffect(() => {
    // If we already had consent stored, keep banner hidden.
    if (existing) setOpen(false);
  }, [existing]);

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-4xl m-4 rounded-2xl border border-gray-200 bg-white shadow-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1">
            <h2 className="text-base sm:text-lg font-bold text-gray-800">We use cookies</h2>
            <p className="mt-1 text-sm text-gray-600">
              We use essential cookies to make TapForward work. With your permission, we’ll use
              analytics and marketing cookies to improve our service.{" "}
              <a href="/privacy" className="text-blue-600 underline">
                Learn more
              </a>
              .
            </p>

            {showCustomize && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">Analytics</div>
                      <div className="text-xs text-gray-500">
                        Helps us understand usage (e.g., page views).
                      </div>
                    </div>
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={analytics}
                        onChange={(e) => setAnalytics(e.target.checked)}
                      />
                      <span className="text-sm text-gray-700">Allow</span>
                    </label>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">Marketing</div>
                      <div className="text-xs text-gray-500">
                        Used for ads & remarketing (if we add them).
                      </div>
                    </div>
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={marketing}
                        onChange={(e) => setMarketing(e.target.checked)}
                      />
                      <span className="text-sm text-gray-700">Allow</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 flex flex-col gap-2 w-full sm:w-auto">
            {!showCustomize && (
              <button
                onClick={() => setShowCustomize(true)}
                className="w-full sm:w-40 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 font-semibold"
              >
                Customize
              </button>
            )}
            <button
              onClick={() => {
                writeConsent({ analytics: true, marketing: true, ts: Date.now() });
                setOpen(false);
                // let listeners know consent changed
                window.dispatchEvent(new Event("tf-consent"));
              }}
              className="w-full sm:w-40 px-4 py-2 rounded-lg bg-gradient-to-tr from-blue-600 to-red-500 hover:from-red-600 hover:to-orange-400 text-white font-semibold shadow"
            >
              Accept all
            </button>
            <button
              onClick={() => {
                writeConsent({ analytics: false, marketing: false, ts: Date.now() });
                setOpen(false);
                window.dispatchEvent(new Event("tf-consent"));
              }}
              className="w-full sm:w-40 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 font-semibold"
            >
              Reject non-essential
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to open a small “preferences” dialog anywhere (optional)
export function useConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  useEffect(() => {
    const load = () => setConsent(readConsent());
    load();
    window.addEventListener("tf-consent", load);
    return () => window.removeEventListener("tf-consent", load);
  }, []);
  return consent;
}
