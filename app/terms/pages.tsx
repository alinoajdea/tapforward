// app/terms/page.tsx
import Link from "next/link";

/** SEO Metadata */
export const metadata = {
  title: "Terms of Service • TapForward",
  description:
    "Read TapForward's Terms of Service to understand the rules, responsibilities, and acceptable use of our share-to-unlock messaging platform.",
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
      "Read the rules and conditions for using TapForward's share-to-unlock platform.",
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
            Please read these terms carefully before using TapForward.  
            By creating an account or using our service, you agree to these terms.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 space-y-10 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Using TapForward</h2>
            <p>
              TapForward allows you to create messages that unlock only when shared.
              You may only use our service for lawful purposes and in compliance with
              these terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account
              credentials and all activity under your account. You must be at least 13
              years old to use TapForward.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Acceptable Use</h2>
            <p>Do not use TapForward to share or promote:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Illegal, harmful, or misleading content.</li>
              <li>Spam or malicious links.</li>
              <li>Harassment, hate speech, or explicit material.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Privacy</h2>
            <p>
              Your privacy is important to us. Please review our{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>{" "}
              to understand how we handle your information.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Intellectual Property</h2>
            <p>
              TapForward and its content, branding, and software are owned by us and
              protected by law. You may not copy, modify, or distribute them without
              permission.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account if you violate
              these terms or misuse the platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Disclaimer</h2>
            <p>
              TapForward is provided “as is” without warranties of any kind. We are not
              responsible for any damages resulting from your use of the service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. We will notify you of any
              significant changes through email or in-app notices.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Contact Us</h2>
            <p>
              If you have questions about these Terms of Service, contact us at{" "}
              <a
                href="mailto:support@tapforward.com"
                className="text-blue-600 hover:underline"
              >
                support@tapforward.com
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Subscriptions & Payments</h2>
            <p>
              TapForward offers both free and paid subscription plans. By subscribing to a paid
              plan, you agree to pay the fees displayed at checkout. Payments are securely
              processed through Stripe.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>All prices are shown in USD unless otherwise stated.</li>
              <li>Paid subscriptions are billed in advance on a recurring basis (monthly or annually) according to the plan you select.</li>
              <li>Your subscription will automatically renew at the end of each billing cycle unless cancelled before renewal.</li>
              <li>You may cancel your subscription at any time in your account settings. Cancellations take effect at the end of your current billing period.</li>
              <li>We do not offer refunds for partially used billing periods, except where required by law.</li>
            </ul>
            <p className="mt-2">
              Stripe’s{" "}
              <a
                href="https://stripe.com/legal"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="https://stripe.com/privacy"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>{" "}
              also apply to payment processing.
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
            Start for free and see the magic of viral unlocking.
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
