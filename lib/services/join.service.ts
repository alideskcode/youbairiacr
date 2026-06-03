import type { SupabaseClient } from "@supabase/supabase-js"
import type { CampaignJoin } from "@/lib/types/campaign"

export async function hasUserJoined(
  supabase: SupabaseClient,
  campaignId: string,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("campaign_joins")
    .select("id")
    .eq("campaign_id", campaignId)
    .eq("user_id", userId)
    .maybeSingle()

  return !!data
}

export async function joinCampaign(
  supabase: SupabaseClient,
  campaignId: string,
  userId: string
): Promise<{ join: CampaignJoin; alreadyJoined: boolean }> {
  const existing = await hasUserJoined(supabase, campaignId, userId)
  if (existing) {
    const { data } = await supabase
      .from("campaign_joins")
      .select("*")
      .eq("campaign_id", campaignId)
      .eq("user_id", userId)
      .single()

    return { join: data as CampaignJoin, alreadyJoined: true }
  }

  const { data, error } = await supabase
    .from("campaign_joins")
    .insert({ campaign_id: campaignId, user_id: userId })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return { join: data as CampaignJoin, alreadyJoined: false }
}

export async function getJoinCount(
  supabase: SupabaseClient,
  campaignId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("campaign_joins")
    .select("*", { count: "exact", head: true })
    .eq("campaign_id", campaignId)

  if (error) throw new Error(error.message)
  return count ?? 0
}
