"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FileVideo, LayoutDashboard, Megaphone, PackagePlus, Store } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/product-manager", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sell/product", label: "New Product", icon: PackagePlus },
  { href: "/products", label: "Marketplace", icon: Store },
  { href: "/product-manager/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/product-manager/submissions", label: "Submissions", icon: FileVideo },
]

export default function ProductManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login?callbackUrl=/product-manager")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle()

      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)

      const isAdmin =
        profile?.role === "admin" ||
        (user.email && adminEmails.includes(user.email.toLowerCase()))

      const isSeller = profile?.role === "seller" || isAdmin

      if (!isSeller) {
        router.replace("/login?callbackUrl=/product-manager")
        return
      }

      setAllowed(true)
      setReady(true)
    }

    void check()
  }, [router])

  if (!ready) {
    return (
      <div className="container py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!allowed) return null

  return (
    <div className="container py-8 w-full">
      <nav className="flex flex-wrap gap-2 mb-8 border-b pb-4">
        {nav.map((item) => {
          const Icon = item.icon
          const active =
            item.href === "/product-manager"
              ? pathname === "/product-manager"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      {children}
    </div>
  )
}
