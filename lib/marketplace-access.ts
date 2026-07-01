import type { SupabaseClient } from "@supabase/supabase-js"

export async function grantOrderEntitlements(
  supabase: SupabaseClient,
  orderId: string,
  providerPaymentId?: string | null
) {
  const { data: order, error: orderError } = await supabase
    .from("marketplace_orders")
    .select("id,buyer_id,status")
    .eq("id", orderId)
    .maybeSingle()

  if (orderError) throw new Error(orderError.message)
  if (!order) throw new Error("Order not found")

  const { error: updateError } = await supabase
    .from("marketplace_orders")
    .update({
      status: "paid",
      provider_payment_id: providerPaymentId ?? null,
      paid_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  if (updateError) throw new Error(updateError.message)

  const { data: items, error: itemsError } = await supabase
    .from("marketplace_order_items")
    .select(
      "order_id,product_id,seller_id,product_type,digital_products(telegram_chat_id,telegram_invite_url)"
    )
    .eq("order_id", orderId)

  if (itemsError) throw new Error(itemsError.message)

  for (const item of items ?? []) {
    const { data: entitlement, error: entitlementError } = await supabase
      .from("entitlements")
      .upsert(
        {
          user_id: order.buyer_id,
          product_id: item.product_id,
          order_id: orderId,
          seller_id: item.seller_id,
          status: "active",
          starts_at: new Date().toISOString(),
        },
        { onConflict: "user_id,product_id,order_id" }
      )
      .select("id")
      .single()

    if (entitlementError) throw new Error(entitlementError.message)

    const product = Array.isArray(item.digital_products)
      ? item.digital_products[0]
      : item.digital_products

    if (item.product_type === "community" && product?.telegram_invite_url) {
      const { error: telegramError } = await supabase
        .from("telegram_access_grants")
        .upsert(
          {
            entitlement_id: entitlement.id,
            user_id: order.buyer_id,
            product_id: item.product_id,
            telegram_chat_id: product.telegram_chat_id ?? "",
            invite_url: product.telegram_invite_url,
            status: "granted",
            granted_at: new Date().toISOString(),
          },
          { onConflict: "entitlement_id" }
        )

      if (telegramError) throw new Error(telegramError.message)
    }
  }
}
