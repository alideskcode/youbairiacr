"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { MouseEvent } from "react"
import { BarChart3, Library, PackagePlus, Search, ShoppingCart, Store } from "lucide-react"

import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import { useCartStore } from "@/app/store/cart"
import { useAuth } from "@/hooks/use-auth"

export function Navbar() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const totalCount = items.reduce((total, item) => total + item.quantity, 0)
  const { isAuthenticated, isLoading } = useAuth()

  const requireAuth = (href: string) => (event: MouseEvent) => {
    if (!isAuthenticated) {
      event.preventDefault()
      router.push(`/login?callbackUrl=${encodeURIComponent(href)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Youbairia
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Button asChild variant="ghost" size="sm">
              <Link href="/products">
                <Search className="mr-2 h-4 w-4" />
                Marketplace
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/sell/product">
                <PackagePlus className="mr-2 h-4 w-4" />
                Sell
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/product-manager" onClick={requireAuth("/product-manager")}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/campaigns">
                <Store className="mr-2 h-4 w-4" />
                Campaigns
              </Link>
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/orders" onClick={requireAuth("/orders")}>
                <Library className="h-4 w-4" />
                <span className="sr-only">Library</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart" onClick={requireAuth("/cart")} className="relative">
                <ShoppingCart className="h-4 w-4" />
                {totalCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] text-background">
                    {totalCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
            {!isLoading && (isAuthenticated ? <UserMenu /> : (
              <Button asChild size="sm">
                <Link href="/login">Log in</Link>
              </Button>
            ))}
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto md:hidden">
          <Button asChild variant="outline" size="sm"><Link href="/products">Marketplace</Link></Button>
          <Button asChild variant="outline" size="sm"><Link href="/sell/product">Sell</Link></Button>
          <Button asChild variant="outline" size="sm"><Link href="/product-manager" onClick={requireAuth("/product-manager")}>Dashboard</Link></Button>
          <Button asChild variant="outline" size="sm"><Link href="/campaigns">Campaigns</Link></Button>
        </nav>
      </div>
    </header>
  )
}
