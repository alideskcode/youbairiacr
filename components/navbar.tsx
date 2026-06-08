"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import { ShoppingCart, Home, Package, MessageSquare } from "lucide-react"
import { useCartStore } from "@/app/store/cart"
import { SearchBox } from "@/components/search-box"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export function Navbar() {
  const items = useCartStore((state) => state.items)
  const totalCount = items.reduce((total, item) => total + item.quantity, 0)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleCartClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      router.push("/login?callbackUrl=/cart")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-2 py-2">
          {/* Logo */}
          <Link href="/" className="text-lg font-bold">
            YOUBAIRIA
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <Link href="/campaigns" className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
              <Package className="h-3.5 w-3.5" />
              Campaigns
            </Link>
            <Link href="/contact-us" className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
              <MessageSquare className="h-3.5 w-3.5" />
              Help
            </Link>
          </nav>

          {/* Search and User Actions */}
          <div className="flex items-center gap-3 w-full max-w-2xl">
            <div className="flex-1">
              <SearchBox />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href="/cart" onClick={handleCartClick} className="relative">
                <ShoppingCart className="h-4 w-4" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
            {/* Temporarily always show UserMenu for testing */}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}