import { NextRequest, NextResponse } from "next/server"
import { createServiceSupabaseClient } from "@/lib/supabase/server"
import { getStripe } from "@/lib/stripe"
import { grantOrderEntitlements } from "@/lib/marketplace-access"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const supabase = createServiceSupabaseClient()

  if (!stripe || !webhookSecret || !supabase) {
    return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 500 })
  }

  const body = await req.text()
  const signature = req.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object
      const orderId = session.metadata?.order_id
      if (!orderId) throw new Error("Stripe session is missing order_id metadata")

      const { error: paymentError } = await supabase
        .from("marketplace_payments")
        .insert({
          order_id: orderId,
          provider: "stripe",
          provider_event_id: event.id,
          provider_payment_id:
            typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
          status: session.payment_status ?? "paid",
          amount: Number(session.amount_total ?? 0) / 100,
          currency: session.currency?.toUpperCase() ?? "INR",
          payload: event as unknown as Record<string, unknown>,
        })

      if (paymentError && paymentError.code !== "23505") {
        throw new Error(paymentError.message)
      }

      await grantOrderEntitlements(
        supabase,
        orderId,
        typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id
      )
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("POST /api/marketplace/stripe/webhook", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook failed" },
      { status: 400 }
    )
  }
}
