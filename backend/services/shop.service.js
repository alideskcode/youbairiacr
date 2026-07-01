const { db } = require("../config/supabase")
const { httpError } = require("../utils/errors")
const slugify = require("../utils/slugify")

const MAX_SHOPS_PER_USER = 5

async function createUniqueSlug(shopName) {
  const base = slugify(shopName)
  if (!base) throw httpError(400, "Shop name must contain letters or numbers")

  let slug = base
  let suffix = 1

  while (true) {
    const { data, error } = await db
      .from("shops")
      .select("shop_id")
      .eq("shop_slug", slug)
      .maybeSingle()

    if (error) throw httpError(500, error.message)
    if (!data) return slug

    suffix += 1
    slug = `${base}-${suffix}`
  }
}

async function createShop(ownerId, input) {
  const { count, error: countError } = await db
    .from("shops")
    .select("shop_id", { count: "exact", head: true })
    .eq("owner_id", ownerId)

  if (countError) throw httpError(500, countError.message)
  if ((count || 0) >= MAX_SHOPS_PER_USER) {
    throw httpError(403, `Shop limit reached. Maximum ${MAX_SHOPS_PER_USER} shops per user.`)
  }

  const shopSlug = await createUniqueSlug(input.shop_name)

  const { data, error } = await db
    .from("shops")
    .insert({
      owner_id: ownerId,
      shop_name: input.shop_name,
      shop_slug: shopSlug,
      description: input.description,
      logo_upload: input.logo_upload || null,
    })
    .select("shop_id, owner_id, shop_name, shop_slug, description, logo_upload, created_at")
    .single()

  if (error) {
    if (error.code === "23505") {
      throw httpError(409, "Shop name already exists")
    }
    throw httpError(500, error.message)
  }

  return data
}

async function getPublicShop({ shop_id, shop_slug }) {
  let query = db
    .from("shops")
    .select("shop_id, shop_name, shop_slug, description, logo_upload, created_at")

  if (shop_id) query = query.eq("shop_id", shop_id)
  if (shop_slug) query = query.eq("shop_slug", shop_slug)

  const { data, error } = await query.maybeSingle()
  if (error) throw httpError(500, error.message)
  if (!data) throw httpError(404, "Shop not found")

  return data
}

async function listMyShops(ownerId) {
  const { data, error } = await db
    .from("shops")
    .select("shop_id, owner_id, shop_name, shop_slug, description, logo_upload, created_at")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })

  if (error) throw httpError(500, error.message)
  return data || []
}

async function assertShopOwner(shopId, ownerId) {
  const { data, error } = await db
    .from("shops")
    .select("shop_id, owner_id")
    .eq("shop_id", shopId)
    .maybeSingle()

  if (error) throw httpError(500, error.message)
  if (!data) throw httpError(404, "Shop not found")
  if (data.owner_id !== ownerId) throw httpError(403, "You do not own this shop")

  return data
}

module.exports = {
  MAX_SHOPS_PER_USER,
  createShop,
  getPublicShop,
  listMyShops,
  assertShopOwner,
}
