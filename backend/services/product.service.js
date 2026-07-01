const { db } = require("../config/supabase")
const { httpError } = require("../utils/errors")
const { assertShopOwner } = require("./shop.service")

const publicProductFields =
  "product_id, shop_id, title, description, price, thumbnail, created_at"

async function createProduct(ownerId, input) {
  await assertShopOwner(input.shop_id, ownerId)

  const { data, error } = await db
    .from("products")
    .insert({
      shop_id: input.shop_id,
      title: input.title,
      description: input.description,
      price: input.price,
      content_link: input.content_link,
      thumbnail: input.thumbnail || null,
    })
    .select(publicProductFields)
    .single()

  if (error) throw httpError(500, error.message)
  return data
}

async function listPublicProducts({ shop_id } = {}) {
  let query = db.from("products").select(publicProductFields).order("created_at", {
    ascending: false,
  })

  if (shop_id) query = query.eq("shop_id", shop_id)

  const { data, error } = await query
  if (error) throw httpError(500, error.message)
  return data || []
}

async function getPublicProduct(productId) {
  const { data, error } = await db
    .from("products")
    .select(publicProductFields)
    .eq("product_id", productId)
    .maybeSingle()

  if (error) throw httpError(500, error.message)
  if (!data) throw httpError(404, "Product not found")
  return data
}

async function getProductLinkForPurchasedUser(productId, userId) {
  const { data: purchase, error: purchaseError } = await db
    .from("purchases")
    .select("purchase_id")
    .eq("product_id", productId)
    .eq("user_id", userId)
    .in("payment_status", ["paid", "completed"])
    .maybeSingle()

  if (purchaseError) throw httpError(500, purchaseError.message)
  if (!purchase) throw httpError(403, "Purchase required to access this product")

  // content_link is fetched only after purchase verification.
  const { data: product, error: productError } = await db
    .from("products")
    .select("product_id, content_link")
    .eq("product_id", productId)
    .maybeSingle()

  if (productError) throw httpError(500, productError.message)
  if (!product) throw httpError(404, "Product not found")

  return product.content_link
}

module.exports = {
  publicProductFields,
  createProduct,
  listPublicProducts,
  getPublicProduct,
  getProductLinkForPurchasedUser,
}
