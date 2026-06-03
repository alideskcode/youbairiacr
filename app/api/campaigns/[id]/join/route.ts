import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAuthContext } from "@/lib/auth/campaign-auth"
import { ok, fail } from "@/lib/api/response"
import { joinCampaign } from "@/lib/services/join.service"
import { getCampaignById } from "@/lib/services/campaign.service"

export const dynamic = "force-dynamic"

type Params = { params: Promise<{ id: string }> }

export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const auth = await getAuthContext()
    if (!auth) return fail("Authentication required", 401)

    const { id } = await params
    const supabase = await createServerSupabaseClient()

    const campaign = await getCampaignById(supabase, id)
    if (!campaign) return fail("Campaign not found", 404)
    if (campaign.status !== "active") {
      return fail("Campaign is not active", 400)
    }

    const result = await joinCampaign(supabase, id, auth.userId)

    return ok({
      joined: true,
      alreadyJoined: result.alreadyJoined,
      join: result.join,
    })
  } catch (error) {
    console.error("POST /api/campaigns/[id]/join", error)
    return fail(
      error instanceof Error ? error.message : "Failed to join campaign",
      500
    )
  }
}
