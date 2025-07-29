import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-06-30.basil" });
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Map Stripe price IDs to your internal plans
const PRICE_MAP: Record<string, string> = {
  [process.env.NEXT_PUBLIC_STRIPE_GROWTH_MONTHLY_ID!]: "growth",
  [process.env.NEXT_PUBLIC_STRIPE_GROWTH_YEARLY_ID!]: "growth",
  [process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_ID!]: "pro",
  [process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_ID!]: "pro",
};

export async function POST(req: NextRequest) {
  // If your Next.js version requires it:
  // const reqHeaders = await headers();
  const reqHeaders = await headers();
  const sig = reqHeaders.get("stripe-signature")!;
  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Stripe Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  async function upsertSubscription(stripeCustomerId: string, subscription: Stripe.Subscription) {
    // 1. Try to find profile by stripe_customer_id
    let { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .eq("stripe_customer_id", stripeCustomerId)
      .maybeSingle();

    // 2. If not found, try by email
    if (!profile) {
      const customer = await stripe.customers.retrieve(stripeCustomerId) as Stripe.Customer;
      const customerEmail = typeof customer.email === "string" ? customer.email : null;
      if (customerEmail) {
        const { data: profileByEmail } = await supabaseAdmin
          .from("profiles")
          .select("id, email")
          .eq("email", customerEmail)
          .maybeSingle();
        if (profileByEmail) {
          // Save stripe_customer_id to user profile for future lookups
          await supabaseAdmin
            .from("profiles")
            .update({ stripe_customer_id: stripeCustomerId })
            .eq("id", profileByEmail.id);
          profile = profileByEmail;
        }
      }
    }

    if (!profile) {
      console.error("Could not find profile for Stripe customer", stripeCustomerId);
      return;
    }

    // 3. Map Stripe price id to plan
    const priceId = subscription.items.data[0]?.price.id;
    const plan = PRICE_MAP[priceId!] || "unknown";
    
    const sub: any = subscription;
    const { error: upsertError } = await supabaseAdmin.from("subscriptions").upsert(
      {
        user_id: profile.id,
        stripe_subscription_id: subscription.id,
        stripe_price_id: priceId,
        plan,
        status: subscription.status,
        period_start: sub.current_period_start ? new Date(sub.current_period_start * 1000) : null,
        period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null,
      },
      { onConflict: "stripe_subscription_id" }
    );
    if (upsertError) {
      console.error("Error upserting subscription:", upsertError);
    }
  }

  // Handle the relevant Stripe events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.customer && session.metadata?.user_id) {
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ stripe_customer_id: session.customer as string })
          .eq("id", session.metadata.user_id);
        if (error) console.error("Error updating stripe_customer_id on checkout complete", error);
      } else {
        console.warn("checkout.session.completed missing customer or user_id metadata", session);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await upsertSubscription(subscription.customer as string, subscription);
      break;
    }
    // Optionally handle payment failures, etc.
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
