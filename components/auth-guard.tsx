"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, fallback, redirectTo = "/login" }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return

        const authenticated = !!session?.user
        setIsAuthenticated(authenticated)

        if (!authenticated && redirectTo) {
          router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        if (mounted) {
          setIsAuthenticated(false)
          if (redirectTo) {
            router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
          }
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return

      const authenticated = !!session?.user
      setIsAuthenticated(authenticated)

      if (!authenticated && redirectTo && event === 'SIGNED_OUT') {
        router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router, redirectTo])

  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  return <>{children}</>
}