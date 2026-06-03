export type CampaignStatus = "draft" | "active" | "paused" | "completed"
export type SubmissionStatus = "pending" | "approved" | "rejected"
export type ProfileRole = "user" | "seller" | "admin"
export type ResourceType =
  | "google_drive"
  | "dropbox"
  | "notion"
  | "zip"
  | "external"

export type PlatformKey =
  | "tiktok"
  | "instagram"
  | "youtube_shorts"
  | "facebook_reels"

export const PLATFORMS: { key: PlatformKey; label: string }[] = [
  { key: "tiktok", label: "TikTok" },
  { key: "instagram", label: "Instagram" },
  { key: "youtube_shorts", label: "YouTube Shorts" },
  { key: "facebook_reels", label: "Facebook Reels" },
]

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  role: ProfileRole
  created_at: string
  updated_at: string
}

export type Campaign = {
  id: string
  title: string
  slug: string
  description: string
  thumbnail_url: string
  banner_url: string
  category: string
  budget_total: number
  budget_remaining: number
  avg_review_hours: number
  status: CampaignStatus
  is_featured: boolean
  creator_id: string
  created_at: string
  updated_at: string
}

export type CampaignRequirement = {
  id: string
  campaign_id: string
  requirement: string
  sort_order: number
}

export type CampaignResource = {
  id: string
  campaign_id: string
  title: string
  url: string
  type: ResourceType
}

export type CampaignEarning = {
  id: string
  campaign_id: string
  platform: PlatformKey
  payout_per_1k: number
  minimum_payout: number
  maximum_payout: number
}

export type CampaignJoin = {
  id: string
  campaign_id: string
  user_id: string
  joined_at: string
}

export type CampaignSubmission = {
  id: string
  campaign_id: string
  user_id: string
  platform: string
  video_url: string
  notes: string
  views: number
  earnings: number
  status: SubmissionStatus
  created_at: string
  updated_at: string
}

export type CampaignTopVideo = {
  id: string
  campaign_id: string
  creator_name: string
  thumbnail: string
  video_url: string
  views: number
  earnings: number
  sort_order: number
}

export type CampaignListItem = Campaign & {
  creator?: Pick<Profile, "id" | "full_name" | "email" | "avatar_url"> | null
  earnings?: CampaignEarning[]
  join_count?: number
  joined_by_user?: boolean
  max_payout_per_1k?: number
}

export type CampaignDetail = CampaignListItem & {
  requirements: CampaignRequirement[]
  resources: CampaignResource[]
  top_videos: CampaignTopVideo[]
}

export type CampaignFormInput = {
  title: string
  slug: string
  description: string
  thumbnail_url: string
  banner_url: string
  category: string
  budget_total: number
  budget_remaining: number
  avg_review_hours: number
  status: CampaignStatus
  is_featured: boolean
  requirements: { requirement: string; sort_order: number }[]
  resources: { title: string; url: string; type: ResourceType }[]
  earnings: {
    platform: PlatformKey
    payout_per_1k: number
    minimum_payout: number
    maximum_payout: number
  }[]
  top_videos?: {
    creator_name: string
    thumbnail: string
    video_url: string
    views: number
    earnings: number
    sort_order: number
  }[]
}

export type AIGeneratedCampaign = {
  description: string
  requirements: string[]
  hashtags: string[]
  hooks: string[]
  audience_suggestions: string[]
  category: string
}
