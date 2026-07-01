const express = require("express")
const asyncHandler = require("../middleware/async-handler")
const { requireAuth } = require("../middleware/auth")
const {
  buyController,
  myPurchasesController,
} = require("../controllers/purchase.controller")

const router = express.Router()

router.post("/buy", requireAuth, asyncHandler(buyController))
router.get("/my-purchases", requireAuth, asyncHandler(myPurchasesController))

module.exports = router
