import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAuthContext } from "@/lib/auth/campaign-auth"
import { ok, fail } from "@/lib/api/response"
import { updateCampaignSchema } from "@/lib/validators/campaign"
import {
  deleteCampaign,
  getCampaignById,
  updateCampaign,
} from "@/lib/services/campaign.service"
import type { CampaignFormInput } from "@/lib/types/campaign"

export const dynamic = "force-dynamic"

type Params = { params: Promise<{ id: string }> }

async function canManage(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  campaignId: string,
  userId: string,
  isAdmin: boolean
) {
  if (isAdmin) return true
  const campaign = await getCampaignById(supabase, campaignId)
  return campaign?.creator_id === userId
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const auth = await getAuthContext()
    if (!auth?.isSeller) return fail("Unauthorized", 403)

    const supabase = await createServerSupabaseClient()
    const allowed = await canManage(supabase, id, auth.userId, auth.isAdmin)
    if (!allowed) return fail("Forbidden", 403)

    const body = await request.json()
    const parsed = updateCampaignSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.errors[0]?.message ?? "Invalid payload", 400)
    }

    const campaign = await updateCampaign(
      supabase,
      id,
      parsed.data as Partial<CampaignFormInput>
    )

    return ok(campaign)
  } catch (error) {
    console.error("PATCH /api/campaigns/[id]", error)
    return fail(
      error instanceof Error ? error.message : "Failed to update campaign",
      500
    )
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const auth = await getAuthContext()
    if (!auth?.isSeller) return fail("Unauthorized", 403)

    const supabase = await createServerSupabaseClient()
    const allowed = await canManage(supabase, id, auth.userId, auth.isAdmin)
    if (!allowed) return fail("Forbidden", 403)

    await deleteCampaign(supabase, id)
    return ok({ deleted: true })
  } catch (error) {
    console.error("DELETE /api/campaigns/[id]", error)
    return fail(
      error instanceof Error ? error.message : "Failed to delete campaign",
      500
    )
  }
}
