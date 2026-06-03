"use client"

import Link from "next/link"
import { ArrowRight, Store } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductCard from "@/app/components/product-card"
import CategoryFilter from "@/app/components/category-filter"
import { supabase } from "@/lib/supabase/client"

type Campaign = {
  id: string | number
  title: string
  description?: string
  category?: string
  platform?: string
  thumbnail?: string
  payout?: number
  budget?: number
  seller_id?: string
  contact_email?: string
  website?: string
  social_links?: string[] | null
}

const placeholderImage = "/placeholder.svg?height=300&width=300"

export default function ProductsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from<Campaign>("campaigns")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (error) {
        setError(error.message)
        setCampaigns([])
      } else {
        setError(null)
        setCampaigns(data ?? [])
      }

      setLoading(false)
    }

    fetchCampaigns()
  }, [])

  const categories = useMemo(() => {
    const groups = campaigns.reduce<Record<string, Campaign[]>>((acc, campaign) => {
      const key = campaign.platform || campaign.category || "General"
      const normalizedKey = key.trim() || "General"
      if (!acc[normalizedKey]) {
        acc[normalizedKey] = []
      }
      acc[normalizedKey].push(campaign)
      return acc
    }, {})

    return [
      {
        id: "all",
        name: "All Campaigns",
        products: campaigns,
      },
      ...Object.entries(groups).map(([key, products]) => ({
        id: key.toLowerCase().replace(/\s+/g, "-"),
        name: key,
        products,
      })),
    ]
  }, [campaigns])

  const activeCategory = categories.find((category) => category.id === activeTab) ?? categories[0]

  return (
      <div className="container py-8 md:py-12">
        <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse Digital Products and Campaigns</h1>
          <p className="text-muted-foreground mt-2">Discover active products and campaigns from sellers across the marketplace.</p>
          <Button asChild className="mt-4">
            <Link href="/create-shop">
              <Store className="mr-2 h-4 w-4" />
              Create Shop
            </Link>
          </Button>
        </div>

        <div className="md:hidden">
          <CategoryFilter />
        </div>

        {loading ? (
          <div className="rounded-3xl border border-dashed border-muted p-10 text-center">
            <p className="text-lg font-medium">Loading campaigns...</p>
            <p className="text-sm text-muted-foreground mt-2">Fetching the latest campaign listings from Supabase.</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-destructive p-10 text-center">
            <p className="text-lg font-medium text-destructive">Unable to load campaigns</p>
            <p className="text-sm text-muted-foreground mt-2">{error}</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-3xl border border-muted p-10 text-center">
            <p className="text-lg font-medium">No campaigns found</p>
            <p className="text-sm text-muted-foreground mt-2">Create a campaign from the create shop page to get listed here.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start mb-8 overflow-auto">
                  {categories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id}>
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={activeCategory?.id ?? "all"}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {activeCategory?.products.map((campaign) => (
                      <ProductCard
                        key={campaign.id}
                        id={String(campaign.id)}
                        title={campaign.title}
                        price={Number(campaign.payout ?? campaign.budget ?? 0)}
                        image={campaign.thumbnail || placeholderImage}
                        category={campaign.platform || campaign.category || "General"}
                        seller={campaign.title}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="md:hidden space-y-12">
              {categories.slice(1).map((category) => (
                <div key={category.id} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">{category.name}</h2>
                    <Link href={`/products/category/${category.id}`}>
                      <Button variant="link" className="gap-1">
                        View All <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {category.products.slice(0, 2).map((campaign) => (
                      <ProductCard
                        key={campaign.id}
                        id={String(campaign.id)}
                        title={campaign.title}
                        price={Number(campaign.payout ?? campaign.budget ?? 0)}
                        image={campaign.thumbnail || placeholderImage}
                        category={campaign.platform || campaign.category || "General"}
                        seller={campaign.title}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
