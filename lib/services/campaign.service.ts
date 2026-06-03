import type { SupabaseClient } from "@supabase/supabase-js"
import type {
  Campaign,
  CampaignDetail,
  CampaignEarning,
  CampaignFormInput,
  CampaignListItem,
} from "@/lib/types/campaign"
import { hasUserJoined, getJoinCount } from "@/lib/services/join.service"
import { slugify } from "@/lib/validators/campaign"

const CAMPAIGN_SELECT = `*, earnings:campaign_earnings(*)`

/** Map legacy Supabase rows (seller_id, thumbnail, budget) to app Campaign shape */
function normalizeCampaignRow(row: Record<string, unknown>): Campaign {
  const id = String(row.id ?? "")
  const title = String(row.title ?? "Untitled")
  const legacySlug = row.slug ? String(row.slug) : ""
  const slug =
    legacySlug ||
    `${slugify(title) || "campaign"}-${id.slice(0, 8)}`

  return {
    id,
    title,
    slug,
    description: String(row.description ?? ""),
    thumbnail_url: String(row.thumbnail_url ?? row.thumbnail ?? ""),
    banner_url: String(row.banner_url ?? ""),
    category: String(row.category ?? row.platform ?? "General"),
    budget_total: Number(row.budget_total ?? row.budget ?? 0),
    budget_remaining: Number(row.budget_remaining ?? row.budget ?? 0),
    avg_review_hours: Number(row.avg_review_hours ?? 48),
    status: (row.status as Campaign["status"]) ?? "active",
    is_featured: Boolean(row.is_featured ?? false),
    creator_id: String(row.creator_id ?? row.seller_id ?? ""),
    created_at: String(row.created_at ?? new Date().toISOString()),
    updated_at: String(row.updated_at ?? row.created_at ?? new Date().toISOString()),
  }
}

function sortCampaigns(items: CampaignListItem[]): CampaignListItem[] {
  return [...items].sort((a, b) => {
    const featuredDiff = (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)
    if (featuredDiff !== 0) return featuredDiff
    return (
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  })
}

async function attachJoinMeta(
  supabase: SupabaseClient,
  campaigns: CampaignListItem[],
  userId?: string
): Promise<CampaignListItem[]> {
  if (campaigns.length === 0) return []

  const ids = campaigns.map((c) => c.id)

  const { data: joinRows } = await supabase
    .from("campaign_joins")
    .select("campaign_id")
    .in("campaign_id", ids)

  const countMap = new Map<string, number>()
  for (const row of joinRows ?? []) {
    countMap.set(row.campaign_id, (countMap.get(row.campaign_id) ?? 0) + 1)
  }

  let userJoined = new Set<string>()
  if (userId) {
    const { data: myJoins } = await supabase
      .from("campaign_joins")
      .select("campaign_id")
      .eq("user_id", userId)
      .in("campaign_id", ids)

    userJoined = new Set((myJoins ?? []).map((j) => j.campaign_id))
  }

  return campaigns.map((c) => {
    const earnings = (c.earnings ?? []) as CampaignEarning[]
    const maxPayout = earnings.length
      ? Math.max(...earnings.map((e) => Number(e.payout_per_1k)))
      : 0

    return {
      ...c,
      join_count: countMap.get(c.id) ?? 0,
      joined_by_user: userJoined.has(c.id),
      max_payout_per_1k: maxPayout,
    }
  })
}

function mapRowToListItem(
  row: Record<string, unknown>,
  creator?: CampaignListItem["creator"]
): CampaignListItem {
  const earnings = (row.earnings as CampaignEarning[] | undefined) ?? []
  const campaign = normalizeCampaignRow(row)

  return {
    ...campaign,
    creator: creator ?? null,
    earnings,
  }
}

async function attachCreators(
  supabase: SupabaseClient,
  items: CampaignListItem[]
): Promise<CampaignListItem[]> {
  const creatorIds = [
    ...new Set(items.map((c) => c.creator_id).filter(Boolean)),
  ]
  if (!creatorIds.length) return items

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url")
    .in("id", creatorIds)

  const map = new Map((profiles ?? []).map((p) => [p.id, p]))

  return items.map((c) => ({
    ...c,
    creator: map.get(c.creator_id) ?? null,
  }))
}

export async function listCampaigns(
  supabase: SupabaseClient,
  filters: {
    search?: string
    category?: string
    platform?: string
    status?: string
    featured?: boolean
    creatorId?: string
    publicOnly?: boolean
    page?: number
    limit?: number
    userId?: string
  }
): Promise<{ campaigns: CampaignListItem[]; total: number; page: number; limit: number }> {
  const page = filters.page ?? 1
  const limit = filters.limit ?? 12
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from("campaigns")
    .select(CAMPAIGN_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)

  if (filters.publicOnly) {
    query = query.eq("status", "active")
  } else if (filters.status) {
    query = query.eq("status", filters.status)
  }

  if (filters.category) query = query.ilike("category", filters.category)
  if (filters.search?.trim()) {
    const q = `%${filters.search.trim()}%`
    query = query.or(`title.ilike.${q},description.ilike.${q},category.ilike.${q}`)
  }

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  let items = (data ?? []).map((row) => mapRowToListItem(row as Record<string, unknown>))

  if (filters.creatorId) {
    items = items.filter((c) => c.creator_id === filters.creatorId)
  }

  if (filters.featured === true) {
    items = items.filter((c) => c.is_featured)
  }

  if (filters.platform) {
    items = items.filter((c) =>
      (c.earnings ?? []).some((e) => e.platform === filters.platform)
    )
  }

  items = sortCampaigns(items)

  items = await attachCreators(supabase, items)
  items = await attachJoinMeta(supabase, items, filters.userId)

  return { campaigns: items, total: count ?? items.length, page, limit }
}

export async function getFeaturedHero(
  supabase: SupabaseClient,
  userId?: string
): Promise<CampaignListItem | null> {
  const { campaigns } = await listCampaigns(supabase, {
    publicOnly: true,
    featured: true,
    limit: 1,
    page: 1,
    userId,
  })

  if (campaigns[0]) return campaigns[0]

  const { campaigns: fallback } = await listCampaigns(supabase, {
    publicOnly: true,
    limit: 1,
    page: 1,
    userId,
  })

  return fallback[0] ?? null
}

export async function getCampaignBySlug(
  supabase: SupabaseClient,
  slug: string,
  userId?: string
): Promise<CampaignDetail | null> {
  const { data, error } = await supabase
    .from("campaigns")
    .select(CAMPAIGN_SELECT)
    .eq("slug", slug)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return null

  let base = mapRowToListItem(data as Record<string, unknown>)
  ;[base] = await attachCreators(supabase, [base])

  const [requirements, resources, top_videos, join_count, joined] =
    await Promise.all([
      supabase
        .from("campaign_requirements")
        .select("*")
        .eq("campaign_id", base.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("campaign_resources")
        .select("*")
        .eq("campaign_id", base.id)
        .order("created_at", { ascending: true }),
      supabase
        .from("campaign_top_videos")
        .select("*")
        .eq("campaign_id", base.id)
        .order("sort_order", { ascending: true })
        .order("views", { ascending: false }),
      getJoinCount(supabase, base.id),
      userId ? hasUserJoined(supabase, base.id, userId) : Promise.resolve(false),
    ])

  const approvedSubs = await supabase
    .from("campaign_submissions")
    .select("id, user_id, platform, video_url, views, earnings, status")
    .eq("campaign_id", base.id)
    .eq("status", "approved")
    .order("views", { ascending: false })
    .limit(6)

  const topFromSubs =
    top_videos.data && top_videos.data.length > 0
      ? top_videos.data
      : await enrichTopFromSubmissions(supabase, approvedSubs.data ?? [])

  return {
    ...base,
    join_count,
    joined_by_user: joined,
    max_payout_per_1k: (base.earnings ?? []).length
      ? Math.max(...(base.earnings ?? []).map((e) => Number(e.payout_per_1k)))
      : 0,
    requirements: requirements.data ?? [],
    resources: resources.data ?? [],
    top_videos: topFromSubs,
  }
}

async function enrichTopFromSubmissions(
  supabase: SupabaseClient,
  subs: {
    user_id: string
    video_url: string
    views: number
    earnings: number
  }[]
) {
  if (subs.length === 0) return []

  const userIds = [...new Set(subs.map((s) => s.user_id))]
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", userIds)

  const nameMap = new Map(
    (profiles ?? []).map((p) => [
      p.id,
      p.full_name || p.email || "Creator",
    ])
  )

  return subs.map((s, i) => ({
    id: `sub-${i}`,
    campaign_id: "",
    creator_name: nameMap.get(s.user_id) ?? "Creator",
    thumbnail: "",
    video_url: s.video_url,
    views: Number(s.views),
    earnings: Number(s.earnings),
    sort_order: i,
  }))
}

export async function getCampaignById(
  supabase: SupabaseClient,
  id: string
): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return (data as Campaign) ?? null
}

async function syncRelated(
  supabase: SupabaseClient,
  campaignId: string,
  input: CampaignFormInput
) {
  await supabase.from("campaign_requirements").delete().eq("campaign_id", campaignId)
  await supabase.from("campaign_resources").delete().eq("campaign_id", campaignId)
  await supabase.from("campaign_earnings").delete().eq("campaign_id", campaignId)
  await supabase.from("campaign_top_videos").delete().eq("campaign_id", campaignId)

  if (input.requirements.length) {
    const { error } = await supabase.from("campaign_requirements").insert(
      input.requirements.map((r) => ({
        campaign_id: campaignId,
        requirement: r.requirement,
        sort_order: r.sort_order,
      }))
    )
    if (error) throw new Error(error.message)
  }

  if (input.resources.length) {
    const { error } = await supabase.from("campaign_resources").insert(
      input.resources.map((r) => ({
        campaign_id: campaignId,
        title: r.title,
        url: r.url,
        type: r.type,
      }))
    )
    if (error) throw new Error(error.message)
  }

  if (input.earnings.length) {
    const { error } = await supabase.from("campaign_earnings").insert(
      input.earnings.map((e) => ({
        campaign_id: campaignId,
        platform: e.platform,
        payout_per_1k: e.payout_per_1k,
        minimum_payout: e.minimum_payout,
        maximum_payout: e.maximum_payout,
      }))
    )
    if (error) throw new Error(error.message)
  }

  const topVideos = input.top_videos ?? []
  if (topVideos.length) {
    const { error } = await supabase.from("campaign_top_videos").insert(
      topVideos.map((v, i) => ({
        campaign_id: campaignId,
        creator_name: v.creator_name,
        thumbnail: v.thumbnail,
        video_url: v.video_url,
        views: v.views,
        earnings: v.earnings,
        sort_order: v.sort_order ?? i,
      }))
    )
    if (error) throw new Error(error.message)
  }
}

export async function createCampaign(
  supabase: SupabaseClient,
  creatorId: string,
  input: CampaignFormInput
): Promise<CampaignDetail> {
  const remaining =
    input.budget_remaining ?? input.budget_total

  const { data, error } = await supabase
    .from("campaigns")
    .insert({
      title: input.title,
      slug: input.slug,
      description: input.description,
      thumbnail_url: input.thumbnail_url,
      banner_url: input.banner_url,
      category: input.category,
      budget_total: input.budget_total,
      budget_remaining: remaining,
      avg_review_hours: input.avg_review_hours,
      status: input.status,
      is_featured: input.is_featured,
      creator_id: creatorId,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  await syncRelated(supabase, data.id, input)

  const detail = await getCampaignBySlug(supabase, data.slug)
  if (!detail) throw new Error("Failed to load created campaign")
  return detail
}

export async function updateCampaign(
  supabase: SupabaseClient,
  id: string,
  input: Partial<CampaignFormInput>
): Promise<CampaignDetail> {
  const existing = await getCampaignById(supabase, id)
  if (!existing) throw new Error("Campaign not found")

  const patch: Record<string, unknown> = {}
  if (input.title !== undefined) patch.title = input.title
  if (input.slug !== undefined) patch.slug = input.slug
  if (input.description !== undefined) patch.description = input.description
  if (input.thumbnail_url !== undefined) patch.thumbnail_url = input.thumbnail_url
  if (input.banner_url !== undefined) patch.banner_url = input.banner_url
  if (input.category !== undefined) patch.category = input.category
  if (input.budget_total !== undefined) patch.budget_total = input.budget_total
  if (input.budget_remaining !== undefined)
    patch.budget_remaining = input.budget_remaining
  if (input.avg_review_hours !== undefined)
    patch.avg_review_hours = input.avg_review_hours
  if (input.status !== undefined) patch.status = input.status
  if (input.is_featured !== undefined) patch.is_featured = input.is_featured

  if (Object.keys(patch).length) {
    const { error } = await supabase.from("campaigns").update(patch).eq("id", id)
    if (error) throw new Error(error.message)
  }

  if (
    input.requirements ||
    input.resources ||
    input.earnings ||
    input.top_videos
  ) {
    const full: CampaignFormInput = {
      title: input.title ?? existing.title,
      slug: input.slug ?? existing.slug,
      description: input.description ?? existing.description,
      thumbnail_url: input.thumbnail_url ?? existing.thumbnail_url,
      banner_url: input.banner_url ?? existing.banner_url,
      category: input.category ?? existing.category,
      budget_total: input.budget_total ?? Number(existing.budget_total),
      budget_remaining:
        input.budget_remaining ?? Number(existing.budget_remaining),
      avg_review_hours:
        input.avg_review_hours ?? existing.avg_review_hours,
      status: input.status ?? existing.status,
      is_featured: input.is_featured ?? existing.is_featured,
      requirements: input.requirements ?? [],
      resources: input.resources ?? [],
      earnings: input.earnings ?? [],
      top_videos: input.top_videos,
    }

    const { data: reqs } = await supabase
      .from("campaign_requirements")
      .select("requirement, sort_order")
      .eq("campaign_id", id)
    const { data: res } = await supabase
      .from("campaign_resources")
      .select("title, url, type")
      .eq("campaign_id", id)
    const { data: earn } = await supabase
      .from("campaign_earnings")
      .select("platform, payout_per_1k, minimum_payout, maximum_payout")
      .eq("campaign_id", id)

    if (!input.requirements?.length && reqs?.length) {
      full.requirements = reqs.map((r, i) => ({
        requirement: r.requirement,
        sort_order: r.sort_order ?? i,
      }))
    }
    if (!input.resources?.length && res?.length) {
      full.resources = res as CampaignFormInput["resources"]
    }
    if (!input.earnings?.length && earn?.length) {
      full.earnings = earn as CampaignFormInput["earnings"]
    }

    await syncRelated(supabase, id, full)
  }

  const detail = await getCampaignBySlug(supabase, input.slug ?? existing.slug)
  if (!detail) throw new Error("Failed to load updated campaign")
  return detail
}

export async function deleteCampaign(
  supabase: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await supabase.from("campaigns").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

export async function getDistinctCategories(
  supabase: SupabaseClient
): Promise<string[]> {
  const { data, error } = await supabase
    .from("campaigns")
    .select("category")
    .eq("status", "active")

  if (error) throw new Error(error.message)

  const set = new Set<string>()
  for (const row of data ?? []) {
    if (row.category) set.add(row.category)
  }
  return [...set].sort()
}
