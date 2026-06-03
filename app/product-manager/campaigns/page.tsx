"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
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
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Campaign } from "@/lib/types/campaign"
import { formatCurrency } from "@/lib/campaign-utils"

export default function CampaignsListPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null)
    })
  }, [])

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      let { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("creator_id", userId)
        .order("created_at", { ascending: false })

      if (error?.message?.includes("creator_id")) {
        const legacy = await supabase
          .from("campaigns")
          .select("*")
          .eq("seller_id", userId)
          .order("created_at", { ascending: false })
        data = legacy.data
        error = legacy.error
      }

      if (error) throw new Error(error.message)
      setCampaigns((data as Campaign[]) ?? [])
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Load failed")
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) void load()
  }, [userId, load])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/campaigns/${deleteId}`, { method: "DELETE" })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setCampaigns((c) => c.filter((x) => x.id !== deleteId))
      toast.success("Campaign deleted")
      setDeleteId(null)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-sm text-muted-foreground">
            Campaigns with status &quot;active&quot; appear on the homepage.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button asChild size="sm">
            <Link href="/product-manager/campaigns/new">
              <Plus className="h-4 w-4 mr-1" />
              New campaign
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-20 text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-20 text-center">
                  <p className="text-muted-foreground mb-2">No campaigns yet</p>
                  <Button asChild size="sm">
                    <Link href="/product-manager/campaigns/new">Create campaign</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded border overflow-hidden bg-muted shrink-0">
                        {c.thumbnail_url ? (
                          <Image
                            src={c.thumbnail_url}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-medium">{c.title}</p>
                        <Link
                          href={`/campaign/${c.slug}`}
                          className="text-xs text-primary hover:underline"
                        >
                          /campaign/{c.slug}
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{c.status}</Badge>
                    {c.is_featured && (
                      <Badge className="ml-1 bg-amber-500">Featured</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(Number(c.budget_total))}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/product-manager/campaigns/${c.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(c.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => !deleting && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. All related data will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <Button variant="destructive" disabled={deleting} onClick={handleDelete}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
