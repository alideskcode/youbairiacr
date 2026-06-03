import type { SupabaseClient } from "@supabase/supabase-js"
import { createCampaign } from "@/lib/services/campaign.service"
import type { CampaignFormInput, PlatformKey } from "@/lib/types/campaign"
import type { AICampaignDraft, AICreateResponse, AIProductDraft } from "@/lib/types/ai-create"
import { aiCreateResponseSchema } from "@/lib/validators/ai-create"
import { slugify } from "@/lib/validators/campaign"
import { PLATFORMS } from "@/lib/types/campaign"
import { createProductFromAI } from "@/lib/services/product.service"

const VALID_PLATFORMS = new Set(PLATFORMS.map((p) => p.key))

function normalizePlatforms(platforms: string[]): PlatformKey[] {
  const mapped = platforms
    .map((p) =>
      p
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace("youtube_shorts", "youtube_shorts")
        .replace("youtube", "youtube_shorts")
        .replace("facebook", "facebook_reels")
        .replace("reels", "facebook_reels")
    )
    .filter((p): p is PlatformKey => VALID_PLATFORMS.has(p as PlatformKey))

  return mapped.length ? mapped : ["tiktok"]
}

function uniqueSlug(base: string): string {
  const slug = slugify(base) || "campaign"
  return `${slug}-${Date.now().toString(36)}`
}

export function parseAIResponse(raw: string): AICreateResponse {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    throw new Error("AI returned invalid JSON")
  }

  const obj = parsed as Record<string, unknown>

  // Normalize intent aliases from older prompts
  if (obj.intent === "campaign") obj.intent = "create_campaign"
  if (obj.intent === "product") obj.intent = "create_product"

  // Sanitize resources with invalid URLs before validation
  if (obj.campaign && typeof obj.campaign === "object") {
    const c = obj.campaign as Record<string, unknown>
    if (Array.isArray(c.resources)) {
      c.resources = (c.resources as Record<string, unknown>[]).filter(
        (r) => typeof r.title === "string" && r.title.trim()
      )
    }
    if (!Array.isArray(c.requirements)) c.requirements = []
    if (!Array.isArray(c.platforms)) c.platforms = ["tiktok"]
  }

  if (obj.product && typeof obj.product === "object") {
    const p = obj.product as Record<string, unknown>
    if (!Array.isArray(p.tags)) p.tags = []
  }

  const result = aiCreateResponseSchema.safeParse(obj)
  if (!result.success) {
    throw new Error(result.error.errors[0]?.message ?? "Invalid AI structure")
  }

  if (result.data.intent === "create_campaign" && !result.data.campaign) {
    throw new Error("Campaign data missing from AI response")
  }
  if (result.data.intent === "create_product" && !result.data.product) {
    throw new Error("Product data missing from AI response")
  }

  return result.data
}

export function campaignDraftToFormInput(draft: AICampaignDraft): CampaignFormInput {
  const platforms = normalizePlatforms(draft.platforms)
  const payout = Number(draft.payout_per_1k) || 0
  const budget = Number(draft.budget) || 0

  return {
    title: draft.title,
    slug: uniqueSlug(draft.title),
    description: draft.description,
    thumbnail_url: "",
    banner_url: "",
    category: draft.category,
    budget_total: budget,
    budget_remaining: budget,
    avg_review_hours: 48,
    status: "draft",
    is_featured: false,
    requirements: draft.requirements.map((r, i) => ({
      requirement: r,
      sort_order: i,
    })),
    resources: (draft.resources ?? [])
      .filter((r) => r.title?.trim() && r.url?.trim())
      .map((r) => ({
        title: r.title,
        url: r.url,
        type: (r.type ?? "external") as CampaignFormInput["resources"][0]["type"],
      })),
    earnings: platforms.map((platform) => ({
      platform,
      payout_per_1k: payout,
      minimum_payout: Math.max(payout * 2, 10),
      maximum_payout: Math.max(payout * 100, 500),
    })),
  }
}

export async function createCampaignFromAI(
  supabase: SupabaseClient,
  creatorId: string,
  draft: AICampaignDraft
) {
  const input = campaignDraftToFormInput(draft)
  return createCampaign(supabase, creatorId, input)
}

export async function createProductFromAIDraft(
  supabase: SupabaseClient,
  creatorId: string,
  draft: AIProductDraft
) {
  return createProductFromAI(supabase, creatorId, draft)
}

export const AI_SYSTEM_PROMPT = `You are Youbairia AI, a marketplace creation assistant.

Analyze the user's message and determine intent:
- create_campaign: clipping/content reward campaigns for creators
- create_product: digital products like prompt packs, templates, tools

Return ONLY valid JSON (no markdown, no code fences):

{
  "intent": "create_campaign" | "create_product",
  "message": "Friendly 1-3 sentence summary of what you created",
  "campaign": {
    "title": "",
    "description": "",
    "category": "",
    "requirements": ["string"],
    "budget": 0,
    "payout_per_1k": 0,
    "platforms": ["tiktok", "instagram", "youtube_shorts", "facebook_reels"],
    "resources": [{ "title": "", "url": "", "type": "external" }]
  },
  "product": {
    "title": "",
    "description": "",
    "category": "",
    "price": 0,
    "tags": ["string"],
    "thumbnail_prompt": ""
  }
}

Rules:
- Set campaign OR product based on intent; set the other to null
- Use realistic budget/payout for campaigns (budget 1000-50000, payout_per_1k 5-50)
- Use realistic price for products (9-199)
- Include 3-6 requirements for campaigns
- platforms must use: tiktok, instagram, youtube_shorts, facebook_reels`
