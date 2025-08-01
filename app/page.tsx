// app/page.tsx
import Link from "next/link";
import Head from "next/head";

export default function Home() {
  return (
    <>
      {/* SEO */}
      <Head>
        <title>TapForward – Viral Message Unlocking SaaS</title>
        <meta
          name="description"
          content="TapForward lets you create messages that unlock only when they&apos;re shared. Run viral campaigns, unlock secrets, or power growth loops – all in a privacy-first, intuitive app."
        />
        <meta
          property="og:title"
          content="TapForward – Unlock Messages by Sharing"
        />
        <meta
          property="og:description"
          content="Create a message. Share the link. The message unlocks only when forwarded – a fun, viral way to share."
        />
        <meta property="og:image" content="/opengraph-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://tapforward.com/" />
      </Head>

      {/* Hero */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-red-50 to-blue-50">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
          <span className="inline-block rounded-full px-4 py-1 text-xs bg-red-100 text-red-600 font-semibold mb-4 animate-bounce">
            🚀 New: Unlock viral messaging for growth!
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-tr from-red-600 via-orange-500 to-blue-600 text-transparent bg-clip-text mb-5">
            Messages that unlock
            <br />
            only when they&apos;re shared.
          </h1>
          <p className="max-w-xl text-gray-700 text-lg mb-8">
            Create viral, share-to-unlock messages for promotions, invites,
            secrets, or campaigns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="py-3 px-7 rounded-lg bg-gradient-to-tr from-blue-600 to-red-500 hover:from-red-600 hover:to-orange-400 font-semibold text-white shadow-lg text-lg transition-all"
            >
              Get Started Free
            </Link>
            <Link
              href="#how"
              className="py-3 px-7 rounded-lg bg-white/80 hover:bg-white font-semibold text-blue-700 border border-blue-200 shadow text-lg transition-all"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* What is TapForward */}
      <section className="bg-[#f9f9f9] py-20 border-b">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          {/* Left Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="/what_is_tapforwad.webp"
              alt="TapForward viral marketing illustration"
              className="max-w-full rounded-2xl shadow-xl border border-gray-100"
              loading="lazy"
            />
          </div>
          {/* Right Content */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              What is <span className="bg-gradient-to-tr from-red-600 via-orange-500 to-blue-600 text-transparent bg-clip-text">TapForward?</span>
            </h2>
            <p className="text-lg text-gray-700 mb-5">
              <span className="font-semibold text-gray-900">Revolutionize your marketing</span> by creating viral campaigns at a fraction of the cost of traditional campaigns. TapForward empowers you to launch, track, and grow share-to-unlock experiences that spread like wildfire—effortlessly.
            </p>
            <p className="text-base text-gray-600 mb-8">
              Run giveaways, unlock promotions, power referral loops, and engage your audience like never before—right from your dashboard.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/auth/register"
                className="inline-block px-7 py-3 rounded-lg bg-gradient-to-tr from-red-600 to-orange-400 hover:from-blue-600 hover:to-red-500 text-white font-bold shadow-lg text-base transition"
              >
                Get started free
              </Link>
              <Link
                href="#how"
                className="inline-block px-7 py-3 rounded-lg border-2 border-orange-400 text-orange-600 font-bold bg-white hover:bg-orange-50 shadow text-base transition"
              >
                See how it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 bg-white border-t">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">How TapForward Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <span className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100">
                {/* Pencil Icon */}
                <svg width={32} height={32} fill="none" viewBox="0 0 24 24">
                  <path
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    stroke="#2563eb"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h3 className="text-xl font-semibold mb-2">1. Create</h3>
              <p className="text-gray-600">
                Write your message or offer. It stays hidden until shared.
              </p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <span className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-100">
                {/* Share Icon */}
                <svg width={32} height={32} fill="none" viewBox="0 0 24 24">
                  <path
                    d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                    stroke="#ea580c"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h3 className="text-xl font-semibold mb-2">2. Share</h3>
              <p className="text-gray-600">
                Share your link. Each unlock forwards the message onward.
              </p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <span className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100">
                {/* Unlock Icon */}
                <svg width={32} height={32} fill="none" viewBox="0 0 24 24">
                  <path
                    d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h3 className="text-xl font-semibold mb-2">3. Unlock</h3>
              <p className="text-gray-600">
                Each recipient unlocks—and can forward—the message further!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="py-24 bg-gradient-to-br from-blue-50 to-red-50 border-t"
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Why TapForward?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">
                Viral Campaigns
              </h3>
              <p className="text-gray-600">
                Launch giveaways, discount codes, or contests that spread
                automatically.
              </p>
            </div>
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2 text-orange-700">
                Privacy First
              </h3>
              <p className="text-gray-600">
                No one can see your message until the unlock step. End-to-end
                privacy for sensitive content.
              </p>
            </div>
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2 text-red-700">
                Infinite Reach
              </h3>
              <p className="text-gray-600">
                Every unlock means another potential share—let your content
                snowball naturally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-blue-50 border-t text-center">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
          {/* Decorative Icon */}
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-red-500 via-orange-400 to-blue-600 shadow-lg">
            <svg width={32} height={32} fill="none" viewBox="0 0 24 24">
              <path
                d="M12 17.25l-6.16 3.24 1.18-6.88L2 8.76l6.92-1L12 1.5l3.08 6.26 6.92 1-5.02 4.85 1.18 6.88z"
                stroke="#fff"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
              Trusted by <span className="bg-gradient-to-tr from-blue-600 via-orange-400 to-red-500 text-transparent bg-clip-text">200+ creators</span> and teams worldwide
            </h3>
            <p className="text-gray-600 mt-2">
              Join marketers, solopreneurs, and brands unlocking viral growth with TapForward.
            </p>
          </div>
        </div>
        {/* Optional: Tiny avatars for extra social proof */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {[
            "https://randomuser.me/api/portraits/men/11.jpg",
            "https://randomuser.me/api/portraits/women/22.jpg",
            "https://randomuser.me/api/portraits/men/33.jpg",
            "https://randomuser.me/api/portraits/women/44.jpg",
            "https://randomuser.me/api/portraits/men/55.jpg",
            "https://randomuser.me/api/portraits/women/66.jpg",
            "https://randomuser.me/api/portraits/men/77.jpg",
            "https://randomuser.me/api/portraits/women/88.jpg",
          ].map((url, i) => (
            <span
              key={i}
              className="inline-block w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden"
            >
              <img
                src={url}
                alt={`User ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
      
      {/* FAQ */}
      <section id="faq" className="py-24 bg-white border-t">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-1">
                Do I need an account?
              </h3>
              <p className="text-gray-600">
                Yes, sign up to create and track your messages. It’s free to get
                started!
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">
                How does unlocking work?
              </h3>
              <p className="text-gray-600">
                Your message stays hidden until the forwarded link is opened by
                someone else. Each forward is an unlock.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">
                Can I edit after creating?
              </h3>
              <p className="text-gray-600">
                You can update your message anytime before it’s unlocked for the
                first time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">
                Is my data private?
              </h3>
              <p className="text-gray-600">
                Absolutely. Only you and the next unlocker can see the message.
                Your data is encrypted and never shared.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-14 bg-gradient-to-tr from-blue-600 via-red-500 to-orange-400 text-white text-center">
        <div className="max-w-2xl mx-auto px-6 flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Ready to unlock viral growth?
          </h2>
          <p className="mb-6 text-lg text-white/90">
            Start for free, upgrade any time.
          </p>
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
