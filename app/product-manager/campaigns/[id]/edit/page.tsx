import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getCampaignBySlug, getCampaignById } from "@/lib/services/campaign.service"
import { CampaignForm } from "@/components/campaigns/campaign-form"

type Props = { params: Promise<{ id: string }> }

export default async function EditCampaignPage({ params }: Props) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const row = await getCampaignById(supabase, id)
  if (!row) notFound()

  const campaign = await getCampaignBySlug(supabase, row.slug)
  if (!campaign) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit campaign</h1>
      <CampaignForm mode="edit" campaignId={id} initial={campaign} />
    </div>
  )
}
