import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAuthContext } from "@/lib/auth/campaign-auth"
import { ok, fail } from "@/lib/api/response"
import { createProduct, listProductsByCreator } from "@/lib/services/product.service"
import { createProductSchema } from "@/lib/validators/ai-create"

export const dynamic = "force-dynamic"

/** Supabase-backed product creation (AI promptstore + product manager) */
export async function POST(req: NextRequest) {
  try {
    const bearerToken = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? null
    const auth = await getAuthContext(bearerToken)
    if (!auth) return fail("Authentication required", 401)

    const body = await req.json()
    const parsed = createProductSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.errors[0]?.message ?? "Invalid product data", 400)
    }

    const supabase = await createServerSupabaseClient()
    const product = await createProduct(supabase, auth.userId, parsed.data)

    return ok(product, 201)
  } catch (error) {
    console.error("POST /api/products", error)
    return fail(
      error instanceof Error ? error.message : "Failed to create product",
      500
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthContext()
    const { searchParams } = new URL(req.url)
    const mine = searchParams.get("mine") === "true"

    if (mine) {
      if (!auth) return fail("Authentication required", 401)
      const supabase = await createServerSupabaseClient()
      const products = await listProductsByCreator(supabase, auth.userId)
      return ok(products)
    }

    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from("digital_products")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return ok(data ?? [])
  } catch (error) {
    console.error("GET /api/products", error)
    return fail(
      error instanceof Error ? error.message : "Failed to fetch products",
      500
    )
  }
}
