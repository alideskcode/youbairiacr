import { z } from "zod"
import { platformSchema, resourceTypeSchema } from "@/lib/validators/campaign"

export const aiResourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().optional().default(""),
  type: resourceTypeSchema.optional().default("external"),
})

export const aiCampaignDraftSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(10000),
  category: z.string().min(1).max(100),
  requirements: z.array(z.string().min(1)).default([]),
  budget: z.coerce.number().min(0),
  payout_per_1k: z.coerce.number().min(0),
  platforms: z.array(z.string()).min(1),
  resources: z.array(aiResourceSchema).default([]),
})

export const aiProductDraftSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(10000),
  category: z.string().min(1).max(100),
  price: z.coerce.number().min(0),
  tags: z.array(z.string()).default([]),
  thumbnail_prompt: z.string().max(2000).optional().default(""),
})

export const aiCreateResponseSchema = z.object({
  intent: z.enum(["create_campaign", "create_product"]),
  message: z.string().min(1),
  campaign: aiCampaignDraftSchema.nullish(),
  product: aiProductDraftSchema.nullish(),
})

export const createProductSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(10000),
  category: z.string().min(1).max(100),
  price: z.coerce.number().min(0),
  tags: z.array(z.string()).optional().default([]),
  thumbnail_url: z.string().max(2000).optional().default(""),
  thumbnail_prompt: z.string().max(2000).optional().default(""),
  status: z.enum(["draft", "active", "archived"]).optional().default("draft"),
})

export const aiCreateRequestSchema = z.object({
  message: z.string().min(1).max(4000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
})
