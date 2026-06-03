"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useProductPurchase } from "@/hooks/use-product-purchase"

interface ProductCardProps {
  id: string
  title: string
  price: number
  image: string
  category: string
  seller: string
}

export default function ProductCard({
  id,
  title,
  price,
  image,
  category,
  seller,
}: ProductCardProps) {
  const { addToCart, buyNow, isAdding, isBuying } = useProductPurchase()

  const product = { id, title, price, image, category, seller }

  return (
    <div className="group relative bg-background rounded-lg border p-4 hover:shadow-md transition-shadow">
      <Link href={`/products/${id}`} className="block">
        <div className="aspect-square relative mb-4 overflow-hidden rounded-md">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-1">{category}</p>
        {seller && <p className="text-xs text-muted-foreground mb-2">by {seller}</p>}
        <p className="font-medium">₹{price.toFixed(2)}</p>
      </Link>
      <div className="flex flex-col gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          disabled={isAdding || isBuying}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            addToCart(product)
          }}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isAdding ? "Adding..." : "Add to Cart"}
        </Button>
        <Button
          size="sm"
          className="w-full"
          disabled={isAdding || isBuying}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            buyNow(product)
          }}
        >
          {isBuying ? "Redirecting..." : "Buy Now"}
        </Button>
      </div>
    </div>
  )
}
