const express = require("express")
const asyncHandler = require("../middleware/async-handler")
const { requireAuth } = require("../middleware/auth")
const {
  createShopController,
  getShopController,
  myShopController,
} = require("../controllers/shop.controller")

const router = express.Router()

router.post("/create-shop", requireAuth, asyncHandler(createShopController))
router.get("/my-shop", requireAuth, asyncHandler(myShopController))
router.get("/shop/:shop_slug", asyncHandler(getShopController))
router.get("/shop", asyncHandler(getShopController))

module.exports = router
