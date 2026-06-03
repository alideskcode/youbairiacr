import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAuthContext } from "@/lib/auth/campaign-auth"
import { ok, fail } from "@/lib/api/response"
import {
  createCampaignSchema,
  listCampaignsQuerySchema,
} from "@/lib/validators/campaign"
import {
  createCampaign,
  listCampaigns,
} from "@/lib/services/campaign.service"
import type { CampaignFormInput } from "@/lib/types/campaign"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams)
    const parsed = listCampaignsQuerySchema.safeParse(params)
    if (!parsed.success) {
      return fail(parsed.error.errors[0]?.message ?? "Invalid query", 400)
    }

    const supabase = await createServerSupabaseClient()
    const auth = await getAuthContext()
    const isManager = auth?.isSeller

    const result = await listCampaigns(supabase, {
      search: parsed.data.search,
      category: parsed.data.category,
      platform: parsed.data.platform,
      status: parsed.data.status,
      featured: parsed.data.featured,
      page: parsed.data.page,
      limit: parsed.data.limit,
      publicOnly: !isManager,
      status: !isManager ? "active" : parsed.data.status,
      userId: auth?.userId,
    })

    return ok(result)
  } catch (error) {
    console.error("GET /api/campaigns", error)
    return fail(
      error instanceof Error ? error.message : "Failed to fetch campaigns",
      500
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const bearerToken = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? null
    const auth = await getAuthContext(bearerToken)
    if (!auth?.isSeller) {
      return fail("Seller or admin access required", 403)
    }

    const body = await request.json()
    const parsed = createCampaignSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.errors[0]?.message ?? "Invalid payload", 400)
    }

    const input: CampaignFormInput = {
      ...parsed.data,
      budget_remaining:
        parsed.data.budget_remaining ?? parsed.data.budget_total,
      thumbnail_url: parsed.data.thumbnail_url || "",
      banner_url: parsed.data.banner_url || "",
    }

    const supabase = await createServerSupabaseClient()
    const campaign = await createCampaign(supabase, auth.userId, input)

    return ok(campaign, 201)
  } catch (error) {
    console.error("POST /api/campaigns", error)
    return fail(
      error instanceof Error ? error.message : "Failed to create campaign",
      500
    )
  }
}
