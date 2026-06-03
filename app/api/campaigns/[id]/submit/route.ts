import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAuthContext } from "@/lib/auth/campaign-auth"
import { ok, fail } from "@/lib/api/response"
import { submitVideoSchema } from "@/lib/validators/campaign"
import { createSubmission } from "@/lib/services/submission.service"

export const dynamic = "force-dynamic"

type Params = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const auth = await getAuthContext()
    if (!auth) return fail("Authentication required", 401)

    const { id } = await params
    const body = await request.json()
    const parsed = submitVideoSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.errors[0]?.message ?? "Invalid payload", 400)
    }

    const supabase = await createServerSupabaseClient()
    const submission = await createSubmission(supabase, {
      campaign_id: id,
      user_id: auth.userId,
      platform: parsed.data.platform,
      video_url: parsed.data.video_url,
      notes: parsed.data.notes,
    })

    return ok(submission, 201)
  } catch (error) {
    console.error("POST /api/campaigns/[id]/submit", error)
    return fail(
      error instanceof Error ? error.message : "Failed to submit video",
      500
    )
  }
}
