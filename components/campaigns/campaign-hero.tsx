import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { CampaignListItem } from "@/lib/types/campaign"
import { creatorDisplayName, formatCurrency, formatPayout } from "@/lib/campaign-utils"
import { JoinCampaignButton } from "@/components/campaigns/join-campaign-button"

export function CampaignHero({ campaign }: { campaign: CampaignListItem }) {
  const banner = campaign.banner_url || campaign.thumbnail_url || "/placeholder.svg"

  return (
    <section className="relative overflow-hidden rounded-2xl border bg-slate-900 text-white min-h-[280px] md:min-h-[340px]">
      <Image
        src={banner}
        alt={campaign.title}
        fill
        className="object-cover opacity-50"
        priority
        sizes="100vw"
      />
      <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end min-h-[280px] md:min-h-[340px] max-w-2xl">
        <Badge className="w-fit mb-3 bg-white/20 text-white hover:bg-white/20 backdrop-blur">
          {campaign.category}
        </Badge>
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
          {campaign.title}
        </h1>
        <p className="text-sm text-white/80 mb-1">
          by {creatorDisplayName(campaign.creator)}
        </p>
        <div className="flex flex-wrap gap-4 text-sm mb-6">
          <span>
            <strong>Payout:</strong> {formatPayout(campaign.earnings)}
          </span>
          <span>
            <strong>Budget:</strong> {formatCurrency(Number(campaign.budget_total))}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <JoinCampaignButton
            campaignId={campaign.id}
            initialJoined={campaign.joined_by_user}
            size="lg"
            className="bg-white text-slate-900 hover:bg-white/90"
          />
          <Link
            href={`/campaign/${campaign.slug}`}
            className="text-sm underline underline-offset-4 text-white/90 hover:text-white"
          >
            View details
          </Link>
        </div>
      </div>
    </section>
  )
}
