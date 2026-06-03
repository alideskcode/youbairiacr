import { NextResponse } from "next/server"
import {
  parseCampaignBody,
  requireAdminUser,
  unauthorizedResponse,
  type CampaignPayload,
} from "@/lib/api/admin-campaigns"
import { getAdminSupabaseClient } from "@/lib/supabase/admin-db"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: Request, { params }: RouteContext) {
  const admin = await requireAdminUser(req)
  if (!admin) return unauthorizedResponse()

  const { id } = await params

  try {
    const supabase = await getAdminSupabaseClient()
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching campaign:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const admin = await requireAdminUser(req)
  if (!admin) return unauthorizedResponse()

  const { id } = await params

  try {
    const body = (await req.json()) as CampaignPayload
    const updates = parseCampaignBody(body)

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const supabase = await getAdminSupabaseClient()
    const { data, error } = await supabase
      .from("campaigns")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json(
        {
          error:
            "No product was updated. Add SUPABASE_SERVICE_ROLE_KEY to .env.local or update Supabase RLS policies.",
        },
        { status: 403 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating campaign:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  const admin = await requireAdminUser(req)
  if (!admin) return unauthorizedResponse()

  const { id } = await params

  try {
    const supabase = await getAdminSupabaseClient()
    const { data, error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", id)
      .select("id")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          error:
            "No product was deleted. Add SUPABASE_SERVICE_ROLE_KEY to .env.local or update Supabase RLS policies for admins.",
        },
        { status: 403 }
      )
    }

    return NextResponse.json({ success: true, deleted: data })
  } catch (error) {
    console.error("Error deleting campaign:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
