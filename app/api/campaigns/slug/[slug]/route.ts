import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAuthContext } from "@/lib/auth/campaign-auth"
import { ok, fail } from "@/lib/api/response"
import { getCampaignBySlug } from "@/lib/services/campaign.service"

export const dynamic = "force-dynamic"

type Params = { params: Promise<{ slug: string }> }

/** GET /api/campaigns/slug/[slug] — campaign detail by slug */
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params
    const supabase = await createServerSupabaseClient()
    const auth = await getAuthContext()

    const campaign = await getCampaignBySlug(
      supabase,
      slug,
      auth?.userId
    )

    if (!campaign) return fail("Campaign not found", 404)

    if (
      campaign.status !== "active" &&
      campaign.creator_id !== auth?.userId &&
      !auth?.isAdmin
    ) {
      return fail("Campaign not available", 404)
    }

    return ok(campaign)
  } catch (error) {
    console.error("GET /api/campaigns/slug/[slug]", error)
    return fail(
      error instanceof Error ? error.message : "Failed to fetch campaign",
      500
    )
  }
}
