import { z } from "zod"

export const platformSchema = z.enum([
  "tiktok",
  "instagram",
  "youtube_shorts",
  "facebook_reels",
])

export const resourceTypeSchema = z.enum([
  "google_drive",
  "dropbox",
  "notion",
  "zip",
  "external",
])

export const campaignStatusSchema = z.enum([
  "draft",
  "active",
  "paused",
  "completed",
])

export const createCampaignSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().max(10000).optional().default(""),
  thumbnail_url: z.string().max(2000).optional().default(""),
  banner_url: z.string().max(2000).optional().default(""),
  category: z.string().min(1).max(100).optional().default("General"),
  budget_total: z.coerce.number().min(0),
  budget_remaining: z.coerce.number().min(0).optional(),
  avg_review_hours: z.coerce.number().int().min(1).max(720).optional().default(48),
  status: campaignStatusSchema.optional().default("draft"),
  is_featured: z.boolean().optional().default(false),
  requirements: z
    .array(
      z.object({
        requirement: z.string().min(1),
        sort_order: z.number().int().min(0),
      })
    )
    .optional()
    .default([]),
  resources: z
    .array(
      z.object({
        title: z.string().min(1),
        url: z.string().url(),
        type: resourceTypeSchema,
      })
    )
    .optional()
    .default([]),
  earnings: z
    .array(
      z.object({
        platform: platformSchema,
        payout_per_1k: z.coerce.number().min(0),
        minimum_payout: z.coerce.number().min(0),
        maximum_payout: z.coerce.number().min(0),
      })
    )
    .min(1, "At least one platform earning is required"),
  top_videos: z
    .array(
      z.object({
        creator_name: z.string().min(1),
        thumbnail: z.string().optional().default(""),
        video_url: z.string().url(),
        views: z.coerce.number().min(0).optional().default(0),
        earnings: z.coerce.number().min(0).optional().default(0),
        sort_order: z.number().int().min(0).optional().default(0),
      })
    )
    .optional()
    .default([]),
})

export const updateCampaignSchema = createCampaignSchema.partial()

export const listCampaignsQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  platform: platformSchema.optional(),
  status: campaignStatusSchema.optional(),
  featured: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(12),
})

export const submitVideoSchema = z.object({
  platform: z.string().min(1),
  video_url: z.string().url(),
  notes: z.string().max(2000).optional().default(""),
})

export const updateSubmissionSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
  views: z.coerce.number().min(0).optional(),
  earnings: z.coerce.number().min(0).optional(),
})

export const aiGenerateSchema = z.object({
  title: z.string().min(1).max(200),
  topic: z.string().max(500).optional(),
})

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}
