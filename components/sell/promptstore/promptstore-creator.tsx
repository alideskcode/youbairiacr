"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Sparkles, LogIn } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { PromptstoreChat } from "@/components/sell/promptstore/promptstore-chat"
import { PromptstorePreview } from "@/components/sell/promptstore/promptstore-preview"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { AICreateResponse } from "@/lib/types/ai-create"

export function PromptstoreCreator() {
  const [authReady, setAuthReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [draft, setDraft] = useState<AICreateResponse | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session?.user)
      setUserEmail(session?.user?.email ?? null)
      setAuthReady(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user)
      setUserEmail(session?.user?.email ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!authReady) {
    return (
      <div className="flex h-[calc(100dvh-10rem)] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100dvh-10rem)] min-h-[600px] flex-col bg-background">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-none">AI Creator</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Campaigns & digital products
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Badge variant="secondary" className="hidden sm:inline-flex text-xs">
              {userEmail}
            </Badge>
          ) : (
            <Button asChild size="sm" variant="default" className="gap-1.5">
              <Link href="/login?callbackUrl=/sell/promptstore">
                <LogIn className="h-3.5 w-3.5" />
                Sign in
              </Link>
            </Button>
          )}
        </div>
      </header>

      {/* Split panel */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="flex min-h-0 flex-1 flex-col border-b border-border lg:border-b-0 lg:border-r">
          <PromptstoreChat
            onDraft={setDraft}
            isAuthenticated={isAuthenticated}
          />
        </div>
        <div className="flex w-full shrink-0 flex-col lg:w-[400px] xl:w-[440px]">
          <PromptstorePreview
            draft={draft}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </div>
  )
}
