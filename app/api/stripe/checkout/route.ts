import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-06-30.basil" });
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { priceId, email, userId } = await req.json();

    if (!priceId || !email || !userId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Find or create Stripe customer
    let stripeCustomerId: string | undefined = undefined;
    let { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Supabase profile fetch error", profileError);
      return NextResponse.json({ error: "Profile fetch error" }, { status: 500 });
    }

    if (profile && profile.stripe_customer_id) {
      stripeCustomerId = profile.stripe_customer_id;
    } else {
      // Create new customer in Stripe
      const customer = await stripe.customers.create({ email });
      stripeCustomerId = customer.id;
      // Save customer id to profile for future lookups
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ stripe_customer_id: customer.id })
        .eq("id", userId);
      if (updateError) {
        console.error("Error updating stripe_customer_id in Supabase", updateError);
      }
    }

    if (!stripeCustomerId) {
      return NextResponse.json({ error: "Stripe customer creation failed" }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      // payment_method_types: ["card"], // optional: only if you want to force "card"
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/account?sub=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?sub=cancel`,
      metadata: { user_id: userId },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
