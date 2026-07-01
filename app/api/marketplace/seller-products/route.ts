import { NextRequest } from "next/server"
import { getAuthContext } from "@/lib/auth/campaign-auth"
import { ok, fail } from "@/lib/api/response"
import { createServerSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase/server"
import { makeProductSlug, sellerProductSchema } from "@/lib/marketplace"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const auth = await getAuthContext()
    if (!auth) return fail("Authentication required", 401)

    const supabase = createServiceSupabaseClient() ?? (await createServerSupabaseClient())
    const { data, error } = await supabase
      .from("digital_products")
      .select("*")
      .eq("creator_id", auth.userId)
      .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return ok(data ?? [])
  } catch (error) {
    console.error("GET /api/marketplace/seller-products", error)
    return fail(error instanceof Error ? error.message : "Failed to load seller products", 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext()
    if (!auth) return fail("Authentication required", 401)

    const body = await req.json()
    const parsed = sellerProductSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.errors[0]?.message ?? "Invalid product data", 400, parsed.error.flatten())
    }

    const supabase = await createServerSupabaseClient()
    const slug = makeProductSlug(parsed.data.title, crypto.randomUUID())

    const { data, error } = await supabase
      .from("digital_products")
      .insert({
        creator_id: auth.userId,
        slug,
        title: parsed.data.title,
        subtitle: parsed.data.subtitle,
        description: parsed.data.description,
        category: parsed.data.category,
        product_type: parsed.data.product_type,
        price: parsed.data.price,
        currency: parsed.data.currency.toUpperCase(),
        tags: parsed.data.tags,
        includes: parsed.data.includes,
        cover_url: parsed.data.cover_url,
        thumbnail_url: parsed.data.cover_url,
        access_url: parsed.data.access_url,
        demo_url: parsed.data.demo_url,
        telegram_chat_id: parsed.data.telegram_chat_id,
        telegram_invite_url: parsed.data.telegram_invite_url,
        license_terms: parsed.data.license_terms,
        seller_name: parsed.data.seller_name || auth.email.split("@")[0],
        support_email: parsed.data.support_email || auth.email,
        status: parsed.data.status,
        moderation_status: "approved",
      })
      .select("*")
      .single()

    if (error) throw new Error(error.message)
    return ok(data, 201)
  } catch (error) {
    console.error("POST /api/marketplace/seller-products", error)
    return fail(error instanceof Error ? error.message : "Failed to create product", 500)
  }
}
