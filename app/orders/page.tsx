"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ExternalLink, Library, Lock, MessageCircle } from "lucide-react"

import { AuthGuard } from "@/components/auth-guard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type AccessRow = {
  id: string
  status: string
  created_at: string
  digital_products: {
    id: string
    title: string
    description: string
    product_type: string
    category: string
    cover_url?: string
    thumbnail_url?: string
    access_url?: string
    telegram_invite_url?: string
    seller_name?: string
    support_email?: string
  } | null
  telegram_access_grants?: {
    status: string
    invite_url: string
    telegram_chat_id: string
  }[]
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <OrdersContent />
    </AuthGuard>
  )
}

function OrdersContent() {
  const [access, setAccess] = useState<AccessRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAccess = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/marketplace/access")
        const body = await res.json()
        if (!res.ok || !body.success) throw new Error(body.error ?? "Failed to load library")
        setAccess(body.data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load library")
      } finally {
        setLoading(false)
      }
    }

    void loadAccess()
  }, [])

  if (loading) return <div className="py-12 text-muted-foreground">Loading your library...</div>

  if (error) {
    return <div className="my-10 rounded-lg border border-destructive/40 p-8 text-destructive">{error}</div>
  }

  if (access.length === 0) {
    return (
      <div className="py-14 text-center">
        <Library className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">No unlocked products yet</h1>
        <p className="mt-2 text-muted-foreground">After a verified payment, your products and communities appear here.</p>
        <Button asChild className="mt-5">
          <Link href="/products">Browse marketplace</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="py-8 md:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Your library</h1>
        <p className="mt-2 text-muted-foreground">Paid products, course access, software links, downloads, and community invites.</p>
      </div>

      <div className="grid gap-5">
        {access.map((row) => {
          const product = row.digital_products
          if (!product) return null
          const image = product.cover_url || product.thumbnail_url || "/placeholder.jpg"
          const telegramGrant = row.telegram_access_grants?.find((grant) => grant.status === "granted")

          return (
            <div key={row.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-[140px_1fr_auto]">
              <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-muted md:aspect-square">
                <Image src={image} alt={product.title} fill className="object-cover" />
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge>{product.product_type}</Badge>
                  <Badge variant="outline">{row.status}</Badge>
                </div>
                <h2 className="text-xl font-semibold">{product.title}</h2>
                <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                <p className="text-sm text-muted-foreground">Seller: {product.seller_name || "Youbairia seller"}</p>
              </div>
              <div className="flex flex-col gap-2 md:min-w-48">
                {product.access_url ? (
                  <Button asChild>
                    <a href={product.access_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open access
                    </a>
                  </Button>
                ) : (
                  <Button disabled variant="outline">
                    <Lock className="mr-2 h-4 w-4" />
                    No access URL
                  </Button>
                )}
                {telegramGrant?.invite_url && (
                  <Button asChild variant="outline">
                    <a href={telegramGrant.invite_url} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Join Telegram
                    </a>
                  </Button>
                )}
                {product.support_email && (
                  <Button asChild variant="ghost">
                    <a href={`mailto:${product.support_email}`}>Contact seller</a>
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
