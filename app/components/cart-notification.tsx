"use client"

import { useEffect, useState } from "react"
import { useCartStore } from "@/app/store/cart"
import { ShoppingCart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function CartNotification() {
  const [show, setShow] = useState(false)
  const items = useCartStore((state) => state.items)

  useEffect(() => {
    if (items.length > 0) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [items])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Added to cart</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 