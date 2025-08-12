"use client";

const CONSENT_EVENT = "tf-consent-changed";

export function ResetConsentButton() {
  return (
    <button
      className="text-sm text-blue-600 underline"
      onClick={() => {
        document.cookie = "tf_consent=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax";
        window.dispatchEvent(new Event(CONSENT_EVENT));
        window.location.reload();
      }}
    >
      Cookie Preferences
    </button>
  );
}
