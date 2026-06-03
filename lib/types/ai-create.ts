export type AIIntent = "create_campaign" | "create_product"

export type AIResource = {
  title: string
  url: string
  type?: "google_drive" | "dropbox" | "notion" | "zip" | "external"
}

export type AICampaignDraft = {
  title: string
  description: string
  category: string
  requirements: string[]
  budget: number
  payout_per_1k: number
  platforms: string[]
  resources: AIResource[]
}

export type AIProductDraft = {
  title: string
  description: string
  category: string
  price: number
  tags: string[]
  thumbnail_prompt: string
}

export type AICreateResponse = {
  intent: AIIntent
  message: string
  campaign?: AICampaignDraft | null
  product?: AIProductDraft | null
}

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  draft?: AICreateResponse | null
}
