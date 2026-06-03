import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ExternalLink, FileText, ListChecks } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAuthContext } from "@/lib/auth/campaign-auth"
import { getCampaignBySlug } from "@/lib/services/campaign.service"
import { JoinCampaignButton } from "@/components/campaigns/join-campaign-button"
import { PlatformIcons } from "@/components/campaigns/platform-icons"
import { SubmitVideoForm } from "@/components/campaigns/submit-video-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  creatorDisplayName,
  formatCurrency,
  platformLabel,
} from "@/lib/campaign-utils"
import { PLATFORMS } from "@/lib/types/campaign"
import { formatDistanceToNow } from "date-fns"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ slug: string }> }

export default async function CampaignDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const auth = await getAuthContext()

  const campaign = await getCampaignBySlug(supabase, slug, auth?.userId)

  if (
    !campaign ||
    (campaign.status !== "active" &&
      campaign.creator_id !== auth?.userId &&
      !auth?.isAdmin)
  ) {
    notFound()
  }

  const platforms = (campaign.earnings ?? []).map((e) => e.platform)
  const thumb = campaign.thumbnail_url || "/placeholder.svg"

  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{campaign.title}</h1>
            <p className="text-muted-foreground mt-2 whitespace-pre-wrap">
              {campaign.description}
            </p>
          </div>

          <section>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <ListChecks className="h-5 w-5" />
              Requirements
            </h2>
            {campaign.requirements.length === 0 ? (
              <p className="text-sm text-muted-foreground">No requirements listed.</p>
            ) : (
              <ol className="list-decimal list-inside space-y-2 text-sm">
                {campaign.requirements.map((r) => (
                  <li key={r.id} className="text-slate-700">
                    {r.requirement}
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Earnings</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {campaign.earnings?.map((e) => (
                <Card key={e.id} className="border-slate-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {platformLabel(e.platform)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p>
                      <span className="text-muted-foreground">Per 1K views:</span>{" "}
                      <strong>{formatCurrency(Number(e.payout_per_1k))}</strong>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Min payout:</span>{" "}
                      {formatCurrency(Number(e.minimum_payout))}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Max payout:</span>{" "}
                      {formatCurrency(Number(e.maximum_payout))}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5" />
              Resources
            </h2>
            {campaign.resources.length === 0 ? (
              <p className="text-sm text-muted-foreground">No resources yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {campaign.resources.map((r) => (
                  <a
                    key={r.id}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border p-4 hover:bg-slate-50 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{r.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {r.type.replace("_", " ")}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Top performing videos</h2>
            {campaign.top_videos.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No top videos yet. Approved submissions will appear here.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {campaign.top_videos.map((v) => (
                  <Card key={v.id} className="overflow-hidden">
                    <div className="relative aspect-video bg-slate-100">
                      {v.thumbnail ? (
                        <Image
                          src={v.thumbnail}
                          alt={v.creator_name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                          Video
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3 space-y-1 text-sm">
                      <p className="font-medium">{v.creator_name}</p>
                      <p className="text-muted-foreground">
                        {Number(v.views).toLocaleString()} views ·{" "}
                        {formatCurrency(Number(v.earnings))} earned
                      </p>
                      <a
                        href={v.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-xs hover:underline inline-flex items-center gap-1"
                      >
                        Watch <ExternalLink className="h-3 w-3" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {auth && (
            <section>
              <h2 className="text-lg font-semibold mb-4">Submit your clip</h2>
              <SubmitVideoForm
                campaignId={campaign.id}
                platforms={platforms.length ? platforms : PLATFORMS.map((p) => p.key)}
              />
            </section>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 h-fit">
          <Card className="overflow-hidden">
            <div className="relative aspect-square bg-slate-100">
              <Image src={thumb} alt={campaign.title} fill className="object-cover" />
            </div>
            <CardContent className="p-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground font-normal">
                    Budget
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-1">
                  <p className="text-sm">
                    Total:{" "}
                    <strong>{formatCurrency(Number(campaign.budget_total))}</strong>
                  </p>
                  <p className="text-sm">
                    Remaining:{" "}
                    <strong className="text-emerald-600">
                      {formatCurrency(Number(campaign.budget_remaining))}
                    </strong>
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="secondary">{campaign.category}</Badge>
                </div>
                <Separator />
                <div>
                  <span className="text-muted-foreground block mb-1">Platforms</span>
                  <PlatformIcons platforms={platforms} />
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last updated</span>
                  <span>
                    {formatDistanceToNow(new Date(campaign.updated_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Creator</span>
                  <span>{creatorDisplayName(campaign.creator)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Joined</span>
                  <span>{campaign.join_count ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Review time</span>
                  <span>~{campaign.avg_review_hours}h</span>
                </div>
              </div>

              <JoinCampaignButton
                campaignId={campaign.id}
                initialJoined={campaign.joined_by_user}
                fullWidth
                size="lg"
              />

              {!auth && (
                <p className="text-xs text-center text-muted-foreground">
                  <Link href={`/login?callbackUrl=/campaign/${slug}`} className="text-primary hover:underline">
                    Sign in
                  </Link>{" "}
                  to join or submit
                </p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
