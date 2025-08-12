"use client";

import { useEffect, useMemo, useState } from "react";

const COOKIE_NAME = "tf_consent";
const CONSENT_VALUE = "accepted";
const CONSENT_EVENT = "tf-consent-changed";

function hasConsentCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE_NAME}=`));
}

function setConsentCookie() {
  if (typeof document === "undefined") return;
  // 180 days
  const maxAge = 60 * 60 * 24 * 180;
  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  const secure = isHttps ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${CONSENT_VALUE}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export default function CookieConsent() {
  // Don’t render until client; avoid weird SSR/CSR flicker
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOpen(!hasConsentCookie());
    // Re-open if user resets from footer
    const onChange = () => setOpen(!hasConsentCookie());
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  const accept = () => {
    setConsentCookie();
    setOpen(false); // close immediately
    // Let other parts of the app know
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  if (!mounted || !open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-black/30">
      <div className="w-full sm:w-auto max-w-xl mx-4 sm:mx-0 rounded-2xl border border-gray-200 bg-white shadow-2xl p-5">
        <h2 className="text-lg font-bold text-gray-800 mb-2">We use cookies</h2>
        <p className="text-sm text-gray-600 mb-4">
          We use necessary cookies to run TapForward and optional analytics (anonymized) to improve the app. By
          clicking Accept, you agree to our use of cookies. You can change this anytime in “Cookie Preferences.”
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            aria-label="Close cookie banner"
          >
            Close
          </button>
          <a
            href="/privacy"
            className="px-4 py-2 rounded-lg border border-blue-200 text-blue-700 bg-white hover:bg-blue-50 text-center"
          >
            Learn more
          </a>
          <button
            onClick={accept}
            className="px-4 py-2 rounded-lg bg-gradient-to-tr from-blue-600 to-red-500 hover:from-red-600 hover:to-orange-400 text-white font-semibold shadow-lg"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
