"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Megaphone,
  Package,
  DollarSign,
  Tag,
  ListChecks,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { AICreateResponse } from "@/lib/types/ai-create"
import { formatCurrency } from "@/lib/campaign-utils"
import { campaignDraftToFormInput } from "@/lib/services/ai-create.service"
import { authHeaders } from "@/lib/supabase/auth-headers"

type Props = {
  draft: AICreateResponse | null
  isAuthenticated: boolean
}

export function PromptstorePreview({ draft, isAuthenticated }: Props) {
  const router = useRouter()
  const [creatingCampaign, setCreatingCampaign] = useState(false)
  const [creatingProduct, setCreatingProduct] = useState(false)

  if (!draft) {
    return (
      <div className="flex h-full flex-col items-center justify-center border-l border-border bg-muted/20 p-8 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Megaphone className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg">Preview</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs">
          Chat with AI to generate a campaign or product. Your preview will appear here.
        </p>
      </div>
    )
  }

  const isCampaign = draft.intent === "create_campaign" && draft.campaign
  const isProduct = draft.intent === "create_product" && draft.product

  async function handleCreateCampaign() {
    if (!draft?.campaign) return
    setCreatingCampaign(true)
    try {
      const payload = campaignDraftToFormInput(draft.campaign)
      const headers = await authHeaders()
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (res.status === 401) {
        router.push("/login?callbackUrl=/sell/promptstore")
        return
      }
      if (res.status === 403) {
        toast.error("Seller access required. Ask an admin to set your profile role to seller.")
        return
      }
      if (!json.success) throw new Error(json.error)

      toast.success("Campaign created!")
      router.push(`/product-manager/campaigns/${json.data.id}/edit`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create campaign")
    } finally {
      setCreatingCampaign(false)
    }
  }

  async function handleCreateProduct() {
    if (!draft?.product) return
    setCreatingProduct(true)
    try {
      const headers = await authHeaders()
      const res = await fetch("/api/products", {
        method: "POST",
        headers,
        body: JSON.stringify({
          title: draft.product.title,
          description: draft.product.description,
          category: draft.product.category,
          price: draft.product.price,
          tags: draft.product.tags,
          thumbnail_prompt: draft.product.thumbnail_prompt,
          status: "draft",
        }),
      })
      const json = await res.json()

      if (res.status === 401) {
        router.push("/login?callbackUrl=/sell/promptstore")
        return
      }
      if (!json.success) throw new Error(json.error)

      toast.success("Product created!")
      router.push("/product-manager")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create product")
    } finally {
      setCreatingProduct(false)
    }
  }

  return (
    <div className="flex h-full flex-col border-l border-border bg-muted/10">
      <div className="border-b border-border p-4">
        <h3 className="font-semibold">Preview</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Review AI output before saving to Supabase
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Badge variant={isCampaign ? "default" : "secondary"}>
          {isCampaign ? "Campaign" : "Product"}
        </Badge>

        {isCampaign && draft.campaign && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Megaphone className="h-4 w-4" />
                {draft.campaign.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-3.5 w-3.5" />
                {draft.campaign.category}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Budget</p>
                  <p className="font-semibold flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    {formatCurrency(draft.campaign.budget)}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Payout / 1K</p>
                  <p className="font-semibold">
                    {formatCurrency(draft.campaign.payout_per_1k)}
                  </p>
                </div>
              </div>
              {draft.campaign.requirements.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <ListChecks className="h-3.5 w-3.5" />
                    Requirements
                  </p>
                  <ul className="list-disc list-inside text-xs space-y-0.5 text-muted-foreground">
                    {draft.campaign.requirements.slice(0, 4).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-xs text-muted-foreground line-clamp-3">
                {draft.campaign.description}
              </p>
            </CardContent>
          </Card>
        )}

        {isProduct && draft.product && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                {draft.product.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-3.5 w-3.5" />
                {draft.product.category}
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="font-semibold text-lg">
                  {formatCurrency(draft.product.price)}
                </p>
              </div>
              {draft.product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {draft.product.tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground line-clamp-4">
                {draft.product.description}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="border-t border-border p-4 space-y-2">
        {!isAuthenticated && (
          <p className="text-xs text-center text-muted-foreground mb-2">
            Sign in to save to your account
          </p>
        )}

        {isCampaign && (
          <Button
            className="w-full"
            disabled={!isAuthenticated || creatingCampaign}
            onClick={handleCreateCampaign}
          >
            {creatingCampaign ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Megaphone className="h-4 w-4 mr-2" />
                Create Campaign
              </>
            )}
          </Button>
        )}

        {isProduct && (
          <Button
            className="w-full"
            variant={isCampaign ? "outline" : "default"}
            disabled={!isAuthenticated || creatingProduct}
            onClick={handleCreateProduct}
          >
            {creatingProduct ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Package className="h-4 w-4 mr-2" />
                Create Product
              </>
            )}
          </Button>
        )}

        <Separator />
        <p className="text-[10px] text-center text-muted-foreground">
          Campaigns require seller role. Products save as drafts.
        </p>
      </div>
    </div>
  )
}
