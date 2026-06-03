"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Check, ExternalLink, Mail, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useProductPurchase } from "@/hooks/use-product-purchase"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase/client"

type Campaign = {
  id: string
  title: string
  description?: string
  thumbnail?: string
  platform?: string
  category?: string
  payout?: number
  budget?: number
  contact_email?: string
  website?: string
  social_links?: string[] | null
  seller_id?: string
  created_at?: string
  status?: string
}

const placeholderImage = "/placeholder.svg?height=600&width=600"

export default function ProductPage() {
  const params = useParams()
  const id = typeof params.id === "string" ? params.id : params.id?.[0]
  const { addToCart, buyNow, isAdding, isBuying } = useProductPurchase()

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      setError("Invalid product ID")
      return
    }

    const fetchCampaign = async () => {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .maybeSingle()

      if (fetchError) {
        setError(fetchError.message)
        setCampaign(null)
      } else if (!data) {
        setError("Product not found")
        setCampaign(null)
      } else {
        setError(null)
        setCampaign(data as Campaign)
      }

      setLoading(false)
    }

    fetchCampaign()
  }, [id])

  if (loading) {
    return (
      <div className="container px-4 py-8 md:py-12">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="container px-4 py-8 md:py-12 space-y-4">
        <Link href="/products" className="inline-flex items-center gap-1 text-sm font-medium hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <p className="text-destructive">{error ?? "Product not found"}</p>
      </div>
    )
  }

  const price = Number(campaign.payout ?? campaign.budget ?? 0)
  const category = campaign.platform || campaign.category || "General"
  const shopName = campaign.title
  const cartProduct = {
    id: campaign.id,
    title: campaign.title,
    price,
    image: campaign.thumbnail || placeholderImage,
    category,
    seller: shopName,
  }
  const socialLinks = Array.isArray(campaign.social_links)
    ? campaign.social_links.filter(Boolean)
    : []
  const dateAdded = campaign.created_at
    ? new Date(campaign.created_at).toLocaleDateString()
    : null

  return (
      <div className="container px-4 py-8 md:py-12">
        <Link href="/products" className="inline-flex items-center gap-1 text-sm font-medium mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6">
            <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
              <Image
                src={campaign.thumbnail || placeholderImage}
                alt={campaign.title}
                width={600}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{campaign.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge>{category}</Badge>
                <p className="text-sm text-muted-foreground">by {shopName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold">${price.toFixed(2)}</div>
            </div>
            {campaign.description && (
              <p className="text-muted-foreground">{campaign.description}</p>
            )}
            <Separator />
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <h3 className="font-semibold">Seller details</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Shop name</dt>
                  <dd className="font-medium">{shopName}</dd>
                </div>
                {campaign.contact_email && (
                  <div>
                    <dt className="text-muted-foreground">Contact</dt>
                    <dd>
                      <a
                        href={`mailto:${campaign.contact_email}`}
                        className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {campaign.contact_email}
                      </a>
                    </dd>
                  </div>
                )}
                {campaign.website && (
                  <div>
                    <dt className="text-muted-foreground">Website</dt>
                    <dd>
                      <a
                        href={campaign.website.startsWith("http") ? campaign.website : `https://${campaign.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-primary hover:underline break-all"
                      >
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        {campaign.website}
                      </a>
                    </dd>
                  </div>
                )}
                {socialLinks.length > 0 && (
                  <div>
                    <dt className="text-muted-foreground">Social</dt>
                    <dd className="flex flex-wrap gap-2 mt-1">
                      {socialLinks.map((url) => (
                        <a
                          key={url}
                          href={url.startsWith("http") ? url : `https://${url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-xs break-all"
                        >
                          {url.replace(/^https?:\/\//, "")}
                        </a>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            <Separator />
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="sm:flex-1 gap-2"
                disabled={isAdding || isBuying}
                onClick={() => addToCart(cartProduct)}
              >
                <ShoppingCart className="h-5 w-5" />
                {isAdding ? "Adding..." : "Add to Cart"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="sm:flex-1"
                disabled={isAdding || isBuying}
                onClick={() => buyNow(cartProduct)}
              >
                {isBuying ? "Redirecting..." : "Buy Now"}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Digital product — Instant delivery after purchase</p>
              {dateAdded && <p>Listed on {dateAdded}</p>}
            </div>
          </div>
        </div>
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="seller">Seller</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Product Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {campaign.description || "No description provided."}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="seller" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">About the seller</h3>
                <p className="text-muted-foreground">
                  This listing is sold by <span className="font-medium text-foreground">{shopName}</span>
                  {category ? ` in the ${category} category` : ""}.
                </p>
                {campaign.description && (
                  <p className="text-muted-foreground whitespace-pre-wrap">{campaign.description}</p>
                )}
                <ul className="space-y-2 text-sm">
                  {campaign.contact_email && (
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>
                        Email:{" "}
                        <a href={`mailto:${campaign.contact_email}`} className="text-primary hover:underline">
                          {campaign.contact_email}
                        </a>
                      </span>
                    </li>
                  )}
                  {campaign.website && (
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>
                        Website:{" "}
                        <a
                          href={campaign.website.startsWith("http") ? campaign.website : `https://${campaign.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {campaign.website}
                        </a>
                      </span>
                    </li>
                  )}
                  {socialLinks.map((url) => (
                    <li key={url} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <a
                        href={url.startsWith("http") ? url : `https://${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="support" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Support</h3>
                <p className="text-muted-foreground">
                  For questions about this product, contact the seller directly.
                </p>
                {campaign.contact_email ? (
                  <a
                    href={`mailto:${campaign.contact_email}`}
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    {campaign.contact_email}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">No contact email provided by the seller.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  )
}
