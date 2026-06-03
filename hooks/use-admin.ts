"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export function getClientAdminEmails(): string[] {
  const raw =
    process.env.NEXT_PUBLIC_ADMIN_EMAILS ??
    process.env.ADMIN_EMAILS ??
    "admin@example.com"

  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function isClientAdminEmail(email?: string | null): boolean {
  if (!email) return false
  return getClientAdminEmails().includes(email.toLowerCase())
}

export function useAdmin() {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [email, setEmail] = useState<string | null>(null)

  const checkAdmin = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      router.push("/login?callbackUrl=/admin/products")
      return false
    }

    const userEmail = session.user.email ?? null
    setEmail(userEmail)

    if (!isClientAdminEmail(userEmail)) {
      setIsAdmin(false)
      setIsReady(true)
      return false
    }

    setIsAdmin(true)
    setIsReady(true)
    return true
  }, [router])

  useEffect(() => {
    checkAdmin()
  }, [checkAdmin])

  const getAuthHeaders = useCallback(async (): Promise<HeadersInit> => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const headers: HeadersInit = { "Content-Type": "application/json" }
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`
    }
    return headers
  }, [])

  return { isReady, isAdmin, email, checkAdmin, getAuthHeaders }
}
