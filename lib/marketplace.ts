import { z } from "zod"

export const productTypes = ["course", "software", "community", "download", "bundle"] as const

export type ProductType = (typeof productTypes)[number]

export type MarketplaceProduct = {
  id: string
  creator_id: string
  slug?: string | null
  title: string
  subtitle?: string | null
  description: string
  category: string
  product_type: ProductType
  price: number
  currency: string
  tags?: string[] | null
  includes?: string[] | null
  cover_url?: string | null
  thumbnail_url?: string | null
  access_url?: string | null
  demo_url?: string | null
  telegram_chat_id?: string | null
  telegram_invite_url?: string | null
  license_terms?: string | null
  seller_name?: string | null
  support_email?: string | null
  status: "draft" | "active" | "archived"
  created_at: string
  updated_at: string
}

export const sellerProductSchema = z.object({
  title: z.string().min(3).max(160),
  subtitle: z.string().max(220).optional().default(""),
  description: z.string().min(20).max(12000),
  category: z.string().min(2).max(80),
  product_type: z.enum(productTypes).default("download"),
  price: z.coerce.number().min(0).max(999999),
  currency: z.string().min(3).max(3).default("INR"),
  tags: z.array(z.string().min(1).max(40)).max(12).optional().default([]),
  includes: z.array(z.string().min(1).max(120)).max(20).optional().default([]),
  cover_url: z.string().url().or(z.literal("")).optional().default(""),
  access_url: z.string().url().or(z.literal("")).optional().default(""),
  demo_url: z.string().url().or(z.literal("")).optional().default(""),
  telegram_chat_id: z.string().max(200).optional().default(""),
  telegram_invite_url: z.string().url().or(z.literal("")).optional().default(""),
  license_terms: z.string().max(4000).optional().default(""),
  seller_name: z.string().max(120).optional().default(""),
  support_email: z.string().email().or(z.literal("")).optional().default(""),
  status: z.enum(["draft", "active", "archived"]).default("active"),
})

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        quantity: z.coerce.number().int().min(1).max(20).default(1),
      })
    )
    .min(1)
    .max(20),
})

export function formatMoney(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}

export function makeProductSlug(title: string, idSeed = "") {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70)

  return `${base || "product"}${idSeed ? `-${idSeed.slice(0, 8)}` : ""}`
}

export function publicProductSelect() {
  return [
    "id",
    "creator_id",
    "slug",
    "title",
    "subtitle",
    "description",
    "category",
    "product_type",
    "price",
    "currency",
    "tags",
    "includes",
    "cover_url",
    "thumbnail_url",
    "demo_url",
    "seller_name",
    "support_email",
    "status",
    "created_at",
    "updated_at",
  ].join(",")
}
