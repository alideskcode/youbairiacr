"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { BarChart3, Boxes, CreditCard, PackagePlus, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatMoney, type MarketplaceProduct } from "@/lib/marketplace"

export default function ProductManagerOverviewPage() {
  const [products, setProducts] = useState<MarketplaceProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/marketplace/seller-products")
        const body = await res.json()
        if (res.ok && body.success) setProducts(body.data)
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  const activeProducts = products.filter((product) => product.status === "active")
  const grossListedValue = activeProducts.reduce((sum, product) => sum + Number(product.price), 0)
  const communityProducts = activeProducts.filter((product) => product.product_type === "community")

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge variant="outline" className="mb-3">Seller dashboard</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">Marketplace manager</h1>
          <p className="mt-1 text-muted-foreground">
            Sell courses, software, downloads, communities, bundles, and campaign-led offers.
          </p>
        </div>
        <Button asChild>
          <Link href="/sell/product">
            <PackagePlus className="mr-2 h-4 w-4" />
            New product
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <Boxes className="h-4 w-4" />
              Active products
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{activeProducts.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              Listed value
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{formatMoney(grossListedValue)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              Communities
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{communityProducts.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">Webhook</p>
            <p className="mt-1 text-xs text-muted-foreground">Tracked from payment events</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold">Your products</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/products">View marketplace</Link>
          </Button>
        </div>
        {loading ? (
          <div className="p-6 text-muted-foreground">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center">
            <h3 className="font-semibold">No products yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Create your first paid digital product.</p>
            <Button asChild className="mt-4">
              <Link href="/sell/product">Create product</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {products.map((product) => (
              <div key={product.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                <div>
                  <Link href={`/products/${product.slug || product.id}`} className="font-medium hover:underline">
                    {product.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">{product.product_type} · {product.category}</p>
                </div>
                <Badge variant={product.status === "active" ? "default" : "outline"}>{product.status}</Badge>
                <p className="font-semibold">{formatMoney(Number(product.price), product.currency)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
