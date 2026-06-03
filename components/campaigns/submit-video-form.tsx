"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { platformLabel } from "@/lib/campaign-utils"

export function SubmitVideoForm({
  campaignId,
  platforms,
}: {
  campaignId: string
  platforms: string[]
}) {
  const router = useRouter()
  const [platform, setPlatform] = useState(platforms[0] ?? "")
  const [videoUrl, setVideoUrl] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoUrl.trim()) {
      toast.error("Video URL is required")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, video_url: videoUrl, notes }),
      })
      const json = await res.json()

      if (res.status === 401) {
        router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
        return
      }

      if (!json.success) throw new Error(json.error)

      toast.success("Submission received!")
      setVideoUrl("")
      setNotes("")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submit failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border p-4 space-y-4 max-w-lg">
      <div className="grid gap-2">
        <Label>Platform</Label>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {platforms.map((p) => (
              <SelectItem key={p} value={p}>
                {platformLabel(p)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="video_url">Video URL</Label>
        <Input
          id="video_url"
          type="url"
          placeholder="https://..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit video"}
      </Button>
    </form>
  )
}
