"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CampaignCard, CampaignCardHorizontal } from "@/components/campaigns/campaign-card"
import { CampaignHero } from "@/components/campaigns/campaign-hero"
import type { CampaignListItem } from "@/lib/types/campaign"
import { PLATFORMS } from "@/lib/types/campaign"

type Filters = {
  search: string
  category: string
  platform: string
  status: string
}

export function CampaignDiscoveryClient({
  initialHero,
  initialFeatured,
  initialCampaigns,
  categories,
}: {
  initialHero: CampaignListItem | null
  initialFeatured: CampaignListItem[]
  initialCampaigns: CampaignListItem[]
  categories: string[]
}) {
  const [hero] = useState(initialHero)
  const [featured, setFeatured] = useState(initialFeatured)
  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "all",
    platform: "all",
    status: "active",
  })
  const [isPending, startTransition] = useTransition()

  const fetchCampaigns = useCallback(async (f: Filters) => {
    const params = new URLSearchParams()
    if (f.search) params.set("search", f.search)
    if (f.category !== "all") params.set("category", f.category)
    if (f.platform !== "all") params.set("platform", f.platform)
    if (f.status !== "all") params.set("status", f.status)
    params.set("limit", "24")

    const res = await fetch(`/api/campaigns?${params}`)
    const json = await res.json()
    if (json.success) {
      const list = json.data.campaigns as CampaignListItem[]
      setCampaigns(list)
      setFeatured(list.filter((c) => c.is_featured).slice(0, 8))
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      startTransition(() => {
        void fetchCampaigns(filters)
      })
    }, 300)
    return () => clearTimeout(t)
  }, [filters, fetchCampaigns])

  return (
    <div className="w-full py-8 space-y-10">
      {hero && <CampaignHero campaign={hero} />}

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            className="pl-9"
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
          />
        </div>
        <Select
          value={filters.category}
          onValueChange={(v) => setFilters((f) => ({ ...f, category: v }))}
        >
          <SelectTrigger className="w-full md:w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.platform}
          onValueChange={(v) => setFilters((f) => ({ ...f, platform: v }))}
        >
          <SelectTrigger className="w-full md:w-[160px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All platforms</SelectItem>
            {PLATFORMS.map((p) => (
              <SelectItem key={p.key} value={p.key}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.status}
          onValueChange={(v) => setFilters((f) => ({ ...f, status: v }))}
        >
          <SelectTrigger className="w-full md:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {featured.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Featured campaigns</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {featured.map((c) => (
              <CampaignCardHorizontal key={c.id} campaign={c} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">All campaigns</h2>
          {isPending && (
            <span className="text-sm text-muted-foreground">Updating...</span>
          )}
        </div>
        {campaigns.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
            <p className="font-medium">No campaigns found</p>
            <p className="text-sm mt-1">
              Create a campaign in Product Manager to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
