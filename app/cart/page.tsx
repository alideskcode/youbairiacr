"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Minus, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCartStore } from "@/app/store/cart"
import { supabase } from "@/lib/supabase/client"

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem } = useCartStore()
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdatingItems((prev) => new Set(prev).add(id))
    updateQuantity(id, newQuantity)
    setUpdatingItems((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const handleRemoveItem = (id: string) => {
    setUpdatingItems((prev) => new Set(prev).add(id))
    removeItem(id)
    setUpdatingItems((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        toast.info("Please log in to complete your purchase")
        router.push(`/login?callbackUrl=${encodeURIComponent("/checkout")}`)
        return
      }

      router.push("/checkout")
    } finally {
      setIsCheckingOut(false)
    }
  }

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const tax = subtotal * 0.1
  const total = subtotal + tax

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 text-center">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-muted-foreground">₹{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={updatingItems.has(item.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      disabled={updatingItems.has(item.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={updatingItems.has(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}

            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total</span>
                <span className="font-bold">₹{total.toFixed(2)}</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                disabled={isCheckingOut}
                onClick={handleCheckout}
              >
                {isCheckingOut ? "Checking..." : "Proceed to Checkout"}
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
