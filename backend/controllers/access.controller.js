const { productLookupSchema } = require("../services/validators")
const { getProductLinkForPurchasedUser } = require("../services/product.service")

async function downloadController(req, res) {
  const input = productLookupSchema.parse({
    product_id: req.params.product_id || req.query.product_id,
  })

  const contentLink = await getProductLinkForPurchasedUser(input.product_id, req.user.id)

  // Redirect keeps the original link out of normal product/listing API responses.
  return res.redirect(302, contentLink)
}

async function accessLinkController(req, res) {
  const input = productLookupSchema.parse({
    product_id: req.params.product_id || req.query.product_id,
  })

  const contentLink = await getProductLinkForPurchasedUser(input.product_id, req.user.id)
  return res.json({ content_link: contentLink })
}

module.exports = {
  downloadController,
  accessLinkController,
}
