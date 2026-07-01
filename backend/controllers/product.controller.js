const {
  createProductSchema,
  productListSchema,
  productLookupSchema,
} = require("../services/validators")
const {
  createProduct,
  listPublicProducts,
  getPublicProduct,
} = require("../services/product.service")

async function createProductController(req, res) {
  const input = createProductSchema.parse(req.body)
  const product = await createProduct(req.user.id, input)
  return res.status(201).json({ product })
}

async function listProductsController(req, res) {
  const input = productListSchema.parse({ shop_id: req.query.shop_id })
  const products = await listPublicProducts(input)
  return res.json({ products })
}

async function getProductController(req, res) {
  const input = productLookupSchema.parse({
    product_id: req.params.product_id || req.query.product_id,
  })
  const product = await getPublicProduct(input.product_id)
  return res.json({ product })
}

module.exports = {
  createProductController,
  listProductsController,
  getProductController,
}
