// app/privacy/page.tsx
import Link from "next/link";

/** SEO Metadata */
export const metadata = {
  title: "Privacy Policy • TapForward",
  description:
    "Read TapForward's privacy policy to learn how we handle your data, keep your messages safe, and protect your privacy.",
  metadataBase: new URL("https://tapforward.com"),
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy • TapForward",
    description:
      "Learn how TapForward collects, uses, and safeguards your data while providing our share-to-unlock messaging service.",
    url: "https://tapforward.com/privacy",
    siteName: "TapForward",
    images: [{ url: "/opengraph-image.jpg" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy • TapForward",
    description:
      "Read how TapForward protects your privacy and keeps your messages secure.",
    images: ["/opengraph-image.jpg"],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="pt-20 pb-10 bg-gradient-to-br from-red-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-tr from-red-600 via-orange-500 to-blue-600 text-transparent bg-clip-text mb-4">
            Privacy Policy
          </h1>
          <p className="max-w-2xl mx-auto text-gray-700 text-lg">
            Your privacy matters. Here’s how we protect your data and ensure a safe
            experience while using TapForward.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 space-y-10 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p>
              We collect the minimum amount of information necessary to operate our
              service:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Your email address (for your account and login).</li>
              <li>Messages and content you create on TapForward.</li>
              <li>Basic usage data (to improve performance and prevent abuse).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">2. How We Use Your Data</h2>
            <p>We use your data to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Deliver and improve the TapForward service.</li>
              <li>Send important account or service updates.</li>
              <li>Prevent spam, fraud, or misuse of the platform.</li>
            </ul>
            <p className="mt-2">
              We <strong>do not</strong> sell or rent your personal information to third
              parties.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Message Privacy</h2>
            <p>
              Your messages remain private until the unlock conditions you set are met.
              Only the next unlocker can view the content, and we do not expose it
              publicly without your action.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Cookies & Analytics</h2>
            <p>
              We use cookies for secure login and basic analytics to understand how the
              site is used. You can disable cookies in your browser, but some features
              may not work as intended.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Data Security</h2>
            <p>
              We take security seriously. Data is encrypted in transit (HTTPS) and at
              rest. Access to your account is protected by your password—please keep it
              safe.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
            <p>
              You can request to view, update, or delete your data at any time by
              contacting us. We will respond within a reasonable timeframe.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy as our services evolve. We will notify
              you by email or in-app if changes are significant.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, contact us at{" "}
              <a
                href="mailto:privacy@tapforward.com"
                className="text-blue-600 hover:underline"
              >
                privacy@tapforward.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gradient-to-tr from-blue-600 via-red-500 to-orange-400 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Want to see how TapForward works?
          </h2>
          <p className="mb-6 text-lg text-white/90">
            Try it free and see the viral magic in action.
          </p>
          <Link
            href="/auth/register"
            className="inline-block py-3 px-7 rounded-lg bg-white/90 text-blue-700 font-semibold text-lg shadow-xl hover:bg-white transition"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
