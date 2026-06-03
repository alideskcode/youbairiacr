"use client"

export const dynamic = "force-dynamic"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { supabase } from "@/lib/supabase/client"
import { useAdmin } from "@/hooks/use-admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Campaign = {
  id: string
  title: string
  description?: string
  thumbnail?: string
  platform?: string
  payout?: number
  budget?: number
  contact_email?: string
  website?: string
  social_links?: string[] | null
  status?: string
  seller_id?: string
  created_at?: string
}

type CampaignForm = {
  title: string
  description: string
  thumbnail: string
  platform: string
  payout: string
  budget: string
  contact_email: string
  website: string
  social_links: string
  status: string
}

const emptyForm: CampaignForm = {
  title: "",
  description: "",
  thumbnail: "",
  platform: "",
  payout: "",
  budget: "",
  contact_email: "",
  website: "",
  social_links: "",
  status: "active",
}

function campaignToForm(campaign: Campaign): CampaignForm {
  return {
    title: campaign.title ?? "",
    description: campaign.description ?? "",
    thumbnail: campaign.thumbnail ?? "",
    platform: campaign.platform ?? "",
    payout: String(campaign.payout ?? ""),
    budget: String(campaign.budget ?? ""),
    contact_email: campaign.contact_email ?? "",
    website: campaign.website ?? "",
    social_links: Array.isArray(campaign.social_links)
      ? campaign.sozcial_links.join("\n")
      : "",
    status: campaign.status ?? "active",
  }
}

function formToPayload(form: CampaignForm) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    thumbnail:
      form.thumbnail.trim() || "/placeholder.svg?height=300&width=300",
    platform: form.platform.trim() || "General",
    payout: Number(form.payout) || 0,
    budget: Number(form.budget) || 0,
    contact_email: form.contact_email.trim(),
    website: form.website.trim(),
    social_links: form.social_links
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    status: form.status,
  }
}

export default function AdminProductsPage() {
  const { isReady, isAdmin, getAuthHeaders } = useAdmin()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Campaign | null>(null)
  const [form, setForm] = useState<CampaignForm>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null)
  const deleteInFlight = useRef(false)

  const fetchCampaigns = useCallback(async () => {
    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      const response = await fetch("/api/admin/campaigns", { headers })

      if (response.status === 401) {
        toast.error("Admin access required. Add your email to ADMIN_EMAILS in .env.local")
        return
      }

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error ?? "Failed to load products")
      }

      const data = await response.json()
      setCampaigns(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : "Failed to load products")
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders])

  useEffect(() => {
    if (isReady && isAdmin) {
      fetchCampaigns()
    }
  }, [isReady, isAdmin, fetchCampaigns])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return campaigns.filter((c) => {
      const matchesStatus =
        statusFilter === "all" || (c.status ?? "").toLowerCase() === statusFilter
      const matchesSearch =
        !q ||
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.platform?.toLowerCase().includes(q) ||
        c.contact_email?.toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [campaigns, search, statusFilter])

  const closeDialog = () => {
    setDialogOpen(false)
    setEditing(null)
    setForm(emptyForm)
  }

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (campaign: Campaign) => {
    setEditing(campaign)
    setForm(campaignToForm(campaign))
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required")
      return
    }

    setSaving(true)
    try {
      const payload = formToPayload(form)

      if (editing) {
        const { data, error } = await supabase
          .from("campaigns")
          .update(payload)
          .eq("id", editing.id)
          .select()
          .single()

        if (error) throw new Error(error.message)
        if (!data) throw new Error("Update failed — no rows changed")

        setCampaigns((prev) =>
          prev.map((c) => (c.id === editing.id ? (data as Campaign) : c))
        )
        toast.success("Product updated")
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        const { data, error } = await supabase
          .from("campaigns")
          .insert([
            {
              ...payload,
              seller_id: user?.id ?? null,
            },
          ])
          .select()
          .single()

        if (error) throw new Error(error.message)
        if (!data) throw new Error("Create failed")

        setCampaigns((prev) => [data as Campaign, ...prev])
        toast.success("Product created")
      }

      closeDialog()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget || deleteInFlight.current) return

    deleteInFlight.current = true
    setIsDeleting(true)
    const targetId = deleteTarget.id

    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`/api/admin/campaigns/${targetId}`, {
        method: "DELETE",
        headers,
      })

      const body = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(body.error ?? "Delete failed")
      }

      setCampaigns((prev) => prev.filter((c) => c.id !== targetId))
      toast.success("Product deleted")
      setDeleteTarget(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed")
    } finally {
      setIsDeleting(false)
      deleteInFlight.current = false
    }
  }

  const updateField = (field: keyof CampaignForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  if (!isReady) {
    return <p className="text-muted-foreground">Loading admin...</p>
  }

  if (!isAdmin) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 space-y-2">
        <h2 className="font-semibold text-destructive">Admin access denied</h2>
        <p className="text-sm text-muted-foreground">
          Your account is not in ADMIN_EMAILS. Add your login email to{" "}
          <code className="text-xs">ADMIN_EMAILS</code> in <code className="text-xs">.env.local</code>{" "}
          and restart the dev server.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">
            Create, read, update, and delete marketplace product listings.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={fetchCampaigns} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add product
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, category, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="outline">{filtered.length} products</Badge>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((campaign) => {
                const price = Number(campaign.payout ?? campaign.budget ?? 0)
                return (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="relative h-10 w-10 shrink-0 rounded-md overflow-hidden border bg-muted">
                          <Image
                            src={
                              campaign.thumbnail ||
                              "/placeholder.svg?height=40&width=40"
                            }
                            alt={campaign.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{campaign.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-[240px]">
                            {campaign.description || "—"}
                          </p>
                          <Link
                            href={`/products/${campaign.id}`}
                            className="text-xs text-primary hover:underline"
                          >
                            View on site
                          </Link>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{campaign.platform || "—"}</TableCell>
                    <TableCell>${price.toFixed(2)}</TableCell>
                    <TableCell className="text-sm">
                      {campaign.contact_email || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{campaign.status ?? "—"}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(campaign)}
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(campaign)}
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog()
          else setDialogOpen(true)
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit product" : "Add product"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update listing details. Changes appear on the marketplace immediately."
                : "Create a new marketplace listing."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="platform">Category / platform</Label>
                <Input
                  id="platform"
                  value={form.platform}
                  onChange={(e) => updateField("platform", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => updateField("status", v)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">active</SelectItem>
                    <SelectItem value="inactive">inactive</SelectItem>
                    <SelectItem value="pending">pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="payout">Payout / price</Label>
                <Input
                  id="payout"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.payout}
                  onChange={(e) => updateField("payout", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.budget}
                  onChange={(e) => updateField("budget", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                value={form.thumbnail}
                onChange={(e) => updateField("thumbnail", e.target.value)}
                placeholder="/placeholder.svg?height=300&width=300"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact_email">Contact email</Label>
              <Input
                id="contact_email"
                type="email"
                value={form.contact_email}
                onChange={(e) => updateField("contact_email", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={form.website}
                onChange={(e) => updateField("website", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="social_links">Social links (one per line)</Label>
              <Textarea
                id="social_links"
                rows={3}
                value={form.social_links}
                onChange={(e) => updateField("social_links", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editing ? "Save changes" : "Create product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes &quot;{deleteTarget?.title}&quot; from the marketplace.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={() => void handleDelete()}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
