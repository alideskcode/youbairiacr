const { buySchema } = require("../services/validators")
const { buyProduct, listMyPurchases } = require("../services/purchase.service")

async function buyController(req, res) {
  const input = buySchema.parse(req.body)
  const purchase = await buyProduct(req.user.id, input)
  return res.status(201).json({ purchase })
}

async function myPurchasesController(req, res) {
  const purchases = await listMyPurchases(req.user.id)
  return res.json({ purchases })
}

module.exports = {
  buyController,
  myPurchasesController,
}
