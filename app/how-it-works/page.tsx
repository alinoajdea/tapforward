import Link from "next/link";
import Image from "next/image";
import FeaturesHeroCta from "@/app/features/FeaturesHeroCta";

/** SEO: page metadata */
export const metadata = {
  title: "How It Works • TapForward",
  description:
    "See exactly how TapForward works: create a message, share your personal link, and unlock it as people open your link. Learn sharing logic, visibility by plan, privacy, and examples.",
  metadataBase: new URL("https://tapforward.com"),
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "How TapForward Works",
    description:
      "Create a message, share your personal link, and unlock it as people open your link. Clear steps, examples, and FAQs.",
    url: "https://tapforward.com/how-it-works",
    siteName: "TapForward",
    images: [{ url: "/opengraph-image.jpg" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How TapForward Works",
    description:
      "Create a message, share your personal link, and unlock it as people open your link. Clear steps, examples, and FAQs.",
    images: ["/opengraph-image.jpg"],
  },
};

/** JSON-LD: HowTo (plus a small FAQ) */
function JsonLd() {
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How TapForward Works",
    description:
      "Create a message, share your personal link, and unlock it as people open your link. Each person gets their own link to unlock for themselves.",
    step: [
      {
        "@type": "HowToStep",
        name: "Create",
        text:
          "Write your message and set how many unique opens are needed to unlock.",
        url: "https://tapforward.com/how-it-works#step-create",
      },
      {
        "@type": "HowToStep",
        name: "Share",
        text:
          "Share your personal link anywhere. Each person who opens your link moves your counter.",
        url: "https://tapforward.com/how-it-works#step-share",
      },
      {
        "@type": "HowToStep",
        name: "Unlock",
        text:
          "When your counter hits the goal, the message reveals for you. Others must share their own link to unlock for themselves.",
        url: "https://tapforward.com/how-it-works#step-unlock",
      },
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "If I open a friend’s link, do I unlock my message?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No. Opening a friend’s link helps them unlock. To unlock for yourself, share your own personal link shown on the page.",
        },
      },
      {
        "@type": "Question",
        name: "Do I control how many opens are needed?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. You choose the number when you create the message.",
        },
      },
      {
        "@type": "Question",
        name: "How long is a message visible?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Visibility depends on plan: Free 12h, Growth 24h, Pro 72h from when the message was created.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd />

      {/* Hero */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-red-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-tr from-red-600 via-orange-500 to-blue-600 text-transparent bg-clip-text mb-4">
            How TapForward Works
          </h1>
          <p className="max-w-2xl mx-auto text-gray-700 text-lg">
            Create a message. Share <em>your personal link</em>. As people open{" "}
            <strong>your</strong> link, your counter grows. When it reaches the
            goal you set, your message unlocks—for you. Everyone else gets
            their own link to unlock for themselves.
          </p>

          {/* Login-aware CTA (uses your FeaturesHeroCta) */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <FeaturesHeroCta />
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <span className="font-semibold">Important:</span> Opening a friend’s
            link helps <em>them</em> unlock. To unlock for yourself, share the{" "}
            <span className="font-mono bg-white/70 px-1 py-0.5 rounded border border-gray-200">
              “Your link to share”
            </span>{" "}
            shown to you.
          </div>
        </div>
      </section>

      {/* Three clear steps */}
      <section className="py-20 bg-white border-t">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            The flow in 3 steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Step 1 */}
            <div id="step-create">
              <div className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100">
                <span className="text-blue-700 font-extrabold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create</h3>
              <p className="text-gray-600">
                Write your message and set how many unique opens are needed to
                reveal it.
              </p>
            </div>

            {/* Step 2 */}
            <div id="step-share">
              <div className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-100">
                <span className="text-orange-700 font-extrabold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share</h3>
              <p className="text-gray-600">
                Copy your personal link and post it anywhere—WhatsApp, X,
                Facebook, email, or DMs.
              </p>
            </div>

            {/* Step 3 */}
            <div id="step-unlock">
              <div className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100">
                <span className="text-red-700 font-extrabold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Unlock</h3>
              <p className="text-gray-600">
                Each unique open on <em>your</em> link moves your counter. Hit
                the goal and your message appears.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed logic */}
      <section className="py-20 bg-[#f9f9f9] border-t">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            What’s happening behind the scenes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">
                Everyone gets their own link
              </h3>
              <p className="text-gray-600">
                When someone visits a message, we generate (or reuse) a{" "}
                personal link for them. Opens counted on your link help{" "}
                <strong>you</strong> unlock—opens on their link help{" "}
                <strong>them</strong>.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2 text-orange-700">
                Unique opens, not spammy refreshes
              </h3>
              <p className="text-gray-600">
                We only count unique opens, so refreshing the page won’t inflate
                the counter. This keeps campaigns fair and fun.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2 text-red-700">
                Time-boxed visibility by plan
              </h3>
              <p className="text-gray-600">
                Messages expire after a set window from creation. Keep momentum
                high with a clear deadline.
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-gray-200 p-3 text-center">
                  <div className="text-xs text-gray-500">Free</div>
                  <div className="font-semibold text-gray-800">12h</div>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 text-center">
                  <div className="text-xs text-gray-500">Growth</div>
                  <div className="font-semibold text-gray-800">24h</div>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 text-center">
                  <div className="text-xs text-gray-500">Pro</div>
                  <div className="font-semibold text-gray-800">72h</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Visibility is counted from the exact time the message was
                created.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">
                Privacy-first by design
              </h3>
              <p className="text-gray-600">
                Your message stays hidden until it unlocks. Share safely, keep
                surprises secret, and control when content reveals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick examples */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Popular uses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Example 1 */}
            <div className="group bg-white border border-gray-100 p-6 rounded-2xl shadow transition hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.01]">
              <div className="rounded-xl overflow-hidden mb-4">
                <Image
                  src="/giveaway.webp"
                  alt="Giveaway example"
                  width={640}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-blue-700">
                Secret giveaways
              </h3>
              <p className="text-gray-600">
                Prize reveals after 10 unique opens on your link. Perfect for
                community boosts.
              </p>
            </div>

            {/* Example 2 */}
            <div className="group bg-white border border-gray-100 p-6 rounded-2xl shadow transition hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.01]">
              <div className="rounded-xl overflow-hidden mb-4">
                <Image
                  src="/discounts.webp"
                  alt="Discount example"
                  width={640}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-orange-700">
                Share-to-reveal discounts
              </h3>
              <p className="text-gray-600">
                Hide a coupon until your goal is hit. Create buzz before the
                reveal.
              </p>
            </div>

            {/* Example 3 */}
            <div className="group bg-white border border-gray-100 p-6 rounded-2xl shadow transition hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.01]">
              <div className="rounded-xl overflow-hidden mb-4">
                <Image
                  src="/events.webp"
                  alt="Private event example"
                  width={640}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-red-700">
                Private event invites
              </h3>
              <p className="text-gray-600">
                Reveal date or location only after enough people open your link.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ (short) */}
      <section className="py-20 bg-[#f9f9f9] border-t">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-1">
                If I open a friend’s link, do I unlock my message?
              </h3>
              <p className="text-gray-600">
                No. You’re helping your friend’s counter. To unlock for
                yourself, share the personal link shown on your screen and let
                others open it.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">
                Can I choose the unlock number?
              </h3>
              <p className="text-gray-600">
                Yes. Set the target when you create your message.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">
                How long does a message stay active?
              </h3>
              <p className="text-gray-600">
                Free: 12h, Growth: 24h, Pro: 72h—measured from the exact time
                the message was created.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gradient-to-tr from-blue-600 via-red-500 to-orange-400 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Ready to run your first unlock?
          </h2>
          <p className="mb-6 text-lg text-white/90">
            Start free. Upgrade any time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <FeaturesHeroCta />
          </div>
        </div>
      </section>
    </>
  );
}
