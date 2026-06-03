import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAuthContext } from "@/lib/auth/campaign-auth"
import { ok, fail } from "@/lib/api/response"
import { updateSubmissionSchema } from "@/lib/validators/campaign"
import { updateSubmissionStatus } from "@/lib/services/submission.service"

export const dynamic = "force-dynamic"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const auth = await getAuthContext()
    if (!auth?.isSeller) return fail("Seller or admin access required", 403)

    const { id } = await params
    const body = await request.json()
    const parsed = updateSubmissionSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.errors[0]?.message ?? "Invalid payload", 400)
    }

    const supabase = await createServerSupabaseClient()

    const { data: submission } = await supabase
      .from("campaign_submissions")
      .select("id, campaign_id, campaigns(creator_id)")
      .eq("id", id)
      .maybeSingle()

    if (!submission) return fail("Submission not found", 404)

    const creatorId = (
      submission.campaigns as { creator_id: string } | null
    )?.creator_id

    if (!auth.isAdmin && creatorId !== auth.userId) {
      return fail("Forbidden", 403)
    }

    const updated = await updateSubmissionStatus(supabase, id, parsed.data)
    return ok(updated)
  } catch (error) {
    console.error("PATCH /api/submissions/[id]", error)
    return fail(
      error instanceof Error ? error.message : "Failed to update submission",
      500
    )
  }
}
