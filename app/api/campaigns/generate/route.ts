import { NextRequest } from "next/server"
import { getAuthContext } from "@/lib/auth/campaign-auth"
import { ok, fail } from "@/lib/api/response"
import { aiGenerateSchema } from "@/lib/validators/campaign"
import { generateCampaignContent } from "@/lib/services/openrouter.service"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext()
    if (!auth?.isSeller) {
      return fail("Seller or admin access required", 403)
    }

    const body = await request.json()
    const parsed = aiGenerateSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.errors[0]?.message ?? "Invalid payload", 400)
    }

    const generated = await generateCampaignContent(
      parsed.data.title,
      parsed.data.topic
    )

    return ok(generated)
  } catch (error) {
    console.error("POST /api/campaigns/generate", error)
    return fail(
      error instanceof Error ? error.message : "AI generation failed",
      500
    )
  }
}
