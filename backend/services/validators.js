const { z } = require("zod")

const uuid = z.string().uuid()

const externalUrl = z
  .string()
  .trim()
  .url("Must be a valid URL")
  .refine((value) => ["http:", "https:"].includes(new URL(value).protocol), {
    message: "Only http and https links are allowed",
  })

const createShopSchema = z.object({
  shop_name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(1000).optional().default(""),
  logo_upload: externalUrl.optional().or(z.literal("")).default(""),
})

const createProductSchema = z.object({
  shop_id: uuid,
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().min(1).max(4000),
  price: z.coerce.number().min(0),
  content_link: externalUrl,
  thumbnail: externalUrl.optional().or(z.literal("")).default(""),
})

const productLookupSchema = z.object({
  product_id: uuid,
})

const productListSchema = z.object({
  shop_id: uuid.optional(),
})

const shopLookupSchema = z.object({
  shop_id: uuid.optional(),
  shop_slug: z.string().trim().min(1).max(100).optional(),
})

const buySchema = z.object({
  product_id: uuid,
  payment_status: z
    .enum(["pending", "paid", "completed", "failed", "refunded"])
    .optional()
    .default("paid"),
})

module.exports = {
  createShopSchema,
  createProductSchema,
  productLookupSchema,
  productListSchema,
  shopLookupSchema,
  buySchema,
}
