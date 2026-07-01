import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ok, fail } from "@/lib/api/response"
import { publicProductSelect } from "@/lib/marketplace"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")?.trim()
    const type = searchParams.get("type")?.trim()
    const category = searchParams.get("category")?.trim()

    let request = supabase
      .from("digital_products")
      .select(publicProductSelect())
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(80)

    if (type && type !== "all") request = request.eq("product_type", type)
    if (category && category !== "all") request = request.eq("category", category)
    if (query) {
      request = request.or(`title.ilike.%${query}%,subtitle.ilike.%${query}%,description.ilike.%${query}%`)
    }

    const { data, error } = await request
    if (error) throw new Error(error.message)

    return ok(data ?? [])
  } catch (error) {
    console.error("GET /api/marketplace/products", error)
    return fail(error instanceof Error ? error.message : "Failed to load products", 500)
  }
}
