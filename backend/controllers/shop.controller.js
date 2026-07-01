const {
  createShopSchema,
  shopLookupSchema,
} = require("../services/validators")
const {
  createShop,
  getPublicShop,
  listMyShops,
} = require("../services/shop.service")

async function createShopController(req, res) {
  const input = createShopSchema.parse(req.body)
  const shop = await createShop(req.user.id, input)
  return res.status(201).json({ shop })
}

async function getShopController(req, res) {
  const input = shopLookupSchema.parse({
    shop_id: req.params.shop_id || req.query.shop_id,
    shop_slug: req.params.shop_slug || req.query.shop_slug,
  })

  if (!input.shop_id && !input.shop_slug) {
    return res.status(400).json({ error: "shop_id or shop_slug is required" })
  }

  const shop = await getPublicShop(input)
  return res.json({ shop })
}

async function myShopController(req, res) {
  const shops = await listMyShops(req.user.id)
  return res.json({ shops })
}

module.exports = {
  createShopController,
  getShopController,
  myShopController,
}
