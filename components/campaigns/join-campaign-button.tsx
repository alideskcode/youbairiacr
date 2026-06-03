"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  campaignId: string
  initialJoined?: boolean
  size?: "default" | "sm" | "lg"
  className?: string
  fullWidth?: boolean
}

export function JoinCampaignButton({
  campaignId,
  initialJoined = false,
  size = "default",
  className,
  fullWidth,
}: Props) {
  const router = useRouter()
  const [joined, setJoined] = useState(initialJoined)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleJoin = async () => {
    if (joined || loading) return

    setLoading(true)
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/join`, {
        method: "POST",
      })
      const json = await res.json()

      if (res.status === 401) {
        router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
        return
      }

      if (!json.success) {
        throw new Error(json.error ?? "Failed to join")
      }

      setJoined(true)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 1300)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      size={size}
      onClick={handleJoin}
      disabled={joined || loading}
      className={cn(
        fullWidth && "w-full",
        joined && "bg-emerald-600 hover:bg-emerald-600",
        showSuccess && "ring-2 ring-emerald-400 ring-offset-2",
        className
      )}
    >
      {showSuccess ? (
        <Check className="h-5 w-5 animate-in zoom-in duration-300" />
      ) : joined ? (
        <>
          <Check className="h-4 w-4 mr-1" />
          Joined
        </>
      ) : loading ? (
        "Joining..."
      ) : (
        "Join Campaign"
      )}
    </Button>
  )
}
