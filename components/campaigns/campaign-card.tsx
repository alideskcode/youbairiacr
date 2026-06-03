import Image from "next/image"
import Link from "next/link"
import { Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CampaignListItem } from "@/lib/types/campaign"
import {
  creatorDisplayName,
  formatCurrency,
  formatPayout,
} from "@/lib/campaign-utils"
import { PlatformIcons } from "@/components/campaigns/platform-icons"
import { JoinCampaignButton } from "@/components/campaigns/join-campaign-button"

export function CampaignCard({ campaign }: { campaign: CampaignListItem }) {
  const platforms = (campaign.earnings ?? []).map((e) => e.platform)
  const thumb = campaign.thumbnail_url || "/placeholder.svg"

  return (
    <Card className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow h-full flex flex-col">
      <Link href={`/campaign/${campaign.slug}`} className="block relative aspect-[16/10] bg-slate-100">
        <Image
          src={thumb}
          alt={campaign.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {campaign.is_featured && (
          <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-500">
            Featured
          </Badge>
        )}
      </Link>
      <CardContent className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <Link
            href={`/campaign/${campaign.slug}`}
            className="font-semibold text-slate-900 hover:text-primary line-clamp-2"
          >
            {campaign.title}
          </Link>
          <p className="text-xs text-muted-foreground mt-1">
            {creatorDisplayName(campaign.creator)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs">
          <Badge variant="secondary">{campaign.category}</Badge>
          <PlatformIcons platforms={platforms} />
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">Payout</p>
            <p className="font-medium">{formatPayout(campaign.earnings)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">Budget</p>
            <p className="font-medium">{formatCurrency(Number(campaign.budget_total))}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>{campaign.join_count ?? 0} joined</span>
        </div>
        <JoinCampaignButton
          campaignId={campaign.id}
          initialJoined={campaign.joined_by_user}
          size="sm"
          fullWidth
        />
      </CardContent>
    </Card>
  )
}

export function CampaignCardHorizontal({ campaign }: { campaign: CampaignListItem }) {
  const platforms = (campaign.earnings ?? []).map((e) => e.platform)
  const thumb = campaign.thumbnail_url || "/placeholder.svg"

  return (
    <Card className="min-w-[280px] max-w-[320px] shrink-0 overflow-hidden border-slate-200">
      <Link href={`/campaign/${campaign.slug}`} className="block relative aspect-video bg-slate-100">
        <Image src={thumb} alt={campaign.title} fill className="object-cover" sizes="320px" />
      </Link>
      <CardContent className="p-3 space-y-2">
        <Link href={`/campaign/${campaign.slug}`} className="font-semibold text-sm line-clamp-1 hover:text-primary">
          {campaign.title}
        </Link>
        <PlatformIcons platforms={platforms} />
        <p className="text-xs font-medium">{formatPayout(campaign.earnings)}</p>
        <JoinCampaignButton
          campaignId={campaign.id}
          initialJoined={campaign.joined_by_user}
          size="sm"
          fullWidth
        />
      </CardContent>
    </Card>
  )
}
