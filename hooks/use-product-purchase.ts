"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { useCartStore, type CartItem } from "@/app/store/cart"
import { supabase } from "@/lib/supabase/client"

type ProductForCart = Omit<CartItem, "quantity">

export function useProductPurchase() {
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const [isAdding, setIsAdding] = useState(false)
  const [isBuying, setIsBuying] = useState(false)

  const addToCart = async (product: ProductForCart) => {
    try {
      setIsAdding(true)
      addItem({ ...product, quantity: 1 })
      toast.success("Added to cart!")
    } catch (error) {
      console.error("Failed to add to cart:", error)
      toast.error("Failed to add item to cart")
    } finally {
      setIsAdding(false)
    }
  }

  const buyNow = async (product: ProductForCart) => {
    try {
      setIsBuying(true)
      addItem({ ...product, quantity: 1 })

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        toast.info("Please log in to complete your purchase")
        router.push(
          `/login?callbackUrl=${encodeURIComponent("/checkout")}`
        )
        return
      }

      router.push("/checkout")
    } catch (error) {
      console.error("Failed to start checkout:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsBuying(false)
    }
  }

  return { addToCart, buyNow, isAdding, isBuying }
}
