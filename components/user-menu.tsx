"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { User, Settings, LogOut, ShoppingBag, Package } from "lucide-react"
import { toast } from "sonner"

type SessionUser = {
  id: string
  name: string
  email: string
  image: string | null
}

export function UserMenu() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return

      const sessionUser = data.session?.user
      if (sessionUser) {
        setUser({
          id: sessionUser.id,
          name: (sessionUser.user_metadata as any)?.full_name || sessionUser.email || "User",
          email: sessionUser.email || "",
          image: (sessionUser.user_metadata as any)?.avatar_url || (sessionUser.user_metadata as any)?.picture || null,
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    }

    loadSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user
      if (sessionUser) {
        setUser({
          id: sessionUser.id,
          name: (sessionUser.user_metadata as any)?.full_name || sessionUser.email || "User",
          email: sessionUser.email || "",
          image: (sessionUser.user_metadata as any)?.avatar_url || (sessionUser.user_metadata as any)?.picture || null,
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => {
      mounted = false
      authListener.subscription?.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signOut()
    setIsLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    router.push("/login")
  }

  if (!user) {
    return null
  }

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-8 w-8 border-2 border-primary/10 hover:border-primary/20 transition-colors">
          <AvatarImage src={user.image || ""} alt={user.name || ""} />
          <AvatarFallback className="bg-primary/5">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/orders")}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          <span>Orders</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/product-manager")}>
          <Package className="mr-2 h-4 w-4" />
          <span>Product Manager</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoading ? "Signing out..." : "Sign Out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 