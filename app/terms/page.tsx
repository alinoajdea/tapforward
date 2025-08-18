import Link from "next/link";

/** SEO Metadata */
export const metadata = {
  title: "Terms of Service • TapForward",
  description:
    "Official Terms of Service for TapForward. Please review carefully before using our share-to-unlock messaging platform.",
  metadataBase: new URL("https://tapforward.com"),
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service • TapForward",
    description:
      "The rules, rights, and responsibilities when using TapForward's share-to-unlock platform.",
    url: "https://tapforward.com/terms",
    siteName: "TapForward",
    images: [{ url: "/opengraph-image.jpg" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service • TapForward",
    description:
      "Read the official Terms of Service for TapForward's share-to-unlock platform.",
    images: ["/opengraph-image.jpg"],
  },
};

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="pt-20 pb-10 bg-gradient-to-br from-red-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-tr from-red-600 via-orange-500 to-blue-600 text-transparent bg-clip-text mb-4">
            Terms of Service
          </h1>
          <p className="max-w-2xl mx-auto text-gray-700 text-lg">
            By creating an account or using TapForward, you agree to the
            following legally binding terms. Please read them carefully.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 space-y-10 text-gray-700 leading-relaxed">

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Eligibility & Accounts</h2>
            <p>
              You must be at least 13 years old to use TapForward. By registering,
              you represent that all information you provide is accurate. You are
              responsible for maintaining the confidentiality of your login credentials
              and for all activity under your account.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Acceptable Use</h2>
            <p>You agree not to use TapForward to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Violate any laws or regulations.</li>
              <li>Upload or share harmful, misleading, infringing, or illegal content.</li>
              <li>Distribute spam, malware, or engage in abusive behavior.</li>
            </ul>
            <p className="mt-2">
              We may remove content, suspend, or terminate accounts at our discretion
              if these terms are violated.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Intellectual Property</h2>
            <p>
              TapForward, its platform, and all related branding, code, and content
              are our property or our licensors’ property and are protected by law.
              You may not copy, distribute, reverse engineer, or use them without
              our written permission.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Subscriptions & Payments</h2>
            <p>
              TapForward offers free and paid plans. Paid subscriptions renew
              automatically unless canceled before the next billing cycle. Fees are
              non-refundable except where required by law.
            </p>
            <p className="mt-2">
              Payments are securely processed by Stripe and are also subject to
              Stripe’s{" "}
              <a
                href="https://stripe.com/legal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Disclaimer of Warranties</h2>
            <p>
              TapForward is provided <strong>“as is” and “as available”</strong>.
              We make no warranties of any kind, express or implied, including but
              not limited to merchantability, fitness for a particular purpose, or
              non-infringement. We do not guarantee uninterrupted or error-free
              service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, TapForward and its affiliates,
              officers, employees, and partners shall not be liable for any indirect,
              incidental, consequential, or punitive damages, including lost profits
              or data, arising out of your use of the service.
            </p>
            <p className="mt-2">
              In all cases, our total liability shall not exceed the amount you paid
              us in the 12 months before the claim arose, or $100, whichever is greater.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless TapForward and its
              affiliates from any claims, damages, losses, or expenses (including
              legal fees) arising out of your use of the service, your content, or
              your violation of these Terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Governing Law & Disputes</h2>
            <p>
              These Terms are governed by the laws of [Your Country/State].
              Any disputes shall be resolved through{" "}
              <strong>binding arbitration on an individual basis</strong> under the
              rules of [Arbitration Association], and not in court.{" "}
              <strong>You waive any right to participate in a class action or
              jury trial.</strong>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Changes to These Terms</h2>
            <p>
              We may modify these Terms at any time. Updated Terms will be posted
              on this page with a revised “last updated” date. Continued use of the
              service constitutes acceptance of changes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Contact Us</h2>
            <p>
              For questions about these Terms, email us at{" "}
              <a
                href="mailto:support@tapforward.com"
                className="text-blue-600 hover:underline"
              >
                support@tapforward.com
              </a>.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gradient-to-tr from-blue-600 via-red-500 to-orange-400 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Ready to share your first message?
          </h2>
          <p className="mb-6 text-lg text-white/90">
            Start for free and upgrade anytime.
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
