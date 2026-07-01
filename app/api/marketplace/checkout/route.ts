import { NextRequest } from "next/server"
import { getAuthContext } from "@/lib/auth/campaign-auth"
import { ok, fail } from "@/lib/api/response"
import { checkoutSchema } from "@/lib/marketplace"
import { createServiceSupabaseClient } from "@/lib/supabase/server"
import { getStripe } from "@/lib/stripe"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext()
    if (!auth) return fail("Authentication required", 401)

    const parsed = checkoutSchema.safeParse(await req.json())
    if (!parsed.success) {
      return fail(parsed.error.errors[0]?.message ?? "Invalid checkout", 400, parsed.error.flatten())
    }

    const supabase = createServiceSupabaseClient()
    if (!supabase) return fail("SUPABASE_SERVICE_ROLE_KEY is required for checkout", 500)

    const productIds = parsed.data.items.map((item) => item.product_id)
    const { data: products, error: productsError } = await supabase
      .from("digital_products")
      .select("id,creator_id,title,product_type,price,currency,status")
      .in("id", productIds)
      .eq("status", "active")

    if (productsError) throw new Error(productsError.message)
    if (!products || products.length !== productIds.length) {
      return fail("One or more products are unavailable", 400)
    }

    const items = parsed.data.items.map((item) => {
      const product = products.find((candidate) => candidate.id === item.product_id)
      if (!product) throw new Error("Product unavailable")
      const quantity = item.quantity
      const unitPrice = Number(product.price)
      return {
        product,
        quantity,
        unitPrice,
        total: Number((unitPrice * quantity).toFixed(2)),
      }
    })

    const currency = products[0]?.currency ?? "INR"
    const subtotal = Number(items.reduce((sum, item) => sum + item.total, 0).toFixed(2))
    const platformFee = Number((subtotal * 0.1).toFixed(2))
    const total = Number((subtotal + platformFee).toFixed(2))

    const { data: order, error: orderError } = await supabase
      .from("marketplace_orders")
      .insert({
        buyer_id: auth.userId,
        status: "pending",
        currency,
        subtotal,
        platform_fee: platformFee,
        total,
        payment_provider: "stripe",
      })
      .select("id,total,currency")
      .single()

    if (orderError) throw new Error(orderError.message)

    const { error: itemsError } = await supabase.from("marketplace_order_items").insert(
      items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        seller_id: item.product.creator_id,
        title: item.product.title,
        product_type: item.product.product_type,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total: item.total,
      }))
    )

    if (itemsError) throw new Error(itemsError.message)

    const stripe = getStripe()
    if (!stripe) {
      return ok({
        order_id: order.id,
        status: "pending",
        message: "Order created. Configure STRIPE_SECRET_KEY to create hosted checkout sessions.",
      })
    }

    const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: auth.email || undefined,
      success_url: `${origin}/orders?checkout=success&order=${order.id}`,
      cancel_url: `${origin}/checkout?cancelled=true`,
      metadata: {
        order_id: order.id,
        buyer_id: auth.userId,
      },
      line_items: [
        ...items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: currency.toLowerCase(),
            unit_amount: Math.round(item.unitPrice * 100),
            product_data: {
              name: item.product.title,
            },
          },
        })),
        {
          quantity: 1,
          price_data: {
            currency: currency.toLowerCase(),
            unit_amount: Math.round(platformFee * 100),
            product_data: {
              name: "Youbairia platform fee",
            },
          },
        },
      ],
    })

    const { error: updateError } = await supabase
      .from("marketplace_orders")
      .update({ provider_checkout_id: session.id })
      .eq("id", order.id)

    if (updateError) throw new Error(updateError.message)

    return ok({
      order_id: order.id,
      checkout_url: session.url,
      checkout_id: session.id,
    })
  } catch (error) {
    console.error("POST /api/marketplace/checkout", error)
    return fail(error instanceof Error ? error.message : "Failed to start checkout", 500)
  }
}
