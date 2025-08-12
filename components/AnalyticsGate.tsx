"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

type Consent = { analytics: boolean; marketing: boolean; ts: number } | null;

function readConsent(): Consent {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )tf_consent=([^;]*)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export default function AnalyticsGate() {
  const [consent, setConsent] = useState<Consent>(null);

  useEffect(() => {
    const load = () => setConsent(readConsent());
    load();
    window.addEventListener("tf-consent", load);
    return () => window.removeEventListener("tf-consent", load);
  }, []);

  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID; // e.g. "G-XXXXXXX"
  const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN; // e.g. "tapforward.com"

  if (!consent?.analytics) return null;

  return (
    <>
      {/* GA4 (optional) */}
      {GA_ID && (
        <>
          <Script
            id="ga4-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {/* Plausible (optional) */}
      {PLAUSIBLE_DOMAIN && (
        <Script
          id="plausible"
          src="https://plausible.io/js/script.js"
          data-domain={PLAUSIBLE_DOMAIN}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
