"use client"

import { useEffect, useState } from "react"
import { useCartStore } from "@/app/store/cart"
import { Check, ShoppingCart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function CartNotification() {
  const [show, setShow] = useState(false)
  const items = useCartStore((state) => state.items)
  const router = useRouter()

  useEffect(() => {
    if (items.length > 0) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [items])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-4 right-4 z-50"
        >
          <Link href="/cart" onClick={() => setShow(false)}>
            <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 cursor-pointer hover:bg-green-600 transition-colors">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">Added to cart</span>
              <ShoppingCart className="h-4 w-4 ml-1" />
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 