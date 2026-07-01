const { db } = require("../config/supabase")
const { httpError } = require("../utils/errors")

async function buyProduct(userId, input) {
  const { data: product, error: productError } = await db
    .from("products")
    .select("product_id, shop_id, title, price")
    .eq("product_id", input.product_id)
    .maybeSingle()

  if (productError) throw httpError(500, productError.message)
  if (!product) throw httpError(404, "Product not found")

  const { data, error } = await db
    .from("purchases")
    .upsert(
      {
        user_id: userId,
        product_id: product.product_id,
        shop_id: product.shop_id,
        payment_status: input.payment_status,
      },
      { onConflict: "user_id,product_id" }
    )
    .select("purchase_id, user_id, product_id, shop_id, payment_status, created_at")
    .single()

  if (error) throw httpError(500, error.message)
  return data
}

async function listMyPurchases(userId) {
  const { data, error } = await db
    .from("purchases")
    .select(
      `
      purchase_id,
      user_id,
      product_id,
      shop_id,
      payment_status,
      created_at,
      products:product_id (
        product_id,
        title,
        description,
        price,
        thumbnail,
        created_at
      ),
      shops:shop_id (
        shop_id,
        shop_name,
        shop_slug
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw httpError(500, error.message)
  return data || []
}

module.exports = {
  buyProduct,
  listMyPurchases,
}
