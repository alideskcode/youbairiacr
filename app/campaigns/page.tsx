import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAuthContext } from "@/lib/auth/campaign-auth"
import {
  getDistinctCategories,
  getFeaturedHero,
  listCampaigns,
} from "@/lib/services/campaign.service"
import { CampaignDiscoveryClient } from "@/components/campaigns/campaign-discovery-client"

export const dynamic = "force-dynamic"
export const revalidate = 60

export default async function CampaignDiscoveryPage() {
  const supabase = await createServerSupabaseClient()
  const auth = await getAuthContext()

  const [hero, listResult, categories] = await Promise.all([
    getFeaturedHero(supabase, auth?.userId),
    listCampaigns(supabase, {
      publicOnly: true,
      page: 1,
      limit: 24,
      userId: auth?.userId,
    }),
    getDistinctCategories(supabase),
  ])

  const featured = listResult.campaigns.filter((c) => c.is_featured)

  return (
    <CampaignDiscoveryClient
      initialHero={hero}
      initialFeatured={featured.length ? featured : listResult.campaigns.slice(0, 6)}
      initialCampaigns={listResult.campaigns}
      categories={categories}
    />
  )
}
