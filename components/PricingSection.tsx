"use client";

import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "0",
    interval: "mo",
    description: "Try all core features. 1 message/month, 1000 reach.",
    features: [
      "1 message/month",
      "Max 1000 reach",
      "Basic branding",
      "Standard support",
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
      "Unlimited reach",
      "Custom branding",
      "Company name/logo",
      "Priority support",
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
      "Unlimited reach",
      "Advanced analytics",
      "Custom branding",
      "Company name/logo",
      "Team analytics",
      "Premium support",
    ],
    cta: "Get Pro",
    color: "from-blue-500 to-indigo-500 text-white",
    highlight: false,
    monthlyId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_ID!,
    yearlyId: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_ID!,
  },
];

export default function PricingSection() {
  const { user } = useAuth?.() ?? { user: null };
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);

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
    <section id="pricing" className="py-24 bg-white dark:bg-neutral-950 border-t">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">Simple, transparent pricing</h2>

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
            <span className="text-xs ml-1 font-medium text-yellow-700">
              (save 17%)
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl shadow-xl border bg-gradient-to-br p-8 flex flex-col items-center
                ${plan.color} ${
                plan.highlight
                  ? "scale-105 z-10 ring-4 ring-red-100 border-2 border-orange-400"
                  : "border-gray-100"
              }`}
            >
              <h2 className="text-xl font-bold mb-2 tracking-wide">
                {plan.name}
              </h2>
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
                    <svg
                      width="22"
                      height="22"
                      fill="none"
                      className="text-green-500 shrink-0"
                    >
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M5 11l4 4 8-8"
                      />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Call to Action */}
              {plan.price === "0" ? (
                <Link
                  href="/auth/register"
                  className="w-full text-center bg-white border border-red-200 text-red-600 font-bold px-6 py-2 rounded-xl shadow hover:bg-red-50 transition"
                >
                  {plan.cta}
                </Link>
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
                        loading && loading === (billing === "monthly" ? plan.monthlyId : plan.yearlyId)
                          ? "opacity-50 cursor-wait"
                          : ""
                      }
                    `}
                  >
                    {loading && loading === (billing === "monthly" ? plan.monthlyId : plan.yearlyId)
                      ? "Redirecting…"
                      : billing === "monthly"
                      ? `Start ${plan.cta} ($${plan.price}/mo)`
                      : `Start ${plan.cta} (${plan.price === "5" ? "$50" : "$90"}/yr)`}
                  </button>
                </div>
              )}
              {!user && plan.price !== "0" && (
                <div className="text-xs text-white/80 mt-2 font-semibold">
                  <Link href="/auth/register" className="underline text-white">
                    Create an account
                  </Link>{" "}
                  to purchase
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}