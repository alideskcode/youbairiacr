const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const { ZodError } = require("zod")
const env = require("./config/env")
const shopRoutes = require("./routes/shop.routes")
const productRoutes = require("./routes/product.routes")
const purchaseRoutes = require("./routes/purchase.routes")
const accessRoutes = require("./routes/access.routes")
const errorHandler = require("./middleware/error-handler")

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: env.corsOrigin === "*" ? true : env.corsOrigin,
    credentials: true,
  })
)
app.use(express.json({ limit: "1mb" }))

app.get("/health", (req, res) => {
  res.json({ ok: true })
})

app.use(shopRoutes)
app.use(productRoutes)
app.use(purchaseRoutes)
app.use(accessRoutes)

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

app.use((error, req, res, next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Invalid input",
      details: error.errors.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    })
  }

  return errorHandler(error, req, res, next)
})

module.exports = app
