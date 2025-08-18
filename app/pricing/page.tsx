"use client";

import { useAuth } from "@/lib/AuthContext";
import { useSubscription } from "@/lib/useSubscription";
import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import FeaturesHeroCta from "@/app/features/FeaturesHeroCta";

const plans = [
  {
    name: "Free",
    price: "0",
    interval: "mo",
    description: "Try all core features. 1 message/month, 1000 reach.",
    features: [
      "1 message/month",
      "Max 1000 reach",
      "Message visibility 12h",
      "Basic branding",
      "Support by email",
    ],
    cta: "Start for Free",
    color: "from-gray-100 to-white text-gray-700",
    highlight: false,
    id: null,
  },
  {
    name: "Growth",
    price: "5",
    interval: "mo",
    description: "For marketers & creators ready to grow.",
    features: [
      "3 messages/month",
      "Max 5000 reach",
      "Message visibility 24h",
      "Custom branding",
      "Support by email",
    ],
    cta: "Get Growth",
    color: "from-orange-400 to-red-400 text-white",
    highlight: true,
    monthlyId: process.env.NEXT_PUBLIC_STRIPE_GROWTH_MONTHLY_ID!,
    yearlyId: process.env.NEXT_PUBLIC_STRIPE_GROWTH_YEARLY_ID!,
  },
  {
    name: "Pro",
    price: "9",
    interval: "mo",
    description: "Best for teams and viral campaigns.",
    features: [
      "6 messages/month",
      "Max 10000 reach",
      "Message visibility 72h",
      "Custom branding",
      "Advanced analytics",
      "Priority email support",
    ],
    cta: "Get Pro",
    color: "from-blue-500 to-indigo-500 text-white",
    highlight: false,
    monthlyId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_ID!,
    yearlyId: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_ID!,
  },
];

function Loader() {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-2 border border-gray-200">
        <svg className="animate-spin h-8 w-8 text-red-600" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="font-semibold text-red-600 mt-2">
          Redirecting to Stripe…
        </span>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const { user } = useAuth();
  const { subscription, loading: subLoading } = useSubscription();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);

  const currentPlan = subscription?.plan || "free";

  async function handleCheckout(priceId: string) {
    setLoading(priceId);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, email: user?.email, userId: user?.id }),
    });
    const data = await res.json();
    setLoading(null);
    if (data.url) window.location.href = data.url;
  }

  return (
    <>
      <Head>
        <title>Pricing – TapForward</title>
        <meta
          name="description"
          content="Simple, fair pricing for every team. Unlock advanced reach, analytics, and branding with Growth or Pro plans."
        />
        <meta property="og:title" content="Pricing – TapForward" />
        <meta
          property="og:description"
          content="Simple, fair pricing for every team. Unlock advanced reach, analytics, and branding with Growth or Pro plans."
        />
        <meta property="og:image" content="/opengraph-image.jpg" />
      </Head>

      {(loading || subLoading) && <Loader />}

      {/* HERO — matches the site's gradient hero & gradient heading style */}
      <section className="pt-20 pb-10 bg-gradient-to-br from-red-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-tr from-red-600 via-orange-500 to-blue-600 text-transparent bg-clip-text mb-4">
            Pricing
          </h1>
          <p className="max-w-2xl mx-auto text-gray-700 text-lg">
            Unlock viral growth for your messages. Upgrade anytime, cancel anytime.{" "}
            <span className="font-semibold text-red-500">Risk-free.</span>
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Billing Toggle */}
          <div className="flex justify-center gap-3 mb-10">
            <button
              className={`px-5 py-2 rounded-full font-bold text-sm shadow-sm border transition-all ${
                billing === "monthly"
                  ? "bg-red-600 text-white border-red-600 scale-105"
                  : "bg-white border-gray-300 text-red-500 hover:bg-red-50"
              }`}
              onClick={() => setBilling("monthly")}
              aria-pressed={billing === "monthly"}
            >
              Monthly billing
            </button>
            <button
              className={`px-5 py-2 rounded-full font-bold text-sm shadow-sm border transition-all ${
                billing === "yearly"
                  ? "bg-red-600 text-white border-red-600 scale-105"
                  : "bg-white border-gray-300 text-red-500 hover:bg-red-50"
              }`}
              onClick={() => setBilling("yearly")}
              aria-pressed={billing === "yearly"}
            >
              Yearly billing{" "}
              <span className="text-xs ml-1 font-medium text-yellow-700">(save 17%)</span>
            </button>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const planKey = plan.name.toLowerCase();

              return (
                <div
                  key={plan.name}
                  className={`rounded-2xl shadow-xl border bg-gradient-to-br p-8 flex flex-col items-center
                  ${plan.color} ${
                    plan.highlight
                      ? "scale-105 z-10 ring-4 ring-red-100 border-2 border-orange-400"
                      : "border-gray-100"
                  }`}
                >
                  <h2 className="text-xl font-bold mb-2 tracking-wide">{plan.name}</h2>

                  <div className="text-4xl font-extrabold mb-2 flex items-end">
                    {plan.price === "0" ? (
                      <span className="text-2xl">Free</span>
                    ) : (
                      <>
                        <span>
                          $
                          {billing === "monthly"
                            ? plan.price
                            : plan.price === "5"
                            ? "50"
                            : "90"}
                        </span>
                        <span className="text-base font-medium ml-1 opacity-80">
                          /{billing === "monthly" ? "mo" : "yr"}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="mb-6 text-sm text-center">{plan.description}</p>

                  <ul className="mb-8 space-y-2 w-full text-base">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-left">
                        <svg width="22" height="22" fill="none" className="text-green-500 shrink-0">
                          <path stroke="currentColor" strokeWidth="2" d="M5 11l4 4 8-8" />
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {plan.price === "0" ? (
                    <Link
                      href="/auth/register"
                      className="w-full text-center bg-white border border-red-200 text-red-600 font-bold px-6 py-2 rounded-xl shadow hover:bg-red-50 transition"
                    >
                      {plan.cta}
                    </Link>
                  ) : currentPlan === planKey ? (
                    <span className="inline-block w-full text-center bg-green-100 border border-green-200 text-green-700 font-bold px-6 py-2 rounded-xl shadow">
                      Current Plan
                    </span>
                  ) : (
                    <div className="flex w-full gap-2">
                      <button
                        disabled={!user}
                        onClick={() =>
                          handleCheckout(
                            billing === "monthly" ? plan.monthlyId! : plan.yearlyId!
                          )
                        }
                        className={`w-full px-6 py-2 rounded-xl font-bold shadow transition text-white text-base
                          ${
                            plan.name === "Growth"
                              ? "bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500"
                              : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                          }
                          ${
                            loading && loading.startsWith(plan.name.toLowerCase())
                              ? "opacity-50 cursor-wait"
                              : ""
                          }
                        `}
                      >
                        {loading && loading.startsWith(plan.name.toLowerCase())
                          ? "Redirecting…"
                          : billing === "monthly"
                          ? `Start ${plan.cta} ($${plan.price}/mo)`
                          : `Start ${plan.cta} (${plan.price === "5" ? "$50" : "$90"}/yr)`}
                      </button>
                    </div>
                  )}

                  {!user && plan.price !== "0" && currentPlan !== planKey && (
                    <div className="text-xs text-white/80 mt-2 font-semibold">
                      <Link href="/auth/register" className="underline text-white">
                        Create an account
                      </Link>{" "}
                      to purchase
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Secure Payments */}
          <div className="text-center text-gray-400 text-xs mt-12">
            <span>
              Secured payments by <span className="font-semibold text-gray-500">Stripe</span>.
              Upgrade or cancel anytime.
            </span>
          </div>
        </div>
      </section>

      {/* CTA — matches other pages */}
      <section className="py-14 bg-gradient-to-tr from-blue-600 via-red-500 to-orange-400 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Ready to share your first message?
          </h2>
          <p className="mb-6 text-lg text-white/90">Start free. Upgrade any time.</p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <FeaturesHeroCta />
          </div>
        </div>
      </section>
    </>
  );
}
