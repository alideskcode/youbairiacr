const express = require("express")
const asyncHandler = require("../middleware/async-handler")
const { requireAuth } = require("../middleware/auth")
const {
  downloadController,
  accessLinkController,
} = require("../controllers/access.controller")

const router = express.Router()

router.get("/download/:product_id", requireAuth, asyncHandler(downloadController))
router.get("/download", requireAuth, asyncHandler(downloadController))
router.get("/access-link/:product_id", requireAuth, asyncHandler(accessLinkController))
router.get("/access-link", requireAuth, asyncHandler(accessLinkController))

module.exports = router
