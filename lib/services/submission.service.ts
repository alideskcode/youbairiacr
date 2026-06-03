import type { SupabaseClient } from "@supabase/supabase-js"
import type { CampaignSubmission, SubmissionStatus } from "@/lib/types/campaign"

export type SubmissionWithRelations = CampaignSubmission & {
  campaign?: { id: string; title: string; slug: string; creator_id: string }
  submitter?: { id: string; email: string | null; full_name: string | null }
}

export async function createSubmission(
  supabase: SupabaseClient,
  input: {
    campaign_id: string
    user_id: string
    platform: string
    video_url: string
    notes: string
  }
): Promise<CampaignSubmission> {
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, status")
    .eq("id", input.campaign_id)
    .single()

  if (!campaign) throw new Error("Campaign not found")
  if (campaign.status !== "active") {
    throw new Error("Campaign is not accepting submissions")
  }

  const { data, error } = await supabase
    .from("campaign_submissions")
    .insert({
      campaign_id: input.campaign_id,
      user_id: input.user_id,
      platform: input.platform,
      video_url: input.video_url,
      notes: input.notes,
      status: "pending",
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as CampaignSubmission
}

export async function listSubmissionsForManager(
  supabase: SupabaseClient,
  options: {
    creatorId?: string
    isAdmin?: boolean
    status?: SubmissionStatus
    campaignId?: string
    page?: number
    limit?: number
  }
): Promise<{ submissions: SubmissionWithRelations[]; total: number }> {
  const page = options.page ?? 1
  const limit = options.limit ?? 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from("campaign_submissions")
    .select(
      `*, campaign:campaigns(id, title, slug, creator_id)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to)

  if (options.status) query = query.eq("status", options.status)
  if (options.campaignId) query = query.eq("campaign_id", options.campaignId)

  if (!options.isAdmin && options.creatorId) {
    const { data: owned } = await supabase
      .from("campaigns")
      .select("id")
      .eq("creator_id", options.creatorId)

    const ids = (owned ?? []).map((c) => c.id)
    if (ids.length === 0) return { submissions: [], total: 0 }
    query = query.in("campaign_id", ids)
  }

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  const rows = (data ?? []) as SubmissionWithRelations[]
  const userIds = [...new Set(rows.map((r) => r.user_id))]
  let profileMap = new Map<string, { id: string; email: string | null; full_name: string | null }>()

  if (userIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .in("id", userIds)

    profileMap = new Map((profiles ?? []).map((p) => [p.id, p]))
  }

  const submissions = rows.map((r) => ({
    ...r,
    submitter: profileMap.get(r.user_id) ?? null,
  }))

  return { submissions, total: count ?? 0 }
}

export async function updateSubmissionStatus(
  supabase: SupabaseClient,
  submissionId: string,
  update: {
    status: SubmissionStatus
    views?: number
    earnings?: number
  }
): Promise<CampaignSubmission> {
  const { data, error } = await supabase
    .from("campaign_submissions")
    .update({
      status: update.status,
      ...(update.views !== undefined && { views: update.views }),
      ...(update.earnings !== undefined && { earnings: update.earnings }),
    })
    .eq("id", submissionId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  if (!data) throw new Error("Submission not found")
  return data as CampaignSubmission
}
