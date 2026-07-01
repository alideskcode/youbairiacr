import { NextRequest } from "next/server"
import { getAuthContext } from "@/lib/auth/campaign-auth"
import { fail, ok } from "@/lib/api/response"
import { createServiceSupabaseClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthContext()
    if (!auth) return fail("Authentication required", 401)

    const supabase = createServiceSupabaseClient()
    if (!supabase) return fail("SUPABASE_SERVICE_ROLE_KEY is required for access lookup", 500)

    const productId = new URL(req.url).searchParams.get("product_id")

    let request = supabase
      .from("entitlements")
      .select(
        "id,status,starts_at,expires_at,created_at,product_id,order_id,digital_products(id,title,description,product_type,category,cover_url,thumbnail_url,access_url,demo_url,telegram_invite_url,license_terms,seller_name,support_email),telegram_access_grants(status,invite_url,telegram_chat_id)"
      )
      .eq("user_id", auth.userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (productId) request = request.eq("product_id", productId)

    const { data, error } = await request
    if (error) throw new Error(error.message)

    return ok(data ?? [])
  } catch (error) {
    console.error("GET /api/marketplace/access", error)
    return fail(error instanceof Error ? error.message : "Failed to load access", 500)
  }
}
