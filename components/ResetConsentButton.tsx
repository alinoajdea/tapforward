"use client";

export function ResetConsentButton() {
  return (
    <button
      className="text-sm text-blue-600 underline"
      onClick={() => {
        document.cookie = "tf_consent=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.dispatchEvent(new Event("tf-consent"));
        // reload to show banner again
        window.location.reload();
      }}
    >
      Cookie Preferences
    </button>
  );
}
