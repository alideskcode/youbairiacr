import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ok, fail } from "@/lib/api/response"
import { publicProductSelect } from "@/lib/marketplace"

export const dynamic = "force-dynamic"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)

    let request = supabase
      .from("digital_products")
      .select(publicProductSelect())
      .eq("status", "active")

    request = isUuid ? request.eq("id", id) : request.eq("slug", id)

    const { data, error } = await request
      .maybeSingle()

    if (error) throw new Error(error.message)
    if (!data) return fail("Product not found", 404)

    return ok(data)
  } catch (error) {
    console.error("GET /api/marketplace/products/[id]", error)
    return fail(error instanceof Error ? error.message : "Failed to load product", 500)
  }
}
