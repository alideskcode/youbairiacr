"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CreditCard, Lock, ShieldCheck, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/app/store/cart"
import { formatMoney } from "@/lib/marketplace"

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <CheckoutContent />
    </AuthGuard>
  )
}

function CheckoutContent() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const platformFee = subtotal * 0.1
  const total = subtotal + platformFee

  const startCheckout = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/marketplace/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })),
        }),
      })
      const body = await res.json()
      if (!res.ok || !body.success) throw new Error(body.error ?? "Checkout failed")

      if (body.data.checkout_url) {
        await clearCart()
        window.location.href = body.data.checkout_url
        return
      }

      toast.info(body.data.message ?? "Order created. Payment gateway is not configured.")
      router.push(`/orders?order=${body.data.order_id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to start checkout")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-14 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add a course, software product, download, or community before checkout.</p>
        <Button asChild className="mt-5">
          <Link href="/products">Browse marketplace</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="py-8 md:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-2 text-muted-foreground">Access unlocks only after the payment provider confirms the payment.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="grid gap-4 rounded-lg border p-4 sm:grid-cols-[96px_1fr_auto]">
              <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                <Image src={item.image || "/placeholder.jpg"} alt={item.title} fill className="object-cover" />
              </div>
              <div>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-sm text-muted-foreground">{item.category} by {item.seller}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                </div>
              </div>
              <div className="flex items-start justify-between gap-4 sm:block sm:text-right">
                <p className="font-semibold">{formatMoney(item.price * item.quantity)}</p>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="mt-0 sm:mt-3">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            </div>
          ))}
        </section>

        <aside className="h-fit rounded-lg border p-5 lg:sticky lg:top-28">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform fee</span>
              <span>{formatMoney(platformFee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>
          <Button size="lg" className="mt-5 w-full gap-2" onClick={startCheckout} disabled={loading}>
            <CreditCard className="h-4 w-4" />
            {loading ? "Starting payment..." : "Pay securely"}
          </Button>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p className="flex gap-2"><Lock className="mt-0.5 h-4 w-4 shrink-0" /> No frontend-only unlocks.</p>
            <p className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /> Products unlock from verified webhooks.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
