"use client"

import Image from "next/image"
import Link from "next/link"
import type { ElementType } from "react"
import { useEffect, useMemo, useState } from "react"
import { BookOpen, Boxes, Code2, Download, Search, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatMoney, type MarketplaceProduct, type ProductType } from "@/lib/marketplace"

const typeCopy: Record<ProductType | "all", { label: string; icon: ElementType }> = {
  all: { label: "All", icon: Boxes },
  course: { label: "Courses", icon: BookOpen },
  software: { label: "Software", icon: Code2 },
  community: { label: "Communities", icon: Users },
  download: { label: "Downloads", icon: Download },
  bundle: { label: "Bundles", icon: Boxes },
}

const placeholder = "/placeholder.jpg"

export default function ProductsPage() {
  const [products, setProducts] = useState<MarketplaceProduct[]>([])
  const [activeType, setActiveType] = useState<ProductType | "all">("all")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (activeType !== "all") params.set("type", activeType)
        if (query.trim()) params.set("q", query.trim())

        const res = await fetch(`/api/marketplace/products?${params.toString()}`, {
          signal: controller.signal,
        })
        const body = await res.json()
        if (!res.ok || !body.success) throw new Error(body.error ?? "Failed to load products")
        setProducts(body.data)
        setError(null)
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError(err instanceof Error ? err.message : "Failed to load products")
        }
      } finally {
        setLoading(false)
      }
    }, 180)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [activeType, query])

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category).filter(Boolean))).slice(0, 8),
    [products]
  )

  return (
    <div className="py-8 md:py-10">
      <section className="mb-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <Badge variant="outline" className="mb-3">Digital marketplace</Badge>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
            Buy courses, software, downloads, and private communities.
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Products unlock after verified payment. Community products can include Telegram access through Youbairia.
          </p>
        </div>
        <div className="flex gap-2 rounded-lg border bg-background p-2">
          <Search className="mt-2.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, skills, communities"
            className="border-0 shadow-none focus-visible:ring-0"
          />
        </div>
      </section>

      <Tabs value={activeType} onValueChange={(value) => setActiveType(value as ProductType | "all")}>
        <TabsList className="mb-6 h-auto w-full justify-start overflow-x-auto p-1">
          {Object.entries(typeCopy).map(([value, item]) => {
            const Icon = item.icon
            return (
              <TabsTrigger key={value} value={value} className="gap-2">
                <Icon className="h-4 w-4" />
                {item.label}
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>

      {categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge key={category} variant="secondary">{category}</Badge>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-lg border bg-muted/40" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/40 p-8 text-center text-destructive">{error}</div>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <h2 className="text-xl font-semibold">No products found</h2>
          <p className="mt-2 text-sm text-muted-foreground">Try another search or create the first listing.</p>
          <Button asChild className="mt-4">
            <Link href="/sell/product">Create product</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const image = product.cover_url || product.thumbnail_url || placeholder
            const href = `/products/${product.slug || product.id}`
            const type = typeCopy[product.product_type]
            const TypeIcon = type.icon

            return (
              <Link
                key={product.id}
                href={href}
                className="group overflow-hidden rounded-lg border bg-background transition hover:border-foreground/30 hover:shadow-sm"
              >
                <div className="relative aspect-[16/10] bg-muted">
                  <Image src={image} alt={product.title} fill className="object-cover transition group-hover:scale-[1.02]" />
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="outline" className="gap-1">
                      <TypeIcon className="h-3.5 w-3.5" />
                      {type.label}
                    </Badge>
                    <span className="font-semibold">{formatMoney(Number(product.price), product.currency)}</span>
                  </div>
                  <div>
                    <h2 className="line-clamp-2 text-lg font-semibold">{product.title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {product.subtitle || product.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{product.seller_name || "Youbairia seller"}</span>
                    <span>{product.category}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
