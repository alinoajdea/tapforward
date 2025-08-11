// app/features/page.tsx
import Link from "next/link";
import Image from "next/image";
import FeaturesHeroCta from "./FeaturesHeroCta";

/** SEO: page metadata */
export const metadata = {
  title: "Features • TapForward",
  description:
    "Create messages that unlock only when they’re shared. Simple tools, fun results. Run giveaways, reveal discounts, send private invites, and grow naturally.",
  metadataBase: new URL("https://tapforward.com"),
  alternates: { canonical: "/features" },
  openGraph: {
    title: "TapForward Features",
    description:
      "Create messages that unlock only when they’re shared. Giveaways, discounts, invites — simple and viral.",
    url: "https://tapforward.com/features",
    siteName: "TapForward",
    images: [{ url: "/opengraph-image.jpg" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TapForward Features",
    description:
      "Create messages that unlock only when they’re shared. Giveaways, discounts, invites — simple and viral.",
    images: ["/opengraph-image.jpg"],
  },
};

function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TapForward",
    applicationCategory: "WebApplication",
    operatingSystem: "Any",
    url: "https://tapforward.com/features",
    description:
      "Create messages that unlock only when they’re shared. Run viral campaigns with simple share-to-unlock links.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", category: "Free" },
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function FeaturesPage() {
  return (
    <>
      <JsonLd />

      {/* Hero */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-red-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-tr from-red-600 via-orange-500 to-blue-600 text-transparent bg-clip-text mb-4">
            Simple tools, powerful results
          </h1>

          <p className="max-w-2xl mx-auto text-gray-700 text-lg">
            Create a message. Share your link. The message unlocks only when people open
            <em> your </em> link. Every person gets their own link to unlock for themselves.
          </p>

          {/* CTA buttons (login-aware) */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <FeaturesHeroCta />
          </div>

          {/* One-line explainer that removes confusion */}
          <div className="mt-4 text-sm text-gray-600">
            <span className="font-semibold">Important:</span> If you open a friend’s link,
            you help <em>them</em> unlock. To unlock for yourself, share the{" "}
            <span className="font-mono bg-white/70 px-1 py-0.5 rounded border border-gray-200">
              “Your link to share”
            </span>{" "}
            shown to you.
          </div>
        </div>
      </section>

      {/* See it in action (Examples) */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">See it in action</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Example 1 */}
            <div className="group bg-white border border-gray-100 p-6 rounded-2xl shadow transition hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.01]">
              <div className="rounded-xl overflow-hidden mb-4">
                <Image
                  src="/giveaway.webp"
                  alt="Giveaway example card"
                  width={640}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority={false}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Run a secret giveaway</h3>
              <p className="text-gray-600">
                Share a mystery prize link that unlocks after 10 opens of your link. People
                spread it to reveal what’s inside.
              </p>
            </div>

            {/* Example 2 */}
            <div className="group bg-white border border-gray-100 p-6 rounded-2xl shadow transition hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.01]">
              <div className="rounded-xl overflow-hidden mb-4">
                <Image
                  src="/discounts.webp"
                  alt="Exclusive discount example card"
                  width={640}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-orange-700">Share-to-reveal discounts</h3>
              <p className="text-gray-600">
                Offer a hidden coupon that appears only when friends open your link. More
                shares = more buzz.
              </p>
            </div>

            {/* Example 3 */}
            <div className="group bg-white border border-gray-100 p-6 rounded-2xl shadow transition hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.01]">
              <div className="rounded-xl overflow-hidden mb-4">
                <Image
                  src="/events.webp"
                  alt="Private event invite example card"
                  width={640}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-red-700">Private event invites</h3>
              <p className="text-gray-600">
                Send an invite that reveals location details only after enough people open
                your link.
              </p>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Tip: You decide how many unique opens are needed to unlock.
          </p>
        </div>
      </section>

      {/* Core features (plain-English) */}
      <section className="py-20 bg-[#f9f9f9] border-t">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to spark sharing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Create in seconds</h3>
              <p className="text-gray-600">
                Write your message, set the unlock number, and you’re done.
              </p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2 text-orange-700">Share anywhere</h3>
              <p className="text-gray-600">
                Copy your link and post it on WhatsApp, X, Facebook, email—wherever your
                people are.
              </p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2 text-red-700">Unlock as it spreads</h3>
              <p className="text-gray-600">
                Every unique open on <em>your</em> link moves you toward reveal.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Live progress</h3>
              <p className="text-gray-600">Unlock counters update in real time.</p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2 text-orange-700">Time-boxed by plan</h3>
              <p className="text-gray-600">Choose how long your message stays active.</p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2 text-red-700">Privacy first</h3>
              <p className="text-gray-600">
                Messages stay hidden until unlocked. Perfect for surprises and promos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works (quick) */}
      <section className="py-20 bg-white border-t">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100">
                <span className="text-blue-700 font-extrabold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create</h3>
              <p className="text-gray-600">Write your message and set the goal.</p>
            </div>
            <div>
              <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-100">
                <span className="text-orange-700 font-extrabold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share</h3>
              <p className="text-gray-600">Send your personal link anywhere.</p>
            </div>
            <div>
              <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100">
                <span className="text-red-700 font-extrabold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Unlock</h3>
              <p className="text-gray-600">
                When <em>your</em> link hits the target, the message reveals for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gradient-to-tr from-blue-600 via-red-500 to-orange-400 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Ready to try it?
          </h2>
          <p className="mb-6 text-lg text-white/90">Start free. Upgrade any time.</p>
          <Link
            href="/auth/register"
            className="inline-block py-3 px-7 rounded-lg bg-white/90 text-blue-700 font-semibold text-lg shadow-xl hover:bg-white transition"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>
    </>
  );
}
