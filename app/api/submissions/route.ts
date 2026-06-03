import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAuthContext } from "@/lib/auth/campaign-auth"
import { ok, fail } from "@/lib/api/response"
import { listSubmissionsForManager } from "@/lib/services/submission.service"
import type { SubmissionStatus } from "@/lib/types/campaign"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthContext()
    if (!auth?.isSeller) return fail("Seller or admin access required", 403)

    const { searchParams } = request.nextUrl
    const status = searchParams.get("status") as SubmissionStatus | null
    const campaignId = searchParams.get("campaignId") ?? undefined
    const page = Number(searchParams.get("page") ?? "1")
    const limit = Number(searchParams.get("limit") ?? "20")

    const supabase = await createServerSupabaseClient()
    const result = await listSubmissionsForManager(supabase, {
      creatorId: auth.userId,
      isAdmin: auth.isAdmin,
      status: status ?? undefined,
      campaignId,
      page,
      limit,
    })

    return ok(result)
  } catch (error) {
    console.error("GET /api/submissions", error)
    return fail(
      error instanceof Error ? error.message : "Failed to fetch submissions",
      500
    )
  }
}
