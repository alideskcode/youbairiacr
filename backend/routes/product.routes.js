const express = require("express")
const asyncHandler = require("../middleware/async-handler")
const { requireAuth } = require("../middleware/auth")
const {
  createProductController,
  listProductsController,
  getProductController,
} = require("../controllers/product.controller")

const router = express.Router()

router.post("/products/create", requireAuth, asyncHandler(createProductController))
router.get("/products", asyncHandler(listProductsController))
router.get("/product/:product_id", asyncHandler(getProductController))
router.get("/product", asyncHandler(getProductController))

module.exports = router
