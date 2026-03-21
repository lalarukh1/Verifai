import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { markAsPaid } from "@/lib/redis";

export async function POST(req: NextRequest) {
  // Initialise lazily so missing env vars don't blow up at build time
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  if (!webhookSecret) {
    console.error("CRITICAL: STRIPE_WEBHOOK_SECRET is not set - rejecting webhook");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Handle successful checkout → mark the email as a paid user in Redis
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email =
      session.customer_details?.email ?? session.customer_email ?? null;

    if (email) {
      await markAsPaid(email);
      console.log(`✅ [Stripe] Marked ${email} as paid`);
    } else {
      console.warn("⚠️  [Stripe] checkout.session.completed fired but no email found");
    }
  }

  // Also handle subscription renewals / reactivations
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const email = invoice.customer_email ?? null;
    if (email) {
      await markAsPaid(email);
      console.log(`✅ [Stripe] Renewed paid status for ${email}`);
    }
  }

  return NextResponse.json({ received: true });
}
