export type Campaign = {
  id: string
  title: string
  description?: string
  thumbnail?: string
  platform?: string
  payout?: number
  budget?: number
  contact_email?: string
  website?: string
  social_links?: string[] | null
  status?: string
  seller_id?: string
  created_at?: string
}

export type CampaignForm = {
  title: string
  description: string
  thumbnail: string
  platform: string
  payout: string
  budget: string
  contact_email: string
  website: string
  social_links: string
  status: string
}

export const emptyCampaignForm: CampaignForm = {
  title: "",
  description: "",
  thumbnail: "",
  platform: "",
  payout: "",
  budget: "",
  contact_email: "",
  website: "",
  social_links: "",
  status: "active",
}

export function campaignToForm(campaign: Campaign): CampaignForm {
  return {
    title: campaign.title ?? "",
    description: campaign.description ?? "",
    thumbnail: campaign.thumbnail ?? "",
    platform: campaign.platform ?? "",
    payout: String(campaign.payout ?? ""),
    budget: String(campaign.budget ?? ""),
    contact_email: campaign.contact_email ?? "",
    website: campaign.website ?? "",
    social_links: Array.isArray(campaign.social_links)
      ? campaign.social_links.join("\n")
      : "",
    status: campaign.status ?? "active",
  }
}

export function formToCampaignPayload(form: CampaignForm) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    thumbnail:
      form.thumbnail.trim() || "/placeholder.svg?height=300&width=300",
    platform: form.platform.trim() || "General",
    payout: Number(form.payout) || 0,
    budget: Number(form.budget) || 0,
    contact_email: form.contact_email.trim(),
    website: form.website.trim(),
    social_links: form.social_links
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    status: form.status,
  }
}
