import { NextResponse } from "next/server"
import {
  parseCampaignBody,
  requireAdminUser,
  unauthorizedResponse,
  type CampaignPayload,
} from "@/lib/api/admin-campaigns"
import { getAdminSupabaseClient } from "@/lib/supabase/admin-db"

export async function GET(req: Request) {
  const admin = await requireAdminUser(req)
  if (!admin) return unauthorizedResponse()

  try {
    const supabase = await getAdminSupabaseClient()
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const admin = await requireAdminUser(req)
  if (!admin) return unauthorizedResponse()

  try {
    const body = (await req.json()) as CampaignPayload

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const payload = {
      ...parseCampaignBody(body),
      title: body.title.trim(),
      seller_id: body.seller_id ?? admin.id,
      status: body.status?.trim() || "active",
      thumbnail:
        body.thumbnail?.trim() || "/placeholder.svg?height=300&width=300",
      description: body.description?.trim() ?? "",
      platform: body.platform?.trim() ?? "General",
      contact_email: body.contact_email?.trim() ?? "",
      website: body.website?.trim() ?? "",
      payout: Number(body.payout) || 0,
      budget: Number(body.budget) || 0,
      social_links: Array.isArray(body.social_links)
        ? body.social_links.filter(Boolean)
        : [],
    }

    const supabase = await getAdminSupabaseClient()
    const { data, error } = await supabase
      .from("campaigns")
      .insert([payload])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error creating campaign:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
