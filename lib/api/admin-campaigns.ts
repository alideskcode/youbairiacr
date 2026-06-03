import { NextResponse } from "next/server"
import { isAdminEmail } from "@/lib/admin-auth"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export type CampaignPayload = {
  title?: string
  description?: string
  thumbnail?: string
  payout?: number
  budget?: number
  platform?: string
  contact_email?: string
  website?: string
  social_links?: string[]
  status?: string
  seller_id?: string
}

export async function requireAdminUser(req?: Request) {
  const supabase = await createServerSupabaseClient()
  const authHeader = req?.headers.get("Authorization")
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null

  const {
    data: { user },
    error,
  } = bearerToken
    ? await supabase.auth.getUser(bearerToken)
    : await supabase.auth.getUser()

  if (error || !user?.email || !isAdminEmail(user.email)) {
    return null
  }

  return user
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Unauthorized — admin access required" },
    { status: 401 }
  )
}

export function parseCampaignBody(body: CampaignPayload) {
  const social_links = Array.isArray(body.social_links)
    ? body.social_links.filter(Boolean)
    : undefined

  return {
    ...(body.title !== undefined && { title: body.title.trim() }),
    ...(body.description !== undefined && { description: body.description.trim() }),
    ...(body.thumbnail !== undefined && { thumbnail: body.thumbnail.trim() }),
    ...(body.payout !== undefined && { payout: Number(body.payout) || 0 }),
    ...(body.budget !== undefined && { budget: Number(body.budget) || 0 }),
    ...(body.platform !== undefined && { platform: body.platform.trim() }),
    ...(body.contact_email !== undefined && {
      contact_email: body.contact_email.trim(),
    }),
    ...(body.website !== undefined && { website: body.website.trim() }),
    ...(social_links !== undefined && { social_links }),
    ...(body.status !== undefined && { status: body.status.trim() }),
    ...(body.seller_id !== undefined && { seller_id: body.seller_id }),
  }
}
