"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Sparkles, Plus, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PLATFORMS,
  type CampaignDetail,
  type CampaignFormInput,
  type PlatformKey,
  type ResourceType,
} from "@/lib/types/campaign"
import { slugify } from "@/lib/validators/campaign"

const RESOURCE_TYPES: { value: ResourceType; label: string }[] = [
  { value: "google_drive", label: "Google Drive" },
  { value: "dropbox", label: "Dropbox" },
  { value: "notion", label: "Notion" },
  { value: "zip", label: "ZIP" },
  { value: "external", label: "External URL" },
]

const defaultEarning = (platform: PlatformKey) => ({
  platform,
  payout_per_1k: 5,
  minimum_payout: 10,
  maximum_payout: 500,
})

function emptyForm(): CampaignFormInput {
  return {
    title: "",
    slug: "",
    description: "",
    thumbnail_url: "",
    banner_url: "",
    category: "General",
    budget_total: 1000,
    budget_remaining: 1000,
    avg_review_hours: 48,
    status: "draft",
    is_featured: false,
    requirements: [],
    resources: [],
    earnings: [defaultEarning("tiktok")],
    top_videos: [],
  }
}

export function campaignToFormInput(c: CampaignDetail): CampaignFormInput {
  return {
    title: c.title,
    slug: c.slug,
    description: c.description,
    thumbnail_url: c.thumbnail_url,
    banner_url: c.banner_url,
    category: c.category,
    budget_total: Number(c.budget_total),
    budget_remaining: Number(c.budget_remaining),
    avg_review_hours: c.avg_review_hours,
    status: c.status,
    is_featured: c.is_featured,
    requirements: c.requirements.map((r, i) => ({
      requirement: r.requirement,
      sort_order: r.sort_order ?? i,
    })),
    resources: c.resources.map((r) => ({
      title: r.title,
      url: r.url,
      type: r.type,
    })),
    earnings: (c.earnings ?? []).map((e) => ({
      platform: e.platform,
      payout_per_1k: Number(e.payout_per_1k),
      minimum_payout: Number(e.minimum_payout),
      maximum_payout: Number(e.maximum_payout),
    })),
    top_videos: c.top_videos.map((v, i) => ({
      creator_name: v.creator_name,
      thumbnail: v.thumbnail,
      video_url: v.video_url,
      views: Number(v.views),
      earnings: Number(v.earnings),
      sort_order: v.sort_order ?? i,
    })),
  }
}

type Props = {
  mode: "create" | "edit"
  campaignId?: string
  initial?: CampaignDetail
}

export function CampaignForm({ mode, campaignId, initial }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<CampaignFormInput>(
    initial ? campaignToFormInput(initial) : emptyForm()
  )
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformKey[]>(
    initial?.earnings?.map((e) => e.platform) ?? ["tiktok"]
  )
  const [aiTopic, setAiTopic] = useState("")
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [slugManual, setSlugManual] = useState(!!initial?.slug)

  const syncEarningsFromPlatforms = (platforms: PlatformKey[]) => {
    setForm((f) => {
      const existing = new Map(f.earnings.map((e) => [e.platform, e]))
      return {
        ...f,
        earnings: platforms.map(
          (p) => existing.get(p) ?? defaultEarning(p)
        ),
      }
    })
  }

  const togglePlatform = (key: PlatformKey, checked: boolean) => {
    const next = checked
      ? [...selectedPlatforms, key]
      : selectedPlatforms.filter((p) => p !== key)
    if (next.length === 0) {
      toast.error("Select at least one platform")
      return
    }
    setSelectedPlatforms(next)
    syncEarningsFromPlatforms(next)
  }

  const handleGenerate = async () => {
    if (!form.title.trim()) {
      toast.error("Enter a campaign title first")
      return
    }
    setGenerating(true)
    try {
      const res = await fetch("/api/campaigns/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title, topic: aiTopic || undefined }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)

      const g = json.data
      setForm((f) => ({
        ...f,
        description: g.description,
        category: g.category || f.category,
        requirements: (g.requirements as string[]).map((req: string, i: number) => ({
          requirement: req,
          sort_order: i,
        })),
      }))
      if (!slugManual) {
        setForm((f) => ({ ...f, slug: slugify(form.title) }))
      }
      toast.success("Campaign content generated")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI failed")
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Title and slug are required")
      return
    }
    if (form.earnings.length === 0) {
      toast.error("Add at least one platform")
      return
    }

    setSaving(true)
    try {
      const url =
        mode === "create"
          ? "/api/campaigns"
          : `/api/campaigns/${campaignId}`
      const method = mode === "create" ? "POST" : "PATCH"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)

      toast.success(mode === "create" ? "Campaign created" : "Campaign updated")
      router.push("/product-manager/campaigns")
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  const addRequirement = () => {
    setForm((f) => ({
      ...f,
      requirements: [
        ...f.requirements,
        { requirement: "", sort_order: f.requirements.length },
      ],
    }))
  }

  const addResource = () => {
    setForm((f) => ({
      ...f,
      resources: [
        ...f.resources,
        { title: "", url: "", type: "external" as ResourceType },
      ],
    }))
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="rounded-lg border bg-gradient-to-r from-violet-50 to-fuchsia-50 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-600" />
          <h3 className="font-semibold">AI Campaign Assistant</h3>
        </div>
        <Input
          placeholder="Optional campaign topic"
          value={aiTopic}
          onChange={(e) => setAiTopic(e.target.value)}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={handleGenerate}
          disabled={generating}
        >
          {generating ? "Generating..." : "✨ Generate Campaign Content"}
        </Button>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Basic information</h2>
        <div className="grid gap-2">
          <Label>Title *</Label>
          <Input
            value={form.title}
            onChange={(e) => {
              const title = e.target.value
              setForm((f) => ({
                ...f,
                title,
                ...(!slugManual && { slug: slugify(title) }),
              }))
            }}
          />
        </div>
        <div className="grid gap-2">
          <Label>Slug *</Label>
          <Input
            value={form.slug}
            onChange={(e) => {
              setSlugManual(true)
              setForm((f) => ({ ...f, slug: e.target.value }))
            }}
          />
        </div>
        <div className="grid gap-2">
          <Label>Description</Label>
          <Textarea
            rows={5}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Thumbnail URL</Label>
            <Input
              value={form.thumbnail_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, thumbnail_url: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Banner URL</Label>
            <Input
              value={form.banner_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, banner_url: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label>Category</Label>
          <Input
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Budget</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Total budget</Label>
            <Input
              type="number"
              min={0}
              value={form.budget_total}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  budget_total: Number(e.target.value),
                  budget_remaining:
                    f.budget_remaining > Number(e.target.value)
                      ? Number(e.target.value)
                      : f.budget_remaining,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Remaining budget</Label>
            <Input
              type="number"
              min={0}
              value={form.budget_remaining}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  budget_remaining: Number(e.target.value),
                }))
              }
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Platforms</h2>
        <div className="flex flex-wrap gap-4">
          {PLATFORMS.map((p) => (
            <label key={p.key} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selectedPlatforms.includes(p.key)}
                onCheckedChange={(c) => togglePlatform(p.key, !!c)}
              />
              {p.label}
            </label>
          ))}
        </div>
        <div className="space-y-3">
          {form.earnings.map((e, i) => (
            <div key={e.platform} className="rounded-lg border p-3 grid gap-2">
              <p className="font-medium text-sm">
                {PLATFORMS.find((p) => p.key === e.platform)?.label}
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  placeholder="Per 1K"
                  value={e.payout_per_1k}
                  onChange={(ev) => {
                    const val = Number(ev.target.value)
                    setForm((f) => {
                      const earnings = [...f.earnings]
                      earnings[i] = { ...earnings[i], payout_per_1k: val }
                      return { ...f, earnings }
                    })
                  }}
                />
                <Input
                  type="number"
                  placeholder="Min"
                  value={e.minimum_payout}
                  onChange={(ev) => {
                    const val = Number(ev.target.value)
                    setForm((f) => {
                      const earnings = [...f.earnings]
                      earnings[i] = { ...earnings[i], minimum_payout: val }
                      return { ...f, earnings }
                    })
                  }}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={e.maximum_payout}
                  onChange={(ev) => {
                    const val = Number(ev.target.value)
                    setForm((f) => {
                      const earnings = [...f.earnings]
                      earnings[i] = { ...earnings[i], maximum_payout: val }
                      return { ...f, earnings }
                    })
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Requirements</h2>
          <Button type="button" variant="outline" size="sm" onClick={addRequirement}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        {form.requirements.map((r, i) => (
          <div key={i} className="flex gap-2 items-start">
            <GripVertical className="h-5 w-5 text-muted-foreground mt-2 shrink-0" />
            <Textarea
              className="flex-1"
              rows={2}
              value={r.requirement}
              onChange={(e) => {
                const requirements = [...form.requirements]
                requirements[i] = {
                  ...requirements[i],
                  requirement: e.target.value,
                }
                setForm((f) => ({ ...f, requirements }))
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  requirements: f.requirements.filter((_, j) => j !== i),
                }))
              }
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Resources</h2>
          <Button type="button" variant="outline" size="sm" onClick={addResource}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        {form.resources.map((r, i) => (
          <div key={i} className="grid gap-2 rounded-lg border p-3">
            <Input
              placeholder="Title"
              value={r.title}
              onChange={(e) => {
                const resources = [...form.resources]
                resources[i] = { ...resources[i], title: e.target.value }
                setForm((f) => ({ ...f, resources }))
              }}
            />
            <Input
              placeholder="URL"
              value={r.url}
              onChange={(e) => {
                const resources = [...form.resources]
                resources[i] = { ...resources[i], url: e.target.value }
                setForm((f) => ({ ...f, resources }))
              }}
            />
            <Select
              value={r.type}
              onValueChange={(v) => {
                const resources = [...form.resources]
                resources[i] = {
                  ...resources[i],
                  type: v as ResourceType,
                }
                setForm((f) => ({ ...f, resources }))
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESOURCE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-fit"
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  resources: f.resources.filter((_, j) => j !== i),
                }))
              }
            >
              Remove
            </Button>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Avg review hours</Label>
          <Input
            type="number"
            min={1}
            value={form.avg_review_hours}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                avg_review_hours: Number(e.target.value),
              }))
            }
          />
        </div>
        <div className="grid gap-2">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) =>
              setForm((f) => ({
                ...f,
                status: v as CampaignFormInput["status"],
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <Switch
          checked={form.is_featured}
          onCheckedChange={(c) =>
            setForm((f) => ({ ...f, is_featured: c }))
          }
        />
        <Label>Featured campaign</Label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : mode === "create" ? "Create campaign" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/product-manager/campaigns")}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
