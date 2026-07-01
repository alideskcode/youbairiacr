"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, BadgeCheck, BookOpen, Code2, Download, ExternalLink, Lock, MessageCircle, ShieldCheck, Users } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase/client"
import { formatMoney, type MarketplaceProduct } from "@/lib/marketplace"
import { useCartStore } from "@/app/store/cart"

const placeholder = "/placeholder.jpg"

const typeMeta = {
  course: { label: "Course", icon: BookOpen },
  software: { label: "Software", icon: Code2 },
  community: { label: "Community", icon: Users },
  download: { label: "Download", icon: Download },
  bundle: { label: "Bundle", icon: BadgeCheck },
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params.id === "string" ? params.id : params.id?.[0]
  const addItem = useCartStore((state) => state.addItem)
  const [product, setProduct] = useState<MarketplaceProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const loadProduct = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/marketplace/products/${id}`)
        const body = await res.json()
        if (!res.ok || !body.success) throw new Error(body.error ?? "Product not found")
        setProduct(body.data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    void loadProduct()
  }, [id])

  const startCheckout = async () => {
    if (!product) return

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/products/${product.slug || product.id}`)}`)
      return
    }

    try {
      setCheckingOut(true)
      const res = await fetch("/api/marketplace/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ product_id: product.id, quantity: 1 }] }),
      })
      const body = await res.json()
      if (!res.ok || !body.success) throw new Error(body.error ?? "Checkout failed")
      if (body.data.checkout_url) {
        window.location.href = body.data.checkout_url
      } else {
        toast.info(body.data.message ?? "Order created. Payment gateway is not configured.")
        router.push(`/orders?order=${body.data.order_id}`)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed")
    } finally {
      setCheckingOut(false)
    }
  }

  if (loading) {
    return <div className="py-10 text-muted-foreground">Loading product...</div>
  }

  if (error || !product) {
    return (
      <div className="py-10">
        <Link href="/products" className="mb-4 inline-flex items-center gap-2 text-sm hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
        <div className="rounded-lg border p-8 text-destructive">{error ?? "Product not found"}</div>
      </div>
    )
  }

  const image = product.cover_url || product.thumbnail_url || placeholder
  const meta = typeMeta[product.product_type]
  const TypeIcon = meta.icon
  const includes = product.includes?.length ? product.includes : ["Instant unlock after verified payment", "Lifetime access unless stated otherwise", "Seller support included"]

  return (
    <div className="py-8 md:py-10">
      <Link href="/products" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Marketplace
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <section className="space-y-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border bg-muted">
            <Image src={image} alt={product.title} fill className="object-cover" priority />
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="access">Access</TabsTrigger>
              <TabsTrigger value="seller">Seller</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-5 space-y-4">
              <h2 className="text-2xl font-semibold">What you get</h2>
              <p className="whitespace-pre-wrap text-muted-foreground">{product.description}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {includes.map((item) => (
                  <div key={item} className="flex gap-3 rounded-lg border p-3 text-sm">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="access" className="mt-5 space-y-4">
              <h2 className="text-2xl font-semibold">Delivery</h2>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Unlocked by verified payment webhook</p>
                    <p className="text-sm text-muted-foreground">
                      Access links, downloads, course materials, and Telegram invites are shown in your orders library after payment succeeds.
                    </p>
                  </div>
                </div>
              </div>
              {product.product_type === "community" && (
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Telegram community access</p>
                      <p className="text-sm text-muted-foreground">
                        Youbairia stores the seller invite and exposes it only to paid buyers.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="seller" className="mt-5 space-y-3">
              <h2 className="text-2xl font-semibold">{product.seller_name || "Youbairia seller"}</h2>
              <p className="text-muted-foreground">Category: {product.category}</p>
              {product.support_email && (
                <a href={`mailto:${product.support_email}`} className="inline-flex items-center gap-2 text-sm font-medium hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  {product.support_email}
                </a>
              )}
            </TabsContent>
          </Tabs>
        </section>

        <aside className="h-fit rounded-lg border bg-background p-5 lg:sticky lg:top-28">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="gap-1">
                <TypeIcon className="h-3.5 w-3.5" />
                {meta.label}
              </Badge>
              <Badge variant="outline">{product.category}</Badge>
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">{product.title}</h1>
              {product.subtitle && <p className="mt-2 text-muted-foreground">{product.subtitle}</p>}
            </div>
            <div className="text-3xl font-semibold">{formatMoney(Number(product.price), product.currency)}</div>
            <Separator />
            <Button size="lg" className="w-full" onClick={startCheckout} disabled={checkingOut}>
              {checkingOut ? "Starting checkout..." : "Buy now"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={() => {
                addItem({
                  id: product.id,
                  title: product.title,
                  price: Number(product.price),
                  image,
                  category: product.category,
                  seller: product.seller_name || "Youbairia seller",
                })
                toast.success("Added to cart")
              }}
            >
              Add to cart
            </Button>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Secure payment verification</p>
              <p className="flex items-center gap-2"><Download className="h-4 w-4" /> Instant buyer library unlock</p>
              {product.product_type === "community" && <p className="flex items-center gap-2"><Users className="h-4 w-4" /> Telegram access after payment</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
