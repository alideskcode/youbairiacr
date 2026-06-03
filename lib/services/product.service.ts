import type { SupabaseClient } from "@supabase/supabase-js"
import { createProductSchema } from "@/lib/validators/ai-create"
import type { AIProductDraft } from "@/lib/types/ai-create"

export type DigitalProduct = {
  id: string
  creator_id: string
  title: string
  description: string
  category: string
  price: number
  tags: string[]
  thumbnail_url: string
  thumbnail_prompt: string
  status: "draft" | "active" | "archived"
  created_at: string
  updated_at: string
}

export async function createProduct(
  supabase: SupabaseClient,
  creatorId: string,
  input: {
    title: string
    description: string
    category: string
    price: number
    tags?: string[]
    thumbnail_url?: string
    thumbnail_prompt?: string
    status?: "draft" | "active" | "archived"
  }
): Promise<DigitalProduct> {
  const parsed = createProductSchema.safeParse(input)
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Invalid product data")
  }

  const { data, error } = await supabase
    .from("digital_products")
    .insert({
      creator_id: creatorId,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      price: parsed.data.price,
      tags: parsed.data.tags,
      thumbnail_url: parsed.data.thumbnail_url,
      thumbnail_prompt: parsed.data.thumbnail_prompt,
      status: parsed.data.status,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as DigitalProduct
}

export async function createProductFromAI(
  supabase: SupabaseClient,
  creatorId: string,
  draft: AIProductDraft
): Promise<DigitalProduct> {
  return createProduct(supabase, creatorId, {
    title: draft.title,
    description: draft.description,
    category: draft.category,
    price: draft.price,
    tags: draft.tags,
    thumbnail_prompt: draft.thumbnail_prompt,
    status: "draft",
  })
}

export async function listProductsByCreator(
  supabase: SupabaseClient,
  creatorId: string
): Promise<DigitalProduct[]> {
  const { data, error } = await supabase
    .from("digital_products")
    .select("*")
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return (data as DigitalProduct[]) ?? []
}
